/* eslint-disable no-await-in-loop */
import { Separator, checkbox, confirm, editor, input, select } from '@inquirer/prompts'
import chalk from 'chalk'
import { resolve } from 'node:path';

import suggestibleFolders from '../../constants/suggestible-folders.js';
import Randomizer from '../../helpers/randomizer.js';
import { Folder } from '../../models/index.js';
import { SuggestibleFolder } from '../../types.js';
import { showProgress } from '../utils.js';
import { SkeletonPiece, SkeletonPieceOptions } from './types.js';

type Choice = {
    checked?: boolean;
    description: string;
    disabled?: boolean;
    name: string;
    value: number | string;
}

/**
 * @summary This class performs the first step of the skeleton setup.
 * @description
 * It first checks if the plugin's folder is empty.
 * If it is not empty, it will prompt the user to either continue or abort the setup.
 * If empty or the user chooses to continue, it will create the plugin's folder structure.
 * 
 * Steps:
 * 1. Check if the plugin's folder is empty.
 * 2. If not empty, prompt the user to either continue or abort the setup.
 * 3. If empty or the user chooses to continue, does the following:
 *      - Asks for a description of the plugin (v2).
 *      - Uses the description to suggest some folders and their descriptions using GenAI (v2).
 *      - The user can mark any of the suggested folders they want to create.
 *      - The user can also add a custom folder and description.
 *      - Note: Some of the suggested folders are marked as required.
 *      - Once the user is done, the details are saved in global state and will be saved in the wplizard.config.json file at the end of the setup.
 */
export default class PluginStructure implements SkeletonPiece {
    public readonly base: Folder;
    public readonly description: string;
    public readonly id: string;
    public readonly name: string;
    private completed: boolean = false;
    private currentSuggestions = [...suggestibleFolders];
    private executed: boolean = false;
    private options: SkeletonPieceOptions = {
        lazy: true,
        optional: true,
    };

    private selectedFolders: string[] = [];

    constructor(options?: Omit<SkeletonPieceOptions, 'optional'>) {
        this.id = Randomizer.name('plugin', 32);
        this.name = 'Define Plugin Structure';
        this.description = 'This step will guide you through creating the necessary folders that define the structural architecture of your plugin.';

        // set the options
        if (options) {
            this.options = { ...this.options, ...options };
        }

        // create the base folder
        this.base = new Folder(resolve(this.options.root || process.cwd()));
    }

    get optional(): boolean {
        return this.options.optional;
    }

    // Public Methods

    async action(): Promise<void> {
        if (this.executed) {
            console.log(chalk.yellowBright('This step has already been executed.'));
            return;
        }

        console.log(chalk.grey('Creating selected folders...'));

        const results: {
            createdAt: string;
            name: string;
            permissions: string;
            size: string;
        }[] = [];

        showProgress(this.selectedFolders.length, (bar) => {
            // setup the base folder and create the selected folders
            for (const path of this.selectedFolders) {
                // eslint-disable-next-line no-new
                new Folder(path, this.base, async (self) => {
                    const { ctime, mode, size } = await self.stat;
                    results.push({
                        createdAt: ctime.toUTCString(),
                        name: self.name,
                        permissions: mode.toString(8).slice(-3),
                        size: (size / 1024) + 'KB',
                    })
                });

                // update the progress bar
                bar.increment();
            }
        });

        // show the results to the user in a table
        setTimeout(() => {
            console.table(results, ['name', 'createdAt', 'permissions', 'size']);
        }, 1000);
    }

    async rollback(): Promise<void> {
        console.log(chalk.grey('Disposing of selected folders...'));
        
        // remove whatever folders were created
        showProgress(this.base.nodes.length, async (bar) => {
            const results: Promise<void>[] = this.base.nodes.map((node) => {
                bar.increment();
                return node.remove();
            });

            // wait for all the results to resolve
            await Promise.all(results);
        });

        console.log(chalk.green('Already created folders have been deleted.'));
    }

    async start(): Promise<boolean> {
        console.clear();
        console.log(chalk.gray('Setup: Creating plugin\'s skeletal folders...'));

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

        this.completed = true;
        console.log(chalk.bgCyan(chalk.bold(`${this.selectedFolders.length} folders enlisted for creation.`)));

        return true;
    }

    // Private Methods

    /**
     * Process the custom folder entered by the user.
     * 
     * @param selected the selected choices to process
     * @param path the path to the current suggestible folders from the base suggestible folder
     * @param position the position of the current suggestible folders in the SuggestibleFolders array
     * 
     * @returns a promise that resolves when the user is done selecting folders
     */
    private async completeGuidedSetup(selected: number[], path: null | string = null, position: number[] = []): Promise<void> {
        for (const each of selected.sort((a, b) => a - b)) {
            const dir = this.getFolder([...position, each]);
            if (!dir) continue;
    
            const dirPath = path ? `${path}/${dir.name}` : dir.name;
            if (dir.folders) {
                position.push(each); // track the position of the current folder
                this.currentSuggestions = [...dir.folders]; // update the list of folders

                await this.startGuidedSetup(dirPath, [...position]);
                position.pop(); // remove the current folder from the position
            } else if (!this.selectedFolders.includes(dirPath)) {
                this.selectedFolders.push(dirPath);
            }
        }
    }

    /**
     * Get the choices for the currently suggested folders.
     * 
     * @param {string} [path=null] The path to the base suggestible folder.
     * @returns {Choice[]} An array of choices for the currently suggested folders.
     * 
     * @private
     * @memberof CreateStructure
     */
    private getChoices(path: null | string = null): Choice[] {
        return this.currentSuggestions.map((dir, index) => {
            const dirPath = path ? `${path}/${dir.name}` : dir.name;
            return {
                checked: dir.recommended || this.selectedFolders.includes(dirPath),
                description: dir.description,
                name: `${dir.name}${dir.recommended ? chalk.yellow(' (recommended)') : ''}`,
                value: index,
            };
        });
    }

    /**
     * Get the folder at the specified position in the suggestibleFolders array.
     * 
     * @param position an array of numbers representing the position of the folder in the SuggestibleFolders array.
     * @returns the folder at the specified position.
     */
    private getFolder(position: number[]): SuggestibleFolder | null {
        if (position.length === 0) {
            return null;
        }

        let dirs = suggestibleFolders;
        for (const index of position.slice(0, -1)) {
            dirs = dirs[index].folders as SuggestibleFolder[];
        }

        return dirs[position.at(-1) as number];
    }

    /**
     * Prompt the user to confirm if they want to create subfolders for the current folder.
     * 
     * @param {string} message The message to display to the user.
     * @returns {Promise<boolean>} A promise that resolves to true if the user wants to create subfolders, false otherwise.
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
     * Prompt the user for a description for the custom folder.
     * @returns {Promise<string>} A promise that resolves to the description entered by the user.
     */
    private async promptForCustomDirDescription(): Promise<string> {
        return editor({
            message: 'Enter a description for the custom folder:',
            postfix: '.md',
            validate(input) {
                if (!input) {
                    return 'Please enter a description for the custom folder.';
                }
    
                return true;
            },
            waitForUseInput: false,
        });
    }

    /**
     * Prompt the user for the name of the folder they want to create.
     * 
     * @param {string} [path=null] The path to the current folder.
     * @returns {Promise<string>} A promise that resolves to the name of the folder entered by the user.
     */
    private async promptForFolderName(path: null | string = null): Promise<string> {
        let message = 'Enter the name of the '
        message += path ? `subfolder you want to create [path: ${chalk.italic(path)}]:` : 'folder you want to create:';

        return input({
            message,
            transformer(input) {
                return input.trim();
            },
            validate: (input) => {
                if (!input) {
                    return 'Please enter a folder name.';
                }
    
                const fullPath = path ? `${path}/${input}` : input;
                if (this.selectedFolders.includes(fullPath)) {
                    return 'The folder already exists. Please enter a different name.';
                }
    
                if (!/^[A-Z]\w*$/.test(input)) {
                    return 'The folder name must start with an uppercase letter and contain only letters, numbers, and underscores.';
                }
    
                return true;
            },
        });
    }

    /**
     * Process the custom folder entered by the user.
     * 
     * @param {string} [path=null] The path to the current folder.
     * @returns {Promise<void>} A promise that resolves when the user is done selecting folders.
     */
    private async selectCustomFolder(path: null | string = null): Promise<void> {
        const dirName = await this.promptForFolderName(path);
        const customDirDesc = await this.promptForCustomDirDescription();
        
        this.selectedFolders.push(path ? `${path}/${dirName}`: dirName);
        this.currentSuggestions.push({
            description: customDirDesc,
            name: dirName,
            recommended: false,
        });
    }
    
    /**
     * select folders to create.
     * 
     * @param choices the currently selected folders
     * @param path the path to the current folder
     * @returns a promise that resolves when the user is done selecting folders
     */
    private async selectFolders(choices: Choice[], path: null | string = null): Promise<number[]> {
        const selected = await checkbox({
            choices: [...choices, new Separator(), { name: 'Custom', value: -1 }],
            message: `Select the folders you want to create [path: ${chalk.italic('./' + (path ?? ''))}]: `,
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
     * Guide the user through the process of selecting folders to create.
     * 
     * @param {string} [path=null] The path to the current folder.
     * @param {number[]} [position=[]] The position of the current folder in the SuggestibleFolders array.
     *
     * @returns {Promise<void>} A promise that resolves when the user is done selecting folders.
     */
    private async startGuidedSetup(path: null | string = null, position: number[] = []): Promise<void> {
        const choices = this.getChoices(path);

        const selected = await this.selectFolders(choices, path);
        if (selected.includes(-1)) {
            await this.selectCustomFolder(path);
        }

        await this.completeGuidedSetup(selected, path, position);
    }

    /**
     * Let the user manually create the plugin's folder structure.
     * It uses the stack data structure to monitor the depth of the subfolders.
     * 
     * @returns {Promise<void>} A promise that resolves when the user is done creating the plugin's folder structure.
     */
    private async startManualSetup(): Promise<void> {
        const stack: {
            dirName: string;
            path: string;
        }[] = [];
        let currentDirPath = '';
        let completed = false;
    
        while (!completed) {
            const dirName = await this.promptForFolderName(currentDirPath);
            const fullPath = currentDirPath ? `${currentDirPath}/${dirName}` : dirName;
    
            if (this.selectedFolders.includes(fullPath)) {
                console.log(chalk.red('The folder already exists. Please enter a different name.'));
                continue;
            }

            // confirm if the user wants to create subfolders for the current folder
            if (await this.promptForConfirm('Do you want to create subfolders for this folder?')) {
                stack.push({ dirName, path: currentDirPath });
                currentDirPath = fullPath;
                continue;
            }

            this.selectedFolders.push(fullPath);

            // handle navigating back to the previous folder
            let back = true;
            while (back) {
                if (stack.length === 0) {
                    if (await this.promptForConfirm('Do you want to add another folder?')) {
                        currentDirPath = '';
                    } else {
                        completed = true;
                    }

                    break;
                }

                const last = stack.pop(); // remove the last folder from the stack
                if (!last) {
                    break;
                }

                // confirm if the user wants to create subfolders for the last folder in the stack
                const path = chalk.italic('./' + (last.path ? `${last.path}/${last.dirName}` : last.dirName));
                if (await this.promptForConfirm(`Do you want to create subfolders for the current folder? [path: ${path}]`)) {
                    currentDirPath = `${last.path}/${last.dirName}`;
                    stack.push(last); // add the last folder back to the stack
                    back = false;
                }
            }
        }

        console.log(chalk.gray('Manual setup completed.'));
    }
}