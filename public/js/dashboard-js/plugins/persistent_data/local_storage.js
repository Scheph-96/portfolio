import { LocalStorageError } from "../../../errors/local_storage_error.js";

/**
 * Use MyLocalStorage objects to manipulate localStorage (create, read, update, delete)
 */
export class MyLocalStorage {

    #storage;

    constructor(storageType) {
        this.#storage = window[storageType];
        // like that we know if localStorage is usable or not while creating the object
        this.storageEnable();
    }

    /** 
     * Check whether localStorage is usable or not
    */
    storageEnable() {
        try {
            // setItem throw an exception when localStorage is not usable
            this.#storage.setItem('storage_test', 'storage_test');
            this.#storage.removeItem('storage_test');
            return true;
        } catch (error) {
            return false;
            throw new LocalStorageError('Unable to access localStorage');
        }
    }

    /**
     * Store data in localStorage
     * 
     * @param {String} key key of the data 
     * @param {String} data data to store 
     */
    setData(key, data) {
        if (this.storageEnable()) {
            this.#storage.setItem(key, data);
        }
    }

    /**
     * Retrieve stored data
     * 
     * @param {String} key stored data key
     * @returns {String} stored data
     */
    getData(key) {
        if (this.storageEnable()) {
            return this.#storage.getItem(key);
        }
    }

    /**
     * Retrieve all stored dara
     * 
     * @returns {Array} a list every data available in localStorage
     */
    getAll() {
        if (this.storageEnable()) {
            const array = [];
            for (const key in this.#storage) {
                // check if each key is a property of the localStorage instance
                if (this.#storage.hasOwnProperty(key)) {
                    array.push(key);
                }
            }

            return array;
        }
    }

    /**
     * delete a specific data
     * 
     * @param {String} key key of the data to delete
     */
    deleteData(key) {
        if (this.storageEnable()) {
            this.#storage.removeItem(key);
        }
    }

    /**
     * delete all data
     */
    deleteAll() {
        if (this.storageEnable()) {
            this.#storage.clear();
        }
    }


}