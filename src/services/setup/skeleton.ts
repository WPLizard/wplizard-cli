import { confirm, select } from "@inquirer/prompts";
import chalk from "chalk";
import { readdir } from "node:fs/promises";
import path from "node:path";

import { PluginStructure, SkeletonPiece } from "../../repositories/skeleton/interactions/pieces/index.js";

/**
 * @summary This class is used by the SetupInitCommand class to setup the plugin's skeleton.
 * 
 * @description The SkeletonSetup class is used to setup the plugin's skeleton, which includes
 * the plugin's folder structure, the admin menu pages, starter files, and the essentials
 * necessary for the plugin to function on WordPress.
 * 
 * It is made up of 7 this.steps, which are:
 * - Step 1: Create the plugin's folder structure.
 * - Step 2: [OPTIONAL] Add dependencies.
 * - Step 3: [OPTIONAL] Setup admin menu pages.
 * - Step 4: Install the plugin's starter files.
 * - Step 5: [OPTIONAL] Generate documentation based on data from step 1-4.
 * - Step 6: Generate wplizard.config.json file.
 * - Step 7: Use the generated wplizard.config.json file, which contains the data from this.steps 1-5, to setup the plugin.
 * 
 * @class SkeletonSetup
 */
class Skeleton {
    private completedSteps: string[] = [];
    private currentStep: SkeletonPiece | null = null;
    private readonly lazy: boolean;
    private readonly root: string;
    private readonly steps: SkeletonPiece[];

    /**
     * Initializes the SkeletonSetup class.
     * 
     * @param {string} root The root folder path of the plugin.
     * @param {boolean} lazy If true, the setup will only execute after a wplizard.config.json file has been generated.
     */
    constructor(root: string, lazy: boolean) {
        this.root = root;
        this.lazy = lazy;

        // add the steps
        this.steps = [
            new PluginStructure({ lazy, root }),
            // new AddDependencies({ lazy, root }),
            // new SetupAdminMenuPages({ lazy, root }),
            // new InstallStarterFiles({ lazy, root }),
            // new GenerateDocumentation({ lazy, root }),
            // new GenerateConfig({ lazy, root }),
            // new SetupPlugin({ lazy, root }),
        ];

        // eslint-disable-next-line no-warning-comments
        // TODO: cache the active step and completed steps (PROBABLY in a file) to persist the state
        this.currentStep = this.steps[0];

        // Start the setup.
        this.setup().then((ready) => {
            if (!ready) return;
    
            // Run the setup.
            this.run();
            if (this.lazy) {
                // eslint-disable-next-line no-warning-comments
                // TODO: execute the wplizard.config.json file if the setup is in lazy mode
            }
        });
    }
    
    /**
     * @name pluginName
     * @description The plugin name from the root folder.
     * 
     * @readonly
     * @returns {string} The plugin name.
     */
    get pluginName(): string {
        return path.basename(this.root);
    }

    /**
     * @name activateStep
     * @summary Runs a specific step.
     * 
     * @param {string} id The step id to run.
     * @returns {Promise<boolean>} A promise that resolves when the step is complete.
     */
    private async activateStep(id: string): Promise<boolean> {
        if (this.currentStep?.id === id) {
            return true
        }
        
        const selectedStep = this.steps.find(step => id === step.id);
        if (selectedStep) {
            this.currentStep = selectedStep;
        }

        return selectedStep !== undefined
    }
    
    /**
     * Checks if the plugin's folder is empty.
     * @returns {Promise<boolean>} A promise that resolves to true if the plugin's folder is empty, false otherwise.
     */
    private async isPluginFolderEmpty(): Promise<boolean> {
        try {
            const files = await readdir(this.root || process.cwd());
            return files.length === 0;
        } catch {
            console.log(chalk.red('An error occurred while checking if the plugin\'s folder is empty.'));
            return false;
        }
    }

    /**
     * @name isStepCompleted
     * @summary Checks if a step is completed.
     * 
     * @param {string} id The step id to check.
     * @returns {boolean} True if the step is completed, false otherwise.
     */
    private isStepCompleted(id: string): boolean {
        return this.completedSteps.includes(id);
    }

    /**
     * @name isStepDisabled
     * @summary Checks if a step is disabled.
     * 
     * @param {string} id The step id to check.
     * @returns {boolean} True if the step is disabled, false otherwise.
     */
    private isStepDisabled(id: string): boolean {
        const completed = this.isStepCompleted(id);
        return (!completed && id !== this.currentStep?.id) || (completed && (!this.lazy || id === 'generate-config'))
    }

    /**
     * @name run
     * @description Runs the skeleton setup.
     * 
     * @returns {Promise<void>} A promise that resolves when the setup is complete.
     */
    private async run() {
        if (!this.currentStep) return;

        // Run the active step.
        const completed = await this.currentStep.start();
        if (!completed) {
            console.log(chalk.red('An error occurred while running the step.'));
            return;
        }

        if (!this.lazy) {
            try {
                await this.currentStep.action();
            } catch {
                await this.currentStep.rollback(); // rollback changes
                this.currentStep = null; // reset the current step

                console.log(chalk.red('An error occurred while running this step.'));
                return;
            }
        }

        // Add the active step to the completed this.steps array.
        this.completedSteps.push(this.currentStep.id);

        // Set the next step as the active step.
        this.currentStep = this.completedSteps.length < this.steps.length ? this.steps[this.completedSteps.length] : null;

        // Run the next step if it exists.
        if (this.currentStep) {
            await this.run();
        }
    }

    /**
     * @name setup
     * @summary Shows the list of this.steps to the user.
     * @description
     * This method does the following:
     * - Shows the list of steps to the user.
     * - Marks the completed this.steps as done (using a checkmark) if the user has run the setup before.
     * - Allows the user to click on the completed this.steps to rerun any of them if it's not step 6 and the setup is in lazy mode.
     * - Set the active step to the selected step.
     * - Trigger the hook that runs the selected step.
     * 
     * @returns {Promise<boolean>} A promise that resolves when the user has selected a step.
     */
    private async setup(): Promise<boolean> {
        // Check if the plugin's folder is empty.
        const isEmpty = await this.isPluginFolderEmpty();
        if (!isEmpty) {
            console.log(chalk.yellow('The plugin\'s folder is not empty. Aborting setup...'));
            return false;
        }

        const choices = this.steps.map((step, index) => {
            const disabled = this.isStepDisabled(step.id);
            const completed = this.isStepCompleted(step.id);

            const name = `Step ${index + 1}: ` + chalk.yellow(`${step.name} ${completed ? chalk.green('(✔)') : ''}`);

            return {
                description: chalk.yellowBright(chalk.bold("\n=> " + step.description)),
                disabled,
                name: disabled ? chalk.gray(name) : completed ? chalk.bold(name) : name,
                value: step.id,
            }
        });

        const stepId = await select({
            choices,
            default: this.currentStep?.id,
            loop: true,
            message: 'Select a step to run:',
        });

        // confirm step rerun if step is already completed and not step 6
        if (this.lazy && this.completedSteps.includes(stepId) && stepId !== 'generate-config') {
            const rerun = await confirm({ message: 'This step has already been completed. Do you want to rerun it?' });

            if (!rerun) {
                console.log(chalk.yellow('Skipping step...'));

                // show this.steps options again
                await this.setup();
                return false;
            }
        }

        return this.activateStep(stepId);
    }
}

export default function (project: string, lazy: boolean) {
    return new Skeleton(project, lazy);
}
