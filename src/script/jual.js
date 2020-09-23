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

document.addEventListener("DOMContentLoaded", () => {
    renderName();
    let pricePerUnit; let objSelected;
    $("#tambahBarangModal").on('hidden.bs.modal', function () {
        $('#name-add option').removeProp('selected').filter('[value="-1"]').prop('selected', true).change();
        $('#qyt-add, #discount-add').prop("disabled", true);
        $('#info-price').html("");
        $('#info-unit').html("");
        $('#qyt-add').val(1);
        $('#discount-add').val(0);
    });
    $('.js-example-basic-single').on('change', function () {
        $('#qyt-add, #discount-add').prop("disabled", false);
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
        objSelected.total = parseInt($('#info-price').html());
        listItem.push(objSelected);
        const discount = $('#discount-add').val();
        const price = $('#info-price').html();
        const qyt = $('#qyt-add').val();
        let innerListItem = $('tbody').html();
        innerListItem = innerListItem + `
                <tr class="tr-shadow">
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
});

function countTotal() {
    console.log(listItem.reduce((a, b) => { return (a.total + b.total); }, 0));
}