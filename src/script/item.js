import apiServices from './services/api';
import localServices from './services/local';
import pagination from './component/pagination.js';

const url = new URL(window.location.href);
const page = url.searchParams.get("page");
const search = url.searchParams.get("search");
const showInfo = document.querySelector('#show-info');
const tBody = document.querySelector('tbody');

let dataTable = [];

const getProduct = async (query) => {
    let result;
    if (query != null) {
        result = await apiServices.searchProduct(query);
    } else {
        result = await apiServices.getProduct(page);
    }
    dataTable = dataTable.concat(result.data);
    renderResult(dataTable);
    pagination(result.page, result.total_page, window.location.origin);

    showInfo.innerHTML = `Show ${result.data.length} from ${result.total_entry}`;

    //render unit
    const units = await localServices.getUnit();
    let innerUnit = '';
    units.forEach(element => {
        innerUnit = innerUnit + `<option value="${element.id}">${element.name}</option>`
    })
    document.querySelector('#unit-add').innerHTML = innerUnit;
    document.querySelector('#unit-edit').innerHTML = innerUnit;
}

const addProduct = async (params) => {
    let resultAdd;
    resultAdd = await apiServices.addProduct(params);
    if (resultAdd.success) {
        $('#tambahBarangModal').modal('toggle');
    }
}

document.addEventListener("DOMContentLoaded", () => {
    if (search != null || search != "") {
        getProduct(search);
    } else {
        getProduct();
    }

    document.getElementById('btn-add').addEventListener('click', () => {
        if (cekValidForm('#name-add', '#qyt-add', '#buy-add', '#sale-add')) {
            addProduct({
                name: $('#name-add').val(),
                qyt: parseInt($('#qyt-add').val()),
                unit_id: parseInt($('#unit-add').val()),
                price_buy: parseInt($('#buy-add').val()),
                price_sale: parseInt($('#sale-add').val())
            });
        }
    });
});

function renderResult(result) {
    let inner = '';
    result.forEach(element => {
        inner = inner + `
                <tr class="tr-shadow">
                <td id="name${element.id}">${element.name}</td>
                <td id="qyt${element.id}">${element.qyt}</td>
                <td id="unit${element.id}">${element.unit}</td>
                <td id="buy${element.id}">Rp${element.price_buy.replace('$', '').replace('.00', ',00').replace(',', '.')}</td>
                <td id="sale${element.id}">Rp${element.price_sale.replace('$', '').replace('.00', ',00').replace(',', '.')}</td>
                <td>
                    <div class="table-data-feature">
                        <button class="item" data-toggle="tooltip" data-placement="top" title="Ubah" onclick="showModal(${element.id})">
                            <i class="zmdi zmdi-edit"></i>
                        </button>
                        <button class="item" data-toggle="tooltip" data-placement="top" title="Hapus" onclick="showWarning(${element.id})">
                            <i class="zmdi zmdi-delete"></i>
                        </button>
                    </div>
                </td>
            </tr> 
            `
    });
    tBody.innerHTML = inner;
}

function cekValidForm(field1, field2, field3, field4) {
    let isValid = false;
    if ($(field1).val() == "") {
        $(field1).addClass("is-invalid");
        isValid = false;
    } else {
        $(field1).removeClass("is-invalid");
        isValid = true;
    }
    if ($(field2).val() == "") {
        $(field2).addClass("is-invalid");
        isValid = false;
    } else {
        $(field2).removeClass("is-invalid");
        isValid = true;
    }
    if ($(field3).val() == "") {
        $(field3).addClass("is-invalid");
        isValid = false;
    } else {
        $(field3).removeClass("is-invalid");
        isValid = true;
    }
    if ($(field4).val() == "") {
        $(field4).addClass("is-invalid");
        isValid = false;
    } else {
        $(field4).removeClass("is-invalid");
        isValid = true;
    }
    return isValid;
}
