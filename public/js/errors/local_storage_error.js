export class LocalStorageError extends Error {
    constructor(message) {
        super(message);
        this.name = "LocalStorageError";
    }
}