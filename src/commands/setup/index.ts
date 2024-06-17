import { Args, Command, Flags } from "@oclif/core";
import chalk from "chalk";
import { mkdir } from 'node:fs/promises'

import { setupSkeleton } from "../../services/setup/index.js";

export default class Setup extends Command {
    static args = {
        directory: Args.string({
            description: "The directory path to run the setup wizard in.",
            name: "directory",
            required: true
        })
    }

    static description = "Launches the setup wizard within the directory provided, operating under the assumption that the directory serves as the root of the project."

    static examples = [
        "<%= config.bin %> <%= command.id %> /path/to/directory",
        "<%= config.bin %> <%= command.id %> /path/to/directory --skeleton",
    ]

    static flags = {
        /**
         * @summary Whether to run the wizard in skeleton mode.
         * @description
         * This mode is turned off by default. When turned on, the wizard will only run the skeleton setup.
         */
        skeleton: Flags.boolean({
            char: "s",
            default: false,
            description: "Run the wizard in skeleton mode.",
            name: "skeleton"
        }),
    }

    /**
     * When the setup command is run directly, a directory path must be
     * provided and setup init will be run in that directory in lazy mode.
     * 
     * If the --skeleton flag is provided, the wizard will run in skeleton mode.
     * 
     * @returns {Promise<void>} - A promise that resolves when the command is done running.
     */
    async run() {
        console.clear()

        const { args, flags } = await this.parse(Setup)
        this.log(`Running the setup wizard in ${args.directory}...`)

        // create directory if it does not exist.
        try {
            this.log(`Creating "${args.directory}" if it does not exist...`)
            await mkdir(args.directory)
        } catch {
            this.error(chalk.red(`An error occurred while creating the directory "${args.directory}".`))
        }

        // if the --skeleton flag is not provided, run the skin setup
        if (!flags.skeleton) {
            // run the skin setup
        }

        // run the skeleton setup
        setupSkeleton(args.directory, true)
    }
}
