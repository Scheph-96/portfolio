class Log {
    // constructor(timestamp, gmt, ipAddress, location, url, type, message=null) {
    //     this.timestamp = timestamp,
    //     this.gmt = gmt,
    //     this.ipAddress = ipAddress,
    //     this.location = location,
    //     this.url = url,
    //     this.type = type,
    //     this.message = message
    // }

    constructor(timestamp, level, ipAddress, url, method, message=null, stacktrace=null) {
        this.timestamp = timestamp,
        this.level = level,
        this.ipAddress = ipAddress,
        this.url = url,
        this.method = method,
        this.message = message,
        this.stacktrace = stacktrace
    }

    errorToString() {
        return `${this.timestamp} [${this.level}] ${this.ipAddress}:${this.url} | ${this.method}::${this.message}\n${this.stacktrace}\n`;
    }

    activityToString() {
        return `${this.timestamp} [${this.level}] ${this.ipAddress}:${this.url} | ${this.method}::${this.message}\n`;
    }

}


module.exports = Log;