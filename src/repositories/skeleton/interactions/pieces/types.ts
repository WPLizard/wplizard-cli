export type SkeletonPieceOptions = {
    lazy?: boolean;
    optional: boolean;
    root?: string
}

export interface SkeletonPiece {
    /**
     * @name action
     * @summary Runs the step's action.
     * 
     * @returns {Promise<void>} A promise that resolves when the action is complete.
     */    
    action(): Promise<void>;

    /**
     * @name description
     * @summary The step's description.
     */
    readonly description: string;

    /**
     * @name id
     * @summary The step's unique identifier.
     * 
     * @type {string} a uuid string
     */
    readonly id: string;

    /**
     * @name name
     * @summary The step's name.
     */
    readonly name: string;

    /**
     * @name optional
     * @summary Whether the step is optional.
     */
    readonly optional: boolean;

    /**
     * @name rollback
     * @summary Rolls back the step's action and reverts any changes made.
     * 
     * @returns {Promise<void>} A promise that resolves when the rollback is complete.
     */
    rollback(): Promise<void>;

    /**
     * @name start
     * @summary Starts the step.
     * 
     * @returns {Promise<boolean>} A promise that resolves to true if the step was started, false otherwise.
     */
    start(): Promise<boolean>;
}
