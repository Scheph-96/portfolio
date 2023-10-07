export class CookieHandler {

    /**
     * Store data as cookie
     * 
     * @param {string} name Cookie name
     * @param {string} value Cookie value
     * @param {number} expire Cookie lifespan (number of days) - Optional
     * @param {string} path Cookie path - Optional
     */
    createCookie(name, value, expire = null, path = '/') {
        let date = new Date();
        try {
            if (expire === null) { // if the data expiration date is not set
                // add the data to cookies
                document.cookie = `${name}=${value};path=${path}`;
            } else { // if the data date is set
                // set the date object time to the expiration time
                date.setTime(date.getTime() + (expire * 24 * 60 * 60 * 1000));
                // convert the expiration time to a date
                expire = date.toUTCString();
                // add the data to cookies
                document.cookie = `${name}=${value};expires=${expire};path=${path}`;
            }
        } catch (e) {
            console.error(`Unable to set cookie::${e}`);
        }
    }

    /**
     * Get data store as cookie
     * 
     * @param {string} name Cookie's to retieve name
     * @returns {string} founded value
    */
    readCookie(name) {
        try {
            // split the cookies to list of datas
            const cookieDatas = document.cookie.split(';');
            let data;

            // loop through the list to interact with each data
            for (let i = 0; i < cookieDatas.length; i++) {
                // remove unecessary space
                data = cookieDatas[i].trim();
                let dataPair = data.split('=');

                if (dataPair[0] === name) { // if the current pair name is equal to the name passed as parameter
                    // return the value
                    return dataPair[1];
                }
            }
        } catch (e) {
            console.error(`Unable to get cookie::${e}`);
        }
    }

    /**
     * Method that return all existing cookies
    */
    readAll() {
        return document.cookie;
    }

    /**
     * Delete a specific cookie
     * 
     * @param {string} name Cookie's to delete name
     * @param {string} path Cookie path
    */
    deleteCookie(name, path = '/') {
        try {
            // split the cookies to list of datas
            const cookieDatas = document.cookie.split(';');

            // loop through the list to interact with each data
            for (let i = 0; i < cookieDatas.length; i++) {
                if (cookieDatas[i].includes(name)) {
                    // set the expiration date to a past date to delete the cookie
                    document.cookie = `${name}='';expires=Thu, 01 Jan 1970 00:00:00 UTC;path=${path}`;
                    break;
                }
            }
        } catch (e) {
            console.error(`Unable to delete cookie::${e}`);
        }
    }

    /**
     * Method that delete all existing cookies
    */
    deleteAll() {
        try {
            // split the cookies to list of datas
            const cookieDatas = document.cookie.split(';');

            // loop through the list to interact with each data
            for (let i = 0; i < cookieDatas.length; i++) {
                // set the expiration date to a past date to delete the cookie
                document.cookie = `${cookieDatas[i]};expires=Thu, 01 Jan 1970 00:00:00 UTC`;
            }
        } catch (e) {
            console.error(`Unable to delete cookie::${e}`);
        }

    }

    /**
     * Update a specific cookie
     * 
     * @param {String} name Cookie's to update name
     * @param {String} value new value
     * @param {String} path Cookie path
    */
    updateCookie(name, value, path = '/') {
        try {
            // the cookies to list of datas
            const cookieDatas = document.cookie.split(';');

            // loop through the list to interact with each data
            for (let i = 0; i < cookieDatas.length; i++) {
                if (cookieDatas[i].includes(name)) {
                    // set the new value
                    document.cookie = `${name}=${value};path=${path}`;
                    break;
                }
            }
        } catch (e) {
            console.error(`Unable to update cookie::${e}`);
        }
    }

    /**
     * Method to check a cookie existence
     * 
     * @param {string} name cookie name
    */
    exist(name) {
        try {
            // get the specific cookie
            let cookie = this.getCookie(name);

            if (cookie === undefined) { // if the cookie dosen't exist
                return false;
            } else { // if the cookie exist
                return true;
            }
        } catch (e) {
            console.error(`Unable to check cookie existence::${e}`);
        }
    }

    /**
     * Method to check if cookies are enabled in the navigator
    */
    cookieEnabled() {
        try {
            // check on modern browsers
            if (!navigator.cookieEnabled) return false;

            // check on old browsers
            let isEnable = false;
            this.createCookie('testName', 'testValue');

            if (this.getAll() === '') {
                isEnable = false;
            } else {
                isEnable = true;
            }

            this.deleteCookie('testName');

            return isEnable;

        } catch (e) {
            console.error(`Unexpected error::${e}`);
        }
    }
}