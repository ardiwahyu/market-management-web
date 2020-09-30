import apiServices from './services/api';

const addExpense = async (body) => {
    let resultAddSale;
    try {
        resultAddSale = await apiServices.addExpense(body);
        if (resultAddSale.success) {
            $('#text-success').html('Berhasil menyimpan pengeluaran!');
            $('#btn-refresh').click(function () {
                window.location.href = `${window.location.origin}/expense.html`;
            });
            $('#successModal').modal('show');
        }
    } catch (error) {
        $('#text-gagal').html('Gagal menyimpan data, Internal Server Error!')
        $('#gagalModal').modal('show');
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const listPengeluaran = [];

    $("#tambahPengeluaranModal").on('hidden.bs.modal', function () {
        $('#name-add').val("");
        $('#sum-add').val("");
        $('#detail-add').val("");
    });

    $('#btn-add').on('click', () => {
        const objPengeluaran = {
            "id": listPengeluaran.length + 1,
            "name": $('#name-add').val(),
            "price": $('#sum-add').val() || 0,
            "detail": $('#detail-add').val()
        }
        listPengeluaran.push(objPengeluaran);
        let innerListItem = $('tbody').html();
        innerListItem = innerListItem + `
            <tr class="tr-shadow" id="container${objPengeluaran.id}">
                <td id="name${objPengeluaran.id}">${objPengeluaran.name}</td>
                <td id="price${objPengeluaran.id}">${objPengeluaran.price}</td>
                <td id="detail${objPengeluaran.id}">${objPengeluaran.detail}</td>
                <td>
                    <div class="table-data-feature">
                        <button class="item" data-toggle="tooltip" data-placement="top" title="Ubah" onclick="showModal(${objPengeluaran.id})">
                            <i class="zmdi zmdi-edit"></i>
                        </button>
                        <button class="item" data-toggle="tooltip" data-placement="top" title="Hapus" onclick="showWarning(${objPengeluaran.id})">
                            <i class="zmdi zmdi-delete"></i>
                        </button>
                    </div>
                </td>
            </tr> 
            `;
        $('tbody').html(innerListItem);
    });

    $('#btn-edit').on('click', () => {
        const id = $('#btn-edit').parent().prop('id');
        listPengeluaran[id - 1].name = $('#name-edit').val();
        listPengeluaran[id - 1].price = $('#sum-edit').val();
        listPengeluaran[id - 1].detail = $('#detail-edit').val();
        //render
        $(`#name${id}`).html($('#name-edit').val());
        $(`#price${id}`).html($('#sum-edit').val());
        $(`#detail${id}`).html($('#detail-edit').val());
    });

    $('#btn-delete').on('click', () => {
        const id = $('#btn-delete').parent().prop('id');
        delete listPengeluaran[id - 1];
        $(`#container${id}`).remove();
    });

    $('#btn-save').on('click', () => {
        addExpense(listPengeluaran)
    });
});