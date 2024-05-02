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
     * @returns {Promise<boolean>} A promise that resolves to true if the step was successful, false otherwise.
     */    
    action(): Promise<boolean>;

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
     * @returns {Promise<boolean>} A promise that resolves to true if the rollback was successful, false otherwise.
     */
    rollback(): Promise<boolean>;
}
