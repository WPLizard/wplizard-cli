/* eslint-disable no-await-in-loop */
import { Separator, checkbox, confirm, editor, input, select } from '@inquirer/prompts'
import chalk from 'chalk'
import { access, constants, mkdir, rm } from 'node:fs/promises'
import { join, resolve } from 'node:path';
import { v4 as uuidv4 } from 'uuid'

import { SkeletonPiece, SkeletonPieceOptions } from '../../types.js';
import { SuggestibleDirectories, SuggestibleDirectory } from '../constants/index.js';
import { CreateStructureChoice } from './types.js';

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
    private currentlySuggestedDirs = [...SuggestibleDirectories];
    private executed: boolean = false;
    private options: SkeletonPieceOptions = {
        lazy: true,
        optional: true,
    };

    private selectedDirectories: string[] = [];

    constructor(opts: Omit<SkeletonPieceOptions, 'optional'> = {}) {
        this.id = uuidv4();
        this.name = 'Create plugin\'s skeletal directories';
        this.description = 'This step will create the necessary directories that setup an architectural foundation for your plugin.\n';

        // Set the options.
        this.options = { ...this.options, ...opts };
    }

    get optional(): boolean {
        return this.options.optional;
    }

    // Public methods

    async action(): Promise<void> {
        if (this.executed) {
            console.log(chalk.yellow('The plugin\'s skeletal directories have already been created.'));
            return;
        }

        console.log(chalk.gray('\nCreating directories...'));
        this.executed = true;

        // Create the plugin's skeletal directories.
        const baseDir = resolve(process.cwd(), 'includes');

        let createdDirsCount = 0;
        try {
            for (const dir of this.selectedDirectories) {
                const dirPath = join(baseDir, dir);
                await mkdir(dirPath, { recursive: true });
                createdDirsCount++;
            }

            console.log(chalk.green(`Created ${createdDirsCount} directories.`));
        } catch (error) {
            console.log(chalk.red('An error occurred while creating the plugin\'s skeletal directories. Do you have the necessary permissions?'));
            throw error;
        }
    }

    async rollback(): Promise<void> {
        console.log(chalk.gray('Rolling back step one (create plugin\'s skeletal directories)...'));
        const baseDir = resolve(process.cwd(), 'includes');

        // Check if the plugin's directory is empty.
        try {
            // eslint-disable-next-line no-bitwise
            await access(baseDir, constants.W_OK | constants.R_OK);
            await rm(baseDir, { recursive: true });

            console.log(chalk.green('Step one rolled back successfully.'));
        } catch {
            console.log(chalk.red('An error occurred while rolling back step one.'));
        }
    }

    async start(): Promise<boolean> {
        console.clear();
        console.log(chalk.gray('Setup: Creating plugin\'s skeletal directories...'));

        // show two options: guided setup or manual setup
        const option = await this.selectSetupType();
        switch (option) {
            case 'guided': {
                console.log(chalk.gray('Starting guided setup...'));
                await this.startGuidedSetup();
                console.log(chalk.gray('Guided setup completed.'));
                break;
            }

            case 'manual': {
                console.log(chalk.gray('Starting manual setup...'));
                await this.startManualSetup();
                break;
            }

            default: {
                console.log(chalk.red('Invalid option selected. Aborting setup...'));
                return false;
            }
        }

        console.log(chalk.bgGray(`${this.selectedDirectories.length} directories enlisted for creation.`));

        try {
            this.completed = true;
            if (!this.options.lazy) {
                await this.action();
            }
        } catch {
            if (!this.options.lazy) {
                await this.rollback();
            }
            
            console.log(chalk.red('An error occurred while creating the plugin\'s skeletal directories.'));
            return false;
        }

        return true;
    }

    // Private methods

    /**
     * Process the custom directory entered by the user.
     * 
     * @param selected the selected choices to process
     * @param path the path to the current suggestible directories from the base suggestible directory
     * @param position the position of the current suggestible directories in the SuggestibleDirectories array
     * 
     * @returns a promise that resolves when the user is done selecting directories
     */
    private async completeGuidedSetup(selected: number[], path: null | string = null, position: number[] = []): Promise<void> {
        for (const each of selected.sort((a, b) => a - b)) {
            const dir = this.getDirectory([...position, each]);
            if (!dir) continue;
    
            const dirPath = path ? `${path}/${dir.name}` : dir.name;
            if (dir.directories) {
                position.push(each); // track the position of the current directory
                this.currentlySuggestedDirs = [...dir.directories]; // update the list of directories

                await this.startGuidedSetup(dirPath, [...position]);
                position.pop(); // remove the current directory from the position
            } else if (!this.selectedDirectories.includes(dirPath)) {
                this.selectedDirectories.push(dirPath);
            }
        }
    }

    /**
     * Get the choices for the currently suggested directories.
     * 
     * @param {string} [path=null] The path to the base suggestible directory.
     * @returns {CreateStructureChoice[]} An array of choices for the currently suggested directories.
     * 
     * @private
     * @memberof CreateStructure
     */
    private getChoices(path: null | string = null): CreateStructureChoice[] {
        return this.currentlySuggestedDirs.map((dir, index) => {
            const dirPath = path ? `${path}/${dir.name}` : dir.name;
            return {
                checked: dir.recommended || this.selectedDirectories.includes(dirPath),
                description: dir.description,
                name: `${dir.name}${dir.recommended ? chalk.yellow(' (recommended)') : ''}`,
                value: index,
            };
        });
    }

    /**
     * Get the directory at the specified position in the SuggestibleDirectories array.
     * 
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
     * Prompt the user to confirm if they want to create subdirectories for the current directory.
     * 
     * @param {string} message The message to display to the user.
     * @returns {Promise<boolean>} A promise that resolves to true if the user wants to create subdirectories, false otherwise.
     */
    private async promptForConfirm(message: string): Promise<boolean> {
        return confirm({
            default: false,
            message,
            transformer(input) {
                return input ? 'Yes' : 'No';
            },
        });
    }

    /**
     * Prompt the user for a description for the custom directory.
     * @returns {Promise<string>} A promise that resolves to the description entered by the user.
     */
    private async promptForCustomDirDescription(): Promise<string> {
        return editor({
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
    }

    /**
     * Prompt the user for the name of the directory they want to create.
     * 
     * @param {string} [path=null] The path to the current directory.
     * @returns {Promise<string>} A promise that resolves to the name of the directory entered by the user.
     */
    private async promptForDirectoryName(path: null | string = null): Promise<string> {
        let message = 'Enter the name of the '
        message += path ? `subdirectory you want to create [path: ${chalk.italic(path)}]:` : 'directory you want to create:';

        return input({
            message,
            transformer(input) {
                return input.trim();
            },
            validate: (input) => {
                if (!input) {
                    return 'Please enter a directory name.';
                }
    
                const fullPath = path ? `${path}/${input}` : input;
                if (this.selectedDirectories.includes(fullPath)) {
                    return 'The directory already exists. Please enter a different name.';
                }
    
                if (!/^[A-Z]\w*$/.test(input)) {
                    return 'The directory name must start with an uppercase letter and contain only letters, numbers, and underscores.';
                }
    
                return true;
            },
        });
    }
    
    /**
     * Process the custom directory entered by the user.
     * 
     * @param {string} [path=null] The path to the current directory.
     * @returns {Promise<void>} A promise that resolves when the user is done selecting directories.
     */
    private async selectCustomDirectory(path: null | string = null): Promise<void> {
        const dirName = await this.promptForDirectoryName(path);
        const customDirDesc = await this.promptForCustomDirDescription();
        
        this.selectedDirectories.push(path ? `${path}/${dirName}`: dirName);
        this.currentlySuggestedDirs.push({
            description: customDirDesc,
            name: dirName,
            recommended: false,
        });
    }
    
    /**
     * select directories to create.
     * 
     * @param choices the currently selected directories
     * @param path the path to the current directory
     * @returns a promise that resolves when the user is done selecting directories
     */
    private async selectDirectories(choices: CreateStructureChoice[], path: null | string = null): Promise<number[]> {
        const selected = await checkbox({
            choices: [...choices, new Separator(), { name: 'Custom', value: -1 }],
            message: `Select the directories you want to create [path: ${chalk.italic('./' + (path ?? ''))}]: `,
            pageSize: 10,
            required: true,
        });
    
        return selected as number[];
    }

    /**
     * Prompt the user to select a setup type.
     * 
     * @returns {Promise<string>} A promise that resolves to the setup type selected by the user.
     */
    private async selectSetupType(): Promise<string> {
        const choices = [
            { name: 'Guided setup', value: 'guided' },
            new Separator(),
            { name: 'Manual setup', value: 'manual' },
        ];
    
        return select({
            choices,
            default: 'guided',
            loop: false,
            message: 'Choose a setup type:',
        });
    }
    
    /**
     * Guide the user through the process of selecting directories to create.
     * 
     * @param {string} [path=null] The path to the current directory.
     * @param {number[]} [position=[]] The position of the current directory in the SuggestibleDirectories array.
     *
     * @returns {Promise<void>} A promise that resolves when the user is done selecting directories.
     */
    private async startGuidedSetup(path: null | string = null, position: number[] = []): Promise<void> {
        const choices = this.getChoices(path);

        const selected = await this.selectDirectories(choices, path);
        if (selected.includes(-1)) {
            await this.selectCustomDirectory(path);
        }

        await this.completeGuidedSetup(selected, path, position);
    }

    /**
     * Let the user manually create the plugin's directory structure.
     * It uses the stack data structure to monitor the depth of the subdirectories.
     * 
     * @returns {Promise<void>} A promise that resolves when the user is done creating the plugin's directory structure.
     */
    private async startManualSetup(): Promise<void> {
        const stack: {
            dirName: string;
            path: string;
        }[] = [];
        let currentDirPath = '';
        let completed = false;
    
        while (!completed) {
            const dirName = await this.promptForDirectoryName(currentDirPath);
            const fullPath = currentDirPath ? `${currentDirPath}/${dirName}` : dirName;
    
            if (this.selectedDirectories.includes(fullPath)) {
                console.log(chalk.red('The directory already exists. Please enter a different name.'));
                continue;
            }

            // confirm if the user wants to create subdirectories for the current directory
            if (await this.promptForConfirm('Do you want to create subdirectories for this directory?')) {
                stack.push({ dirName, path: currentDirPath });
                currentDirPath = fullPath;
                continue;
            }

            this.selectedDirectories.push(fullPath);

            // handle navigating back to the previous directory
            let back = true;
            while (back) {
                if (stack.length === 0) {
                    if (await this.promptForConfirm('Do you want to add another directory?')) {
                        currentDirPath = '';
                    } else {
                        completed = true;
                    }

                    break;
                }

                const last = stack.pop(); // remove the last directory from the stack
                if (!last) {
                    break;
                }

                // confirm if the user wants to create subdirectories for the last directory in the stack
                const path = chalk.italic('./' + (last.path ? `${last.path}/${last.dirName}` : last.dirName));
                if (await this.promptForConfirm(`Do you want to create subdirectories for the current directory? [path: ${path}]`)) {
                    currentDirPath = `${last.path}/${last.dirName}`;
                    stack.push(last); // add the last directory back to the stack
                    back = false;
                }
            }
        }

        console.log(chalk.gray('Manual setup completed.'));
    }
}
