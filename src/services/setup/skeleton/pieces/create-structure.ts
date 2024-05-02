// import { select } from '@inquirer/prompts'
import chalk from 'chalk'
import { v4 as uuidv4 } from 'uuid'

import { SkeletonPiece, SkeletonPieceOptions } from '../../types.js';

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
 *      - Asks for a description of the plugin.
 *      - Uses the description to suggest some directories and their descriptions using GenAI.
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
    private options: SkeletonPieceOptions = {
        lazy: true,
        optional: true,
    };

    constructor(opts: Omit<SkeletonPieceOptions, 'optional'> = {}) {
        this.id = uuidv4();
        this.name = 'Create Plugin\'s Skeletal Directories';
        this.description = 'This step will create the necessary skeletal directories needed for the plugin to function on WordPress.';

        // Set the options.
        this.options = { ...this.options, ...opts };
    }

    get optional(): boolean {
        return this.options.optional;
    }

    async action(): Promise<boolean> {
        console.log(chalk.gray('Creating plugin\'s skeletal directories...'));
        return true;
    }

    async rollback(): Promise<boolean> {
        console.log(chalk.gray('Rolling back step one (create plugin\'s skeletal directories)...'));
        return true;
    }
}
