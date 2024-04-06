import { FileLoadingError } from '../errors/load_file_error.js';
import { alertToast } from "./util.js";

/**
 *  Use FileLoader objects to load or include file content in your code
 */
export class AjaxRequest {

    #xhttp = new XMLHttpRequest();

    /**
     * Load html snippets from file
     * @param {String} filename The file containing the snippet
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
            console.log(`THE NODE: ${node}`);
            if (this.#xhttp.readyState === 4 && this.#xhttp.status === 200 && !node) {
                eventTarget.dispatchEvent(new CustomEvent('file-loaded', { detail: { data: this.#xhttp.responseText } }));
                // when user want to directly load the request response in the destination node
            } else if (this.#xhttp.readyState === 4 && this.#xhttp.status === 200 && node) {
                node.innerHTML = this.#xhttp.responseText;
                // throw a new error when the request is finished but there is a problem with the file
            } else if (this.#xhttp.readyState === 4 && this.#xhttp.status !== 200) {
                let error = JSON.parse(this.#xhttp.responseText);
                alertToast(error.type, error.message);
                throw new FileLoadingError(`Unable to load ressource:: status: ${this.#xhttp.status}`);
            }
        }

        // Etablish connection with the server
        this.#xhttp.open('GET', filename);

        // Send request
        this.#xhttp.send()
    }

    loadEndPoint(url) {
        return new Promise((resolve, reject) => {
            this.#query('GET', null, url, this.#xhttp, () => {
                try {
                    if (this.#xhttp.status.toString().includes(20)) {
                        console.log("THA RESPONSE: ", this.#xhttp.responseText);
                        console.log("THE PARSED ATTRIBUTE: ", JSON.parse(this.#xhttp.responseText));
                        resolve(JSON.parse(this.#xhttp.responseText));
                    } else {
                        console.log('REJECT!!!');
                        console.log(JSON.parse(this.#xhttp.responseText));
                        reject({ status: this.#xhttp.status, error: `Unable to load ressource:: status: ${this.#xhttp.status}`, errorMessage: JSON.parse(this.#xhttp.responseText) });
                    
                    }
                } catch (err) {
                    reject({
                        error: `Unable to load ressource::${err.message}`, errorMessage: JSON.parse({
                            type: 'danger',
                            message: 'Unknown error',
                        })
                    });
                }
            });
        });

    }

    submitForm(url, data) {
        return new Promise((resolve, reject) => {
            console.log(1);
            this.#query('POST', data, url, this.#xhttp, () => {
                try {
                    console.log('POST: ', this.#xhttp.status);
                    if (this.#xhttp.status.toString().includes(20)) {
                        console.log("THA RESPONSE: ", this.#xhttp.responseText);
                        console.log("THE PARSED ATTRIBUTE: ", JSON.parse(this.#xhttp.responseText));
                        resolve(JSON.parse(this.#xhttp.responseText));
                    } else {
                        console.log('REJECT!!!');
                        console.log(JSON.parse(this.#xhttp.responseText));
                        reject({ status: this.#xhttp.status, error: `Unable to load ressource:: status: ${this.#xhttp.status}`, errorMessage: JSON.parse(this.#xhttp.responseText) });
                    }
                } catch (err) {
                    reject({
                        error: `Unable to load ressource::${err.message}`, errorMessage: JSON.parse({
                            type: 'danger',
                            message: 'Unknown error',
                        })
                    });
                }
            });

        });
    }



    #query(method, data, url, xhttp, logics) {
        // this.#xhttp.setRequestHeader('Content-Type', "")
        xhttp.onload = logics;
        console.log(2);

        xhttp.open(method, url);
        console.log(3);

        if (data) {
            console.log(4);
            console.log('FORM DATA AJAX REQ: ', data);
            xhttp.send(data);
        } else {
            console.log(5);
            xhttp.send();
        }
    }

}