import { Command, Flags } from '@oclif/core'
import chalk from 'chalk'

import { setupSkeleton } from '../../services/setup/index.js'

export default class Init extends Command {
  static override args = {}

  static override description = 'Launches the setup wizard within the current directory, operating under the assumption that the current directory serves as the root of the project.'

  static override examples = [
    '<%= config.bin %> <%= command.id %>',
    '<%= config.bin %> <%= command.id %> --skeleton',
    '<%= config.bin %> <%= command.id %> --lazy=false',
    '<%= config.bin %> <%= command.id %> --run-installers',
  ]

  static override flags = {
    /**
     * @summary Whether to run the setup wizard in lazy mode.
     * @description
     * This mode is turned on by default and will only run the configuration after a wplizard.config.json
     * has been generated in the root of the project.
     * 
     * @example
     * ```bash
     * $ wplizard-cli setup init --lazy=false
     * ```
     */
    lazy: Flags.boolean({
      char: 'l',
      default: false,
      description: 'Run the setup wizard in lazy mode.',
      name: 'lazy',
    }),

    /**
     * @summary Run the installers after the setup wizard has completed.
     * @description
     * This flag will run the installers after the setup wizard has completed.
     * After the skeleton setup, it will run `composer install`
     * and `npm install` if the UI-related part of the setup is completed.
     * 
     * This means that when the setup wizard is run in skeleton mode, only `composer install` will be run.
     * And when the setup wizard is run in full mode, both `composer install` and `npm install` will be run.
     * 
     * @example
     * ```bash
     * $ wplizard-cli setup init --run-installers
     * ```
     */
    runInstallers: Flags.boolean({
      aliases: ['ri'],
      char: 'r',
      default: false,
      description: 'Run the installers after the setup wizard has completed.',
      name: 'run-installers',
    }),

    /**
     * @summary Whether to run the setup wizard in skeleton mode.
     * @description This mode will only setup the project's skeleton, which includes the plugin's directory structure, configuration files,
     * and other essential files necessary for the plugin to function on WordPress.
     * 
     * @example
     * ```bash
     * $ wplizard-cli setup init --skeleton
     * ```
     */
    skeleton: Flags.boolean({
      char: 'b',
      default: false,
      description: 'Run the setup wizard in skeleton mode.',
      name: 'skeleton',
    }),
  }

  public async run(): Promise<void> {
    console.clear()
    this.log(chalk.gray("Starting setup wizard...\n"))
    
    const { flags } = await this.parse(Init)
    
    if (flags.skeleton) {
      this.log(chalk.bgCyan(chalk.white('Running setup wizard in skeleton mode...')))
    }

    // Run the skeleton setup.
    setupSkeleton(process.cwd(), flags.lazy)
  }
}
