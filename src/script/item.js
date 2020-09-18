import apiServices from './services/api';
import localServices from './services/local';
import pagination from './component/pagination.js';

const url = new URL(window.location.href);
const page = url.searchParams.get("page");
const search = url.searchParams.get("search");
const showInfo = document.querySelector('#show-info');
const tBody = document.querySelector('tbody');
let units;
let dataTable = [];

//load unit
apiServices.getUnit();

const getProduct = async (query) => {
    let result;
    if (query != null) {
        result = await apiServices.searchProduct(query);
    } else {
        result = await apiServices.getProduct(page);
    }
    dataTable = dataTable.concat(result.data);
    renderResult(dataTable);
    pagination(result.page || 1, result.total_page || 1, window.location.origin);

    showInfo.innerHTML = `Show ${result.data.length} from ${result.total_entry}`;

    //render unit
    units = await localServices.getUnit();
    let innerUnit = '';
    units.forEach(element => {
        innerUnit = innerUnit + `<option value="${element.id}">${element.name}</option>`
    })
    document.querySelector('#unit-add').innerHTML = innerUnit;
    document.querySelector('#unit-edit').innerHTML = innerUnit;
}

const addProduct = async (params) => {
    let resultAdd;
    try {
        resultAdd = await apiServices.addProduct(params);
        if (resultAdd.success) {
            $('#text-success').html('Berhasil menambahkan barang, segarkan halaman untuk melihat hasilnya!');
            $('#btn-refresh').click(function () {
                window.location.href = `${window.location.origin}/item.html`;
            });
            $('#successModal').modal('show');
        }
    } catch (error) {
        $('#text-gagal').html('Gagal menambahkan barang, nama barang telah tersedia!')
        $('#gagalModal').modal('show');
    }
}

const editProduct = async (id, params) => {
    let resultEdit;
    try {
        resultEdit = await apiServices.editProduct(id, params);
        if (resultEdit.success) {
            $('#text-success').html('Berhasil mengubah data barang, segarkan halaman untuk melihat hasilnya!');
            $('#btn-refresh').click(function () {
                window.location.href = `${window.location.origin}/item.html`;
            });
            $('#successModal').modal('show');
        }
    } catch (error) {
        $('#text-gagal').html('Gagal mengubah data barang, nama barang mungkin telah tersedia!')
        $('#gagalModal').modal('show');
    }
}

const deleteProduct = async (id) => {
    let resultDelete;
    try {
        resultDelete = await apiServices.deleteProduct(id);
        if (resultDelete.success) {
            $('#text-success').html('Berhasil menghapus barang, segarkan halaman untuk melihat hasilnya!');
            $('#btn-refresh').click(function () {
                window.location.href = `${window.location.origin}/item.html`;
            });
            $('#successModal').modal('show');
        }
    } catch (error) {
        $('#text-gagal').html('Gagal menghapus barang, Internal Server Error!')
        $('#gagalModal').modal('show');
    }
}

const addUnit = async (bodyAdd, bodyRemove) => {
    let resultAddUnit;
    try {
        resultAddUnit = await apiServices.addUnit(bodyAdd, bodyRemove);
        if (resultAddUnit.success) {
            $('#text-success').html('Berhasil memperbarui unit, segarkan halaman untuk melihat hasilnya!');
            $('#btn-refresh').click(function () {
                window.location.href = `${window.location.origin}/item.html`;
            });
            $('#successModal').modal('show');
        }
    } catch (error) {
        $('#text-gagal').html('Gagal memperbarui unit, Internal Server Error!')
        $('#gagalModal').modal('show');
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

    document.getElementById('btn-edit').addEventListener('click', () => {
        if (cekValidForm('#name-edit', '#qyt-edit', '#buy-edit', '#sale-edit')) {
            editProduct($('#btn-edit').parent().attr('id'), {
                name: $('#name-edit').val(),
                qyt: parseInt($('#qyt-edit').val()),
                unit_id: parseInt($('#unit-edit').val()),
                price_buy: parseInt($('#buy-edit').val()),
                price_sale: parseInt($('#sale-edit').val())
            });
        }
    });

    document.getElementById('btn-delete').addEventListener('click', () => {
        deleteProduct($('#btn-delete').parent().attr('id'));
    });

    document.getElementById('btn-set-unit').addEventListener('click', async () => {
        let innerUnit = '';
        units.forEach(element => {
            innerUnit = innerUnit + `
                <div class="alert alert-info alert-dismissible fade show" role="alert">
                    <div id="name-unit">${element.name}</div>
                    <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
            `
        });
        $('#list-unit').html(innerUnit);
    });

    document.getElementById('btn-add-unit').addEventListener('click', () => {
        const value = $('#input-unit').val();
        if (value.trim() !== "") {
            $('#list-unit').html($('#list-unit').html() + `
                <div class="alert alert-info alert-dismissible fade show" role="alert">
                    <div id="name-unit">${value}</div>
                    <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
            `);
            $('#input-unit').val("");
        }
    });

    document.getElementById('btn-save-unit').addEventListener('click', () => {
        const nameAdd = []; const idRemove = [];
        const nameUnit = units.map(a => a.name);
        let nameUnitInner = []

        document.querySelectorAll('#name-unit').forEach(element => {
            if (!nameUnit.includes(element.innerHTML)) {
                nameAdd.push(element.innerHTML);
            }
            nameUnitInner.push(element.innerHTML);
        });
        units.forEach(element => {
            if (!nameUnitInner.includes(element.name)) {
                idRemove.push(element.id)
            }
        })
        addUnit(nameAdd.join(), idRemove.join());
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
