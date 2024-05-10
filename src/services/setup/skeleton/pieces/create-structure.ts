import { Separator, checkbox, editor, input, select } from '@inquirer/prompts'
import chalk from 'chalk'
import { readdir } from 'node:fs/promises'
import { exit } from 'node:process';
import { v4 as uuidv4 } from 'uuid'

import { SkeletonPiece, SkeletonPieceOptions } from '../../types.js';
import { SuggestibleDirectories, SuggestibleDirectory } from '../constants/index.js';

/**
 * @summary This class performs the first step of the skeleton setup.
 * @description
 * It first checks if the plugin's directory is empty.
 * If it is not empty, it will prompt the user to either continue or abort the setup.
 * If empty or the user chooses to continue, it will create the plugin's directory structure.
 * 
 * Steps:
 * 1. Check if the plugin's directory is empty.
 * 2. If not empty, prompt the user to either continue or abort the setup.
 * 3. If empty or the user chooses to continue, does the following:
 *      - Asks for a description of the plugin (v2).
 *      - Uses the description to suggest some directories and their descriptions using GenAI (v2).
 *      - The user can mark any of the suggested directories they want to create.
 *      - The user can also add a custom directory and description.
 *      - Note: Some of the suggested directories are marked as required.
 *      - Once the user is done, the details are saved in global state and will be saved in the wplizard.config.json file at the end of the setup.
 */
export default class CreateStructure implements SkeletonPiece {
    public readonly description: string;
    public readonly id: string;
    public readonly name: string;
    private completed: boolean = false;
    private currentSuggestedDirs = [...SuggestibleDirectories];
    private executed: boolean = false;

    // log function to be used in the class.
    private log = console.log;

    private options: SkeletonPieceOptions = {
        lazy: true,
        optional: true,
    };

    private selectedDirectories: string[] = [];

    constructor(opts: Omit<SkeletonPieceOptions, 'optional'> = {}) {
        this.id = uuidv4();
        this.name = 'Create Plugin\'s Skeletal Directories';
        this.description = 'This step will create the necessary skeletal directories needed for the plugin to function on WordPress.\n';

        // Set the options.
        this.options = { ...this.options, ...opts };

        // start the setup
        this.start().then(async (done) => {
            if (done) {
                if (!this.options.lazy) {
                    await this.action();
                }

                this.completed = true;
            } else {
                if (!this.options.lazy) {
                    await this.rollback();
                }

                exit(1);
            }
        });
    }

    get optional(): boolean {
        return this.options.optional;
    }

    async action(): Promise<void> {
        if (this.executed) {
            return;
        }

        this.log(chalk.gray('Creating plugin\'s skeletal directories...'));
        this.executed = true;
    }

    async rollback(): Promise<void> {
        this.log(chalk.gray('Rolling back step one (create plugin\'s skeletal directories)...'));
    }

    async start(): Promise<boolean> {
        console.clear();
        this.log(chalk.gray('Setup: Creating plugin\'s skeletal directories...'));

        // Check if the plugin's directory is empty.
        const isEmpty = await this.isRootEmpty();
        if (!isEmpty) {
            this.log(chalk.yellow('The plugin\'s directory is not empty. Aborting setup...'));
            return false;
        }

        // show two options: guided setup or manual setup
        const choices = [
            { name: 'Guided setup', value: 'guided' },
            new Separator(),
            { name: 'Manual setup', value: 'manual' },
        ];

        const option = await select({
            choices,
            default: 'guided',
            loop: false,
            message: 'Choose a setup type:',
        });

        switch (option) {
            case 'guided': {
                this.log(chalk.gray('Starting guided setup...'));
                this.suggestDirectories().then(() => {
                    console.log(this.selectedDirectories);
                });
                break;
            }

            case 'manual': {
                this.log(chalk.gray('Starting manual setup...'));
                break;
            }

            default: {
                this.log(chalk.red('Invalid option selected. Aborting setup...'));
                return false;
            }
        }

        return true;
    }

    /**
     * Get the directory at the specified position in the SuggestibleDirectories array.
     * @param position an array of numbers representing the position of the directory in the SuggestibleDirectories array.
     * @returns the directory at the specified position.
     */
    private getDirectory(position: number[]): SuggestibleDirectory | null {
        if (position.length === 0) {
            return null;
        }

        let dirs = SuggestibleDirectories
        for (const index of position.slice(0, -1)) {
            dirs = dirs[index].directories as SuggestibleDirectory[];
        }

        return dirs[position.at(-1) as number];
    }

    /**
     * Checks if the plugin's directory is empty.
     * @returns {Promise<boolean>} A promise that resolves to true if the plugin's directory is empty, false otherwise.
     */
    private async isRootEmpty(): Promise<boolean> {
        try {
            const files = await readdir(this.options.root || process.cwd());
            return files.length === 0;
        } catch {
            this.log(chalk.red('An error occurred while checking if the plugin\'s directory is empty.'));
            return false;
        }
    }

    /**
     * Guide the user through the process of selecting directories to create.
     * 
     * @param {string} [path=null] The path to the current directory.
     * @param {number[]} [position=[]] The position of the current directory in the SuggestibleDirectories array.
     *
     * @returns {Promise<void>} A promise that resolves when the user is done selecting directories.
     */
    private async suggestDirectories(path: null | string = null, position: number[] = []): Promise<void> {
        // Show the list of directories to the user.
        const choices = this.currentSuggestedDirs.map((dir, index) => {
            const dirPath = path ? `${path}/${dir.name}` : dir.name;
            const required = dir.required ? chalk.redBright(' (required)') : '';

            return {
                checked: dir.required,
                description: dir.description,
                disabled: this.selectedDirectories.includes(dirPath) ? 'Already selected' : false,
                name: `${dir.name}${required}`,
                value: index,
            };
        });

        const selected = (await checkbox({
            choices: [...choices, new Separator(), { name: 'Add custom directory', value: -1 }],
            message: `Select the directories you want to create (path: ${chalk.underline(path ?? '.')}): `,
            pageSize: 10,
            required: true,
        }));

        // check if choices contain custom directory
        const custom = selected.indexOf(-1);
        if (custom !== -1) {
            selected.splice(custom, 1);

            const dirName = await input({
                message: 'Enter the name of the directory you want to create:',
                transformer(input) {
                    return input.trim();
                },
                validate: (input) => {
                    if (!input) {
                        return 'Please enter a directory name.';
                    }

                    // check if the directory already exists
                    if (this.selectedDirectories.includes(path ? `${path}/${input}` : input)) {
                        return 'The directory already exists. Please enter a different name.';
                    }

                    // check if the directory is a valid directory name (must start with an uppercase letter and contain only letters, numbers, and underscores)
                    if (!/^[A-Z]\w*$/.test(input)) {
                        return 'The directory name must start with an uppercase letter and contain only letters, numbers, and underscores.';
                    }

                    return true;
                },
            });

            const customDirDesc = await editor({
                message: 'Enter a description for the custom directory:',
                postfix: '.md',
                validate(input) {
                    if (!input) {
                        return 'Please enter a description for the custom directory.';
                    }

                    return true;
                },
                waitForUseInput: false,
            });

            this.selectedDirectories.push(`${path}/${dirName}`);
            this.currentSuggestedDirs.push({
                description: customDirDesc,
                name: dirName,
                required: true,
            });
        }

        // if any selected directory has subdirectories, recursively call this method
        for (const each of selected.sort((a, b) => a - b)) {
            const dir = this.getDirectory([...position, each]);
            if (!dir) continue;

            const dirPath = path ? `${path}/${dir.name}` : dir.name;
            if (dir.directories) {
                position.push(each); // track the position of the current directory
                this.currentSuggestedDirs = [...dir.directories]; // update the list of directories

                // eslint-disable-next-line no-await-in-loop
                await this.suggestDirectories(dirPath, [...position]);
                position.pop(); // remove the current directory from the position
            } else if (!this.selectedDirectories.includes(dirPath)) {
                this.selectedDirectories.push(dirPath);
            }
        }
    }
}
