const { openDB } = require('idb');

function dbPromised() {
    return openDB('market-management', 1, {
        upgrade(db) {
            db.createObjectStore('units', { keyPath: 'id' });
        }
    });
}
class LocalServices {
    static async saveUnit(units) {
        const db = await dbPromised();
        const tx = db.transaction("units", "readwrite");
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
}

export default LocalServices;