import LocalServices from './local';
import { BASE_URL, PORT } from './config';
import URLSearchParams from 'url-search-params';

function status(response) {
    if (response.status >= 400) {
        return Promise.reject(response);
    } else {
        return Promise.resolve(response);
    }
}

function json(response) {
    return response.json();
}

function error(error) {
    return error.json();
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

    static async getUnit() {
        return new Promise((resolve, reject) => {
            const url = `${BASE_URL}:${PORT}/api/v1/config/unit`;
            fetch(url)
                .then(status)
                .then(json)
                .then(function (data) {
                    console.log(data.data);
                    LocalServices.saveUnit(data.data);
                })
                .catch(error);
        })
    }

    static async getProduct(page) {
        return new Promise((resolve, reject) => {
            const url = `${BASE_URL}:${PORT}/api/v1/product?page=${page || 1}`;
            fetch(url)
                .then(status)
                .then(json)
                .then(function (data) {
                    resolve(data);
                })
                .catch(error);
        })
    }

    static async searchProduct(search) {
        return new Promise((resolve, reject) => {
            const url = `${BASE_URL}:${PORT}/api/v1/product/search?name=${search}`;
            fetch(url)
                .then(status)
                .then(json)
                .then(function (data) {
                    resolve(data);
                })
                .catch(error);
        })
    }

    static async addProduct(bodyJson) {
        const searchParams = new URLSearchParams();
        for (let data in bodyJson) {
            searchParams.set(data, bodyJson[data]);
        }
        return new Promise((resolve, reject) => {
            const url = `${BASE_URL}:${PORT}/api/v1/product`;
            fetch(url, {
                method: 'post',
                body: searchParams
            })
                .then(status)
                .then(json)
                .then(function (data) {
                    resolve(data);
                })
                .catch(function (data) {
                    reject(data);
                });
        })
    }
}

export default ApiServices;
