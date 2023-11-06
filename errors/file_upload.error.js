class FileUploadError extends Error {
    constructor(message) {
        super(message);
        this.name = 'FileUploadError'
    }
}

module.exports = FileUploadError;