class AppServerResponse {
    /**
     * 
     * @param {String} type response type
     * @param {String} message response message
     * @param {String} data response data
     * @param {String} redirectionUrl if a redirection has to be performed, add a redirection url
     * @param {String} page if a page has to be returned, add the page content. Eg: ejs.renderFile()
     */
    constructor(type, message, data=null, redirectionUrl=null, page=null) {
        this.type = type;
        this.message = message;
        data? this.data = data : "";
        redirectionUrl? this.redirectionUrl = redirectionUrl : "";
        page? this.page = page : "";
    }
}

module.exports = AppServerResponse;