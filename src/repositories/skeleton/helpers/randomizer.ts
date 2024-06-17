import { v4 as uuidv4 } from "uuid";

class Randomizer {
    /**
     * Generates a random name based on the context.
     * 
     * @param {string} context The context to generate the random name from.
     * @param {number} length The length of the random name.
     * 
     * @returns {string} The generated random name.
     */
    public static name(context: 'file' | 'folder' | 'plugin' = 'file', length = 16): string {
        const characters = context + Randomizer.shuffle('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789');
        let result = '';
        
        const midpoint = Math.floor(length / 2);
        while (result.length < midpoint) {
            result += characters.charAt(Math.floor(Math.random() * characters.length));
        }

        // Add uuid (last midpoint/2 characters) and timestamp (last midpoint/2 characters) to the result
        result += Randomizer.uuid(Math.floor(midpoint / 2)) + Randomizer.timestamp(Math.floor(midpoint / 2));
        return result;
    }

    /**
     * Shuffle the characters of a string.
     * @param {string} str The string to shuffle.
     * 
     * @returns {string} The shuffled string.
     */
    public static shuffle(str: string): string {
        const a = [...str];
        const n = a.length;
        
        for (let i = n - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [a[i], a[j]] = [a[j], a[i]];
        }

        return a.join('');
    }

    /**
     * Get the current timestamp and return the first or last n characters.
     * @param {number} n The length of the timestamp to return.
     * @param {boolean} first Whether to return the first n characters.
     * 
     * @returns {string} The generated timestamp.
     */
    private static timestamp(n: number, first: boolean = false): string {
        const ts = Date.now().toString()
        return first ? ts.slice(0, n) : ts.slice(-n);
    }

    /**
     * Generates a uuid string and returns the first or last n characters.
     * @param {number} n The length of the uuid string to return.
     * @param {boolean} first Whether to return the first n characters.
     * 
     * @returns {string} The generated uuid string.
     */
    private static uuid(n: number, first: boolean = false): string {
        const u = uuidv4().toString().replaceAll('-', '')
        return first ? u.slice(0, n) : u.slice(-n);
    }
}

export default Randomizer;