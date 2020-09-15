import { BASE_URL, PORT } from '../config.js';

function status(response) {
    if (response.status !== 200) {
        return Promise.reject(new Error(response.statusText));
    } else {
        return Promise.resolve(response);
    }
}

function json(response) {
    return response.json();
}

function error(error) {
    console.log("Error : " + error);
}

class ApiServices {

    static async getOverview() {
        return new Promise((resolve, reject) => {
            const url = `${BASE_URL}:${PORT}/api/v1/rekap`;
            fetch(url)
                .then(status)
                .then(json)
                .then(function (data) {
                    resolve(data);
                })
                .catch(error);
        })
    }
}

export default ApiServices;
