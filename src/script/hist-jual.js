
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
    }).data('datepicker').selectDate(new Date());

    $("#endDate").datepicker({
        dateFormat: 'dd-mm-yyyy',
        maxDate: new Date(),
        minDate: new Date(),
        autoClose: true,
        language: 'id'
    }).data('datepicker').selectDate(new Date());

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
});