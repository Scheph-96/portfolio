export class FileLoadingError extends Error {
    constructor(message) {
        super(message);
        this.name = "FileLoadingError";
    }
}