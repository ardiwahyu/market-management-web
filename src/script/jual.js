import 'select2/dist/css/select2.min.css';
import 'select2/dist/js/select2.full';
import apiServices from './services/api';
import localServices from './services/local';

//load item
apiServices.getAllProduct();

let result;
let listItem = [];

const renderName = async () => {
    result = await localServices.getItem();
    let innerName = document.getElementById('name-add').innerHTML;
    result.forEach(element => {
        innerName = innerName + `
            <option value="${element.id}"> ${element.name}</option>
        `
    });
    $('#name-add').html(innerName);
}

const addSale = async (body) => {
    let resultAddSale;
    try {
        resultAddSale = await apiServices.addSale(body);
        if (resultAddSale.success) {
            $('#text-success').html('Berhasil menyimpan pembelian!');
            $('#btn-refresh').click(function () {
                window.location.href = `${window.location.origin}/jual.html`;
            });
            $('#successModal').modal('show');
        }
    } catch (error) {
        $('#text-gagal').html('Gagal memperbarui unit, Internal Server Error!')
        $('#gagalModal').modal('show');
    }
}

document.addEventListener("DOMContentLoaded", () => {
    renderName();
    let pricePerUnit; let objSelected;
    $("#tambahBarangModal").on('hidden.bs.modal', function () {
        $('#name-add option').removeProp('selected').filter('[value="-1"]').prop('selected', true).change();
        $('#qyt-add, #discount-add').prop("disabled", true);
        $('#info-price').html("");
        $('#info-unit').html("");
        $('#qyt-add').val(1);
        $('#discount-add').val("");
    });
    $('.js-example-basic-single').on('change', function () {
        $('#qyt-add, #discount-add, #btn-add').prop("disabled", false);
        objSelected = result.filter(obj => { return obj.id == parseInt(this.value) })[0];
        if (objSelected != null) {
            pricePerUnit = parseInt(objSelected.price_sale.replace("$", "").replace(".00", "").replace(",", ""));
            $('#info-price').html(pricePerUnit);
            $('#info-unit').html(objSelected.unit);
        }
    });
    $('.js-example-basic-single').select2({
        dropdownParent: $('#tambahBarangModal')
    });
    $('#qyt-add').on('change', () => {
        $('#info-price').html(pricePerUnit * $('#qyt-add').val())
    });
    $('#btn-add').on('click', () => {
        const discount = parseInt($('#discount-add').val() || 0)
        const price = parseInt($('#info-price').html()) - parseInt($('#discount-add').val() || 0);
        const qyt = parseInt($('#qyt-add').val());
        objSelected.qyt = qyt;
        objSelected.total = price;
        objSelected.discount = discount;
        listItem.push(objSelected);
        let innerListItem = $('tbody').html();
        innerListItem = innerListItem + `
            <tr class="tr-shadow" id="container${objSelected.id}">
                <td id="name${objSelected.id}">${objSelected.name}</td>
                <td id="qyt${objSelected.id}">${qyt}</td>
                <td id="unit${objSelected.id}">${objSelected.unit}</td>
                <td id="sale${objSelected.id}">${objSelected.price_sale.replace('$', '').replace('.00', '').replace(',', '')}</td>
                <td id="discount${objSelected.id}">${discount}</td>
                <td id="total${objSelected.id}">${price}</td>
                <td>
                    <div class="table-data-feature">
                        <button class="item" data-toggle="tooltip" data-placement="top" title="Ubah" onclick="showModal(${objSelected.id})">
                            <i class="zmdi zmdi-edit"></i>
                        </button>
                        <button class="item" data-toggle="tooltip" data-placement="top" title="Hapus" onclick="showWarning(${objSelected.id})">
                            <i class="zmdi zmdi-delete"></i>
                        </button>
                    </div>
                </td>
            </tr> 
            `;
        $('tbody').html(innerListItem);
        countTotal()
    });

    //edit
    let object;
    $("#editBarangModal").on('show.bs.modal', function () {
        const id = $('#btn-edit').parent().prop('id');
        object = getObject(id);
        $("#qyt-edit").on('change', () => {
            $('#sale-edit').html(parseInt(object.price_sale.replace('$', '').replace('.00', '').replace(',', '')) * $('#qyt-edit').val())
        });
    });

    $('#btn-edit').on('click', () => {
        const id = $('#btn-edit').parent().prop('id');
        const discount = parseInt($('#discount-edit').val() || 0);
        const price = parseInt($('#sale-edit').html()) - parseInt($('#discount-edit').val() || 0);
        const qyt = parseInt($('#qyt-edit').val());
        //remove old object
        delete listItem[listItem.indexOf(object)];
        //add new object
        object.qyt = qyt;
        object.total = price;
        object.discount = discount;
        listItem.push(object);

        $(`#qyt${id}`).html(qyt);
        $(`#discount${id}`).html(discount);
        $(`#total${id}`).html(price);

        countTotal()
    });

    //delete
    let objectDelete;
    $("#deleteBarangModal").on('show.bs.modal', () => {
        const id = $('#btn-delete').parent().prop('id');
        objectDelete = getObject(id);
    });

    $("#btn-delete").on('click', () => {
        delete listItem[listItem.indexOf(objectDelete)];
        $(`#container${objectDelete.id}`).remove();
        countTotal();
    })

    //save
    $('#btn-save').on('click', () => {
        addSale(listItem);
    });
});

function countTotal() {
    let total = 0;
    listItem.forEach(element => {
        total = total + parseInt(element.total);
    });
    $('#total').html(total);
}

function getObject(id) {
    let object;
    listItem.forEach(element => {
        if (element.id == parseInt(id)) {
            object = element;
        }
    });
    return object;
}