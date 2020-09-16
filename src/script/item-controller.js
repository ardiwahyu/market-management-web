import apiServices from './api-services';
import pagination from './component/pagination.js';

function main() {
    const url = new URL(window.location.href);
    const page = url.searchParams.get("page");
    const search = url.searchParams.get("search");
    const showInfo = document.querySelector('#show-info');
    const tBody = document.querySelector('tbody');

    const getProduct = async (query) => {
        let result;
        if (query != null) {
            result = await apiServices.searchProduct(query);
            console.log(result);
        } else {
            result = await apiServices.getProduct(page);
        }
        let inner = '';
        result.data.forEach(element => {
            inner = inner + `
                <tr class="tr-shadow">
                <td>${element.name}</td>
                <td>${element.qyt}</td>
                <td>${element.unit}</td>
                <td>Rp${element.price_buy.replace('$', '').replace('.00', ',00').replace(',', '.')}</td>
                <td>Rp${element.price_sale.replace('$', '').replace('.00', ',00').replace(',', '.')}</td>
                <td>
                    <div class="table-data-feature">
                        <button class="item" data-toggle="tooltip" data-placement="top" title="Ubah" onclick="onClick(${element.id})">
                            <i class="zmdi zmdi-edit"></i>
                        </button>
                        <button class="item" data-toggle="tooltip" data-placement="top" title="Hapus">
                            <i class="zmdi zmdi-delete"></i>
                        </button>
                    </div>
                </td>
            </tr> 
            `
        });
        tBody.innerHTML = inner;
        pagination(result.page, result.total_page, window.location.origin);

        showInfo.innerHTML = `Show ${result.data.length} from ${result.total_entry}`;
    }

    document.addEventListener("DOMContentLoaded", () => {
        if (search != null || search != "") {
            getProduct(search);
        } else {
            getProduct();
        }
    });
}

function onClick(id) {
    console.log(id);
}

export default main;