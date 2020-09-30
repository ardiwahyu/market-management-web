import apiServices from './services/api';
const dateFormat = require('dateformat');
import pagination from './component/pagination.js';

const url = new URL(window.location.href);
const paramPage = url.searchParams.get("page") || 1;
let paramStartDate = url.searchParams.get("start-date");
let paramEndDate = url.searchParams.get("end-date");

//get date from param
if (paramStartDate != null && paramEndDate != null) {
    paramStartDate = url.searchParams.get("start-date").split("-");
    paramEndDate = url.searchParams.get("end-date").split("-");
    var startDateParam = new Date(paramStartDate[2], paramStartDate[1] - 1, paramStartDate[0]);
    var endDateParam = new Date(paramEndDate[2], paramEndDate[1] - 1, paramEndDate[0]);
} else {
    var startDateParam = new Date();
    var endDateParam = new Date();
}

const getExpense = async (page, startDate, endDate) => {
    const result = await apiServices.getExpense(page, startDate, endDate);
    renderResult(result.data);
    pagination(result.page || 1, result.total_page || 1, window.location.origin, "/hist-expense.html", `?start-date=${$('#startDate').val()}`, `&end-date=${$('#endDate').val()}&`);
    $('#show-info').html(`Show ${result.data.length} from ${result.total_entry}`);
}

document.addEventListener("DOMContentLoaded", () => {
    $("#startDate").datepicker({
        dateFormat: 'dd-mm-yyyy',
        maxDate: new Date(),
        autoClose: true,
        language: 'id',
        onSelect: function (strDate) {
            const partEndDate = $('#endDate').val().split('-');
            const endDate = new Date(partEndDate[2], partEndDate[1] - 1, partEndDate[0]);

            const partStrDate = strDate.split('-');
            const getDate = new Date(partStrDate[2], partStrDate[1] - 1, partStrDate[0])

            if (endDate < getDate) {
                $('#endDate').datepicker().data('datepicker').selectDate(getDate)
            }
            $('#endDate').datepicker({ minDate: getDate });
        }
    }).data('datepicker').selectDate(startDateParam);

    $("#endDate").datepicker({
        dateFormat: 'dd-mm-yyyy',
        maxDate: new Date(),
        minDate: startDateParam,
        autoClose: true,
        language: 'id'
    }).data('datepicker').selectDate(endDateParam);

    $.fn.datepicker.language['id'] = {
        days: ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'],
        daysShort: ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'],
        daysMin: ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'],
        months: ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'Nopember', 'Desember'],
        monthsShort: ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nop', 'Des'],
        today: 'Hari',
        clear: 'Bersihkan',
        dateFormat: 'dd-mm-yyyy',
        timeFormat: 'hh:ii aa',
        firstDay: 0
    }

    $('#refresh-btn').on('click', () => {
        window.location.replace(`${window.location.origin}/hist-expense.html?page=1&start-date=${$('#startDate').val()}&end-date=${$('#endDate').val()}`);
    })

    getExpense(paramPage, dateFormat(startDateParam, 'yyyy-mm-dd'), dateFormat(endDateParam, 'yyyy-mm-dd'));
});

function renderResult(result) {
    let inner = '';
    result.forEach(element => {
        inner = inner + `
            <tr class="tr-shadow">
                <td>${element.name}</td>
                <td>Rp${element.price.replace('$', '').replace('.00', ',-').replace(',', '.')}</td>
                <td>${element.detail}</td>
                <td>${dateFormat(element.date, 'dd-mm-yyyy')}</td>
            </tr> 
            `
    });
    $('tbody').html(inner);
}