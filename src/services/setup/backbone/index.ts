import { confirm, select } from "@inquirer/prompts";
import chalk from "chalk";
import path from "node:path";

import { BackboneSetupStep } from "../types.js";
import steps from "./steps/index.js";

/**
 * @summary This class is used by the SetupInitCommand class to setup the plugin's backbone.
 * 
 * @description The BackboneSetup class is used to setup the plugin's backbone, which includes
 * the plugin's directory structure, the admin menu pages, starter files, and the essentials
 * necessary for the plugin to function on WordPress.
 * 
 * It is made up of 7 steps, which are:
 * - Step 1: Create the plugin's directory structure.
 * - Step 2: [OPTIONAL] Add dependencies.
 * - Step 3: [OPTIONAL] Setup admin menu pages.
 * - Step 4: Install the plugin's starter files.
 * - Step 5: [OPTIONAL] Generate documentation based on data from step 1-4.
 * - Step 6: Generate wplizard.config.json file.
 * - Step 7: Use the generated wplizard.config.json file, which contains the data from steps 1-5, to setup the plugin.
 * 
 * @class BackboneSetup
 */
class Backbone {
    private completedSteps: string[] = [];
    private currentStep: BackboneSetupStep | null = null;
    private readonly lazy: boolean;
    private readonly root: string;

    /**
     * Initializes the BackboneSetup class.
     * 
     * @param {string} root The root directory path of the plugin.
     * @param {boolean} lazy If true, the setup will only execute after a wplizard.config.json file has been generated.
     */
    constructor(root: string, lazy: boolean) {
        this.root = root;
        this.lazy = lazy;

        // eslint-disable-next-line no-warning-comments
        // TODO: cache the active step and completed steps in a file to persist the state
        this.currentStep = steps[0];

        // Start the setup.
        this.setup().then(() => {
            // Run the setup.
            this.run();
        });
    }
    
    /**
     * @name pluginName
     * @description The plugin name from the root directory.
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
     * @returns {Promise<void>} A promise that resolves when the step is complete.
     */
    private async activateStep(id: string) {
        const selectedStep = steps.find(step => id === step.id);
        if (selectedStep) {
            this.currentStep = selectedStep;
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
     * @description Runs the backbone setup.
     * 
     * @returns {Promise<void>} A promise that resolves when the setup is complete.
     */
    private async run() {
        if (!this.currentStep) return;

        // Run the active step.
        await this.currentStep.action({ lazy: this.lazy });

        // Add the active step to the completed steps array.
        this.completedSteps.push(this.currentStep.id);

        // Set the next step as the active step.
        this.currentStep = this.completedSteps.length < steps.length ? steps[this.completedSteps.length] : null;

        // Run the next step if it exists.
        if (this.currentStep) {
            await this.run();
        }
    }

    /**
     * @name setup
     * @summary Shows the list of steps to the user.
     * @description
     * This method does the following:
     * - Shows the list of steps to the user.
     * - Marks the completed steps as done (using a checkmark) if the user has run the setup before.
     * - Allows the user to click on the completed steps to rerun any of them if it's not step 6 and the setup is in lazy mode.
     * - Set the active step to the selected step.
     * - Trigger the hook that runs the selected step.
     * 
     * @returns {Promise<void>} A promise that resolves when the user has selected a step.
     */
    private async setup() {
        const choices = steps.map((step) => ({
            description: "\n" + step.description,
            disabled: this.isStepDisabled(step.id),
            name: `${step.name} ${this.isStepCompleted(step.id) ? chalk.green('(✔)') : ''}`,
            value: step.id,
        }));

        const stepId = await select({
            choices,
            default: this.currentStep?.id,
            loop: false,
            message: 'Select a step to run:',
        });

        // confirm step rerun if step is already completed and not step 6
        if (this.lazy && this.completedSteps.includes(stepId) && stepId !== 'generate-config') {
            const rerun = await confirm({ message: 'This step has already been completed. Do you want to rerun it?' });

            if (!rerun) {
                console.log(chalk.yellow('Skipping step...'));

                // show steps options again
                await this.setup();
                return;
            }
        }

        this.activateStep(stepId);
    }
}

export default function (project: string, lazy: boolean) {
    return new Backbone(project, lazy);
}
