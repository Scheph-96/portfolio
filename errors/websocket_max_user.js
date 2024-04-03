class WebSocketMaxUserError extends Error {
    constructor(message) {
        super(message);
        this.name = "WebSocketMaxUserError"
    }
}

module.exports = WebSocketMaxUserError;