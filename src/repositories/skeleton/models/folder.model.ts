import { access, constants, mkdir, readdir, rename, rm, stat } from 'node:fs/promises'
import { join, resolve, sep } from 'node:path'
import { v4 as uuidv4 } from 'uuid'

import { Randomizer } from '../helpers/index.js';

class Folder {
    /**
     * The unique identifier of the folder.
     * @type {string}
     * @access public
     * @readonly
     */
    public readonly id: string = uuidv4();

    /**
     * The name of the folder.
     * Defaults to a randomly generated folder name.
     * @type {string}
     * @access private
     */
    private _name: string = Randomizer.name('folder');

    /**
     * The children of the folder.
     * @type {Folder[]}
     * @access private
     */
    private children: Folder[] = [];

    /**
     * The parent of the folder.
     * @type {Folder | null}
     * @access private
     */
    private parent: Folder | null = null;

    /**
     * The path of the folder.
     * @type {string}
     * @access private
     */
    private path: string;

    /**
     * Constructs a new folder.
     * @param {string} path The path of the folder.
     * @param {Folder | null} parent The parent of the folder.
     * @param onCreated A callback function to run when the folder is created.
     */
    constructor(path: string, parent: Folder | null = null, onCreated?: (self: Folder) => void) {
        // resolve the path and check if it exists
        this.path = resolve(path);
        Folder.exists(this.path).then(async (exists) => {
            if (!exists) {
                const created = await mkdir(this.path, { recursive: true });
                if (!created) {
                    throw new Error(`Failed to create folder at path: ${this.path}`);
                }

                if (onCreated) {
                    onCreated(this);
                }
            }
        });
        
        // extract the name from the path
        this._name = this.path.split(sep).pop() || this._name;
        
        // set the parent and add this folder as a child of the parent
        this.parent = parent;
        if (this.parent) {
            this.parent.addChild(this);
        }
    }

    /**
     * Check if path exists and is a directory.
     * 
     * @param {string} path The path to check.
     * @returns {boolean} Whether the path exists.
     */
    public static async exists(path: string): Promise<boolean> {
        try {
            await access(path, constants.F_OK);
            return true;
        } catch {
            return false;
        }
    }

    /**
     * Get the name of the folder.
     * 
     * @returns {string} The name of the folder.
     */
    get name(): string {
        return this._name;
    }

    /**
     * Update the name of the folder.
     * @param {string} name The new name of the folder.
     */
    set name(name: string) {
        // get the new path by replacing the last this._name.length characters of the path with the new name
        const newPath = this.path.slice(0, -this._name.length) + name;

        // check if the new path exists
        Folder.exists(newPath).then(async (exists) => {
            if (exists) {
                throw new Error(`Folder already exists at path: ${newPath}`);
            }

            // rename the folder
            await rename(this.path, newPath);

            // update the path and name
            this.path = newPath;
            this._name = name;
        });
    }

    /**
     * Get the children of the folder.
     * @returns {Folder[]} The children of the folder.
     */
    get nodes(): Folder[] {
        return this.children;
    }

    /**
     * Get folder stats.
     */
    get stat() {
        return stat(this.path);
    }

    /**
     * Add a child to the folder.
     * 
     * @param {Folder} child The child to add.
     * @returns {void}
     */
    public addChild(child: Folder): void {
        this.children.push(child);
    }

    /**
     * Get the files that are direct children of this folder (using the path).
     * @returns {string[]} The direct children of the folder.
     */
    async files(): Promise<string[]> {
        const contents = await readdir(this.path, { withFileTypes: true });
        if (contents.length === 0) {
            return [];
        }

        return contents.filter((ent) => ent.isFile()).map(ent => resolve(this.path, ent.name));
    }

    /**
     * Get the folders that are direct children of this folder (using the path).
     * @returns {Folder[]} The direct children of the folder.
     */
    async folders(): Promise<Folder[]> {
        const contents = await readdir(this.path, { withFileTypes: true });
        if (contents.length === 0) {
            return [];
        }

        const children = contents.filter((dirent) => dirent.isDirectory());
        return children.map((dirent) => new Folder(join(this.path, dirent.name), this));
    }

    /**
     * Move the folder to a new path.
     * 
     * @param {string} newPath The new path of the folder.
     * @returns {void}
     */
    public async move(newPath: string): Promise<void> {
        // check if the new path exists
        const exists = await Folder.exists(newPath);
        if (exists) {
            throw new Error(`Folder already exists at path: ${newPath}`);
        }
        
        // move the folder
        await rename(this.path, newPath);

        // update the path
        this.path = newPath;
    }

    /**
     * Remove the folder.
     * @returns {void}
     */
    public async remove(): Promise<void> {
        await rm(this.path, { recursive: true });

        // remove the folder from the parent's children
        if (this.parent) {
            this.parent.children = this.parent.children.filter((child) => child.id !== this.id);
        }

        this.parent = null;
    }
}

export default Folder;