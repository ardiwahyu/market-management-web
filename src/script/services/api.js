import LocalServices from './local';
import { BASE_URL, PORT } from './config';
import URLSearchParams from 'url-search-params';
import { get } from 'jquery';

function status(response) {
    if (response.status >= 400) {
        return Promise.reject(response.status);
    } else {
        return Promise.resolve(response);
    }
}

function json(response) {
    return response.json();
}

function error(error) {
    return error;
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
                .catch(function (data) {
                    reject(data);
                });
        })
    }

    static async getUnit() {
        return new Promise((resolve, reject) => {
            const url = `${BASE_URL}:${PORT}/api/v1/config/unit`;
            fetch(url)
                .then(status)
                .then(json)
                .then(function (data) {
                    LocalServices.saveUnit(data.data);
                })
                .catch(function (data) {
                    reject(data);
                });
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
                .catch(function (data) {
                    reject(data);
                });
        })
    }

    static async getAllProduct() {
        return new Promise((resolve, reject) => {
            const url = `${BASE_URL}:${PORT}/api/v1/product/all`;
            fetch(url)
                .then(status)
                .then(json)
                .then(function (data) {
                    LocalServices.saveItem(data.data);
                })
                .catch(function (data) {
                    reject(data);
                });
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
                .catch(function (data) {
                    reject(data);
                });
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

    static async editProduct(id, bodyJson) {
        const searchParams = new URLSearchParams();
        for (let data in bodyJson) {
            searchParams.set(data, bodyJson[data]);
        }
        return new Promise((resolve, reject) => {
            const url = `${BASE_URL}:${PORT}/api/v1/product/${id}`;
            fetch(url, {
                method: 'put',
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

    static async deleteProduct(id) {
        return new Promise((resolve, reject) => {
            const url = `${BASE_URL}:${PORT}/api/v1/product/delete/${id}`;
            fetch(url, {
                method: 'delete'
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

    static async addUnit(bodyAdd, bodyRemove) {
        const searchParams = new URLSearchParams();
        searchParams.set("add", bodyAdd);
        searchParams.set("remove", bodyRemove);

        return new Promise((resolve, reject) => {
            const url = `${BASE_URL}:${PORT}/api/v1/config/unit`;
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

    static async addSale(body) {
        const searchParams = new URLSearchParams();
        body.forEach(element => {
            searchParams.append("body", JSON.stringify(element));
        });

        return new Promise((resolve, reject) => {
            const url = `${BASE_URL}:${PORT}/api/v1/penjualan`
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

    static async addExpense(body) {
        const searchParams = new URLSearchParams();
        body.forEach(element => {
            searchParams.append("body", JSON.stringify(element));
        });

        return new Promise((resolve, reject) => {
            const url = `${BASE_URL}:${PORT}/api/v1/pengeluaran`
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

    static async getSale(page, startDate, endDate) {
        return new Promise((resolve, reject) => {
            const url = `${BASE_URL}:${PORT}/api/v1/penjualan?page=${page || 1}&start_date=${startDate || 'now()'}&end_date=${endDate || 'now()'}`;
            fetch(url)
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
