import { FileLoadingError } from '../plugins/errors/load_file_error.js';

/**
 *  Use FileLoader objects to load or include file content in your code
 */
export class FileLoader {

    #xhttp = new XMLHttpRequest();

    /**
     * Load html snippets from file
     * @param {String} filename The file containing the snippet
     * @param {Boolean} directRender Return directly or send through event
     * @param {Node} eventTarget The target that receive the event once the data is ready
     * @param {Node} node The node that will contains the loaded data
     */
    loadHtml(filename, eventTarget, node) {
        // Listen to XMLHttpRequest status change
        this.#xhttp.onreadystatechange = () => {
            // 0: request not initialized
            // 1: server connection established
            // 2: request received
            // 3: processing request
            // 4: request finished and response is ready

            // when user want to signal the end of the request and send the response through an event 
            if (this.#xhttp.readyState === 4 && this.#xhttp.status === 200 && !node) {
                eventTarget.dispatchEvent(new CustomEvent('file-loaded', { detail: { data: this.#xhttp.responseText } }));
                // when user want to directly load the request response in the destination node
            } else if (this.#xhttp.readyState === 4 && this.#xhttp.status === 200 && node) { 
                node.innerHTML = this.#xhttp.responseText;
                // throw a new error when the request is finished but there is a problem with the file
            } else if(this.#xhttp.readyState === 4 && this.#xhttp.status !== 200) {
                throw new FileLoadingError(`Unable to load ressource:: status: ${this.#xhttp.status}`);
            }
        }

        // Etablish connection with the server
        this.#xhttp.open('GET', filename);

        // Send request
        this.#xhttp.send()
    }
}