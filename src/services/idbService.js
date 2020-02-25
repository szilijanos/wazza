import { pageState } from '../state/pageState.js';

// TODO move this into a config
const config = {
    dbInitTimeoutMs: 10000,
};

const getAllRoutesNames = () =>
    new Promise((resolve, reject) => {
        const request = pageState.dbInstance.value
            .transaction(['routes'], 'readonly')
            .objectStore('routes')
            .getAllKeys();

        request.onsuccess = () => {
            resolve(request.result);
        };

        request.onerror = event => {
            reject(new Error(`Unable to retrieve routes' names list from database! (${event})`));
        };
    });

const add = ({ name, result }) =>
    new Promise((resolve, reject) => {
        const request = pageState.dbInstance.value
            .transaction(['routes'], 'readwrite')
            .objectStore('routes')
            .add({ name, result });

        request.onsuccess = () => {
            resolve(getAllRoutesNames());
        };

        request.onerror = event => {
            reject(
                new Error(`Unable to add data\r\n${name} is already exist in database! (${event})`),
            );
        };
    });

const isIndexedDbSupported = () => {
    const indexedDB =
        window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;

    const IDBTransaction =
        window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction;
    const IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange;

    return indexedDB && IDBKeyRange && IDBTransaction;
};

const init = () =>
    new Promise((resolve, reject) => {
        if (!isIndexedDbSupported()) {
            reject(new Error("Your browser doesn't support a stable version of IndexedDB."));
        }

        const openRequest = window.indexedDB.open('schedules', 1);
        openRequest.onerror = event => {
            reject(new Error('init error: ', event));
        };

        openRequest.onsuccess = ({ target }) => {
            resolve(target.result);
        };

        openRequest.onupgradeneeded = ({ target }) => {
            const db = target.result;

            if (!db.objectStoreNames.contains('routes')) {
                db.createObjectStore('routes', { keyPath: 'name' });
                resolve(db);
            }

            // TODO
            resolve(null);
        };
    });

function getInstance() {
    if (!pageState.dbInstance.value) {
        return Promise.race([
            new Promise((_, reject) => {
                setTimeout(() => reject(new Error('DB init timeout')), config.dbInitTimeoutMs);
            }),
            new Promise(resolve => {
                init().then(db => {
                    pageState.dbInstance = db;
                    resolve(pageState.dbInstance.value);
                });
            }),
        ]);
    }

    return Promise.resolve(pageState.dbInstance.value);
}

export default {
    getInstance,
    add,
    getAllRoutesNames,
};
