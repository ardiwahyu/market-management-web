const { openDB } = require('idb');

function dbPromised() {
    return openDB('market-management', 1, {
        upgrade(db) {
            db.createObjectStore('units', { keyPath: 'id' });
            db.createObjectStore('items', { keyPath: 'id' });
        }
    });
}
class LocalServices {
    static async saveUnit(units) {
        const db = await dbPromised();
        const tx = db.transaction("units", "readwrite");
        const store = tx.objectStore("units");
        store.clear();
        units.forEach(element => {
            db.add('units', element);
        });
        return tx.complete;
    }

    static async getUnit() {
        const db = await dbPromised();
        const tx = db.transaction("units", "readonly");
        const store = tx.objectStore("units");
        return store.getAll();
    }

    static async saveItem(items) {
        const db = await dbPromised();
        const tx = db.transaction("items", "readwrite");
        const store = tx.objectStore("items");
        store.clear();
        items.forEach(element => {
            db.add('items', element);
        });
        return tx.complete;
    }

    static async getItem() {
        const db = await dbPromised();
        const tx = db.transaction("items", "readonly");
        const store = tx.objectStore("items");
        return store.getAll();
    }
}

export default LocalServices;