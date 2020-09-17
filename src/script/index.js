import apiServices from './api-services';
const dateFormat = require('dateformat');
import setChart from './component/chart-controller';

const harian = document.getElementById("hari_ini");
const bulanan = document.getElementById("bulan_ini");
const date = new Date();
const day = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"]
const months = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "Nopember", "Desember"];
const data = []; data.length = 31; data.fill(0);

const getOverview = async () => {
    const result = await apiServices.getOverview();
    if (result.success) {
        if (result.data.harian != null) {
            harian.innerHTML = `Rp ${result.data.harian.replace("$", "").replace(".00", "").replace(",", ".")},00`
        } else {
            harian.innerHTML = `Rp 0,00`
        }
        if (result.data.bulanan != null) {
            bulanan.innerHTML = `Rp ${result.data.bulanan.replace("$", "").replace(".00", "").replace(",", ".")},00`
        } else {
            bulanan.innerHTML = `Rp 0,00`
        }

        //grafik
        result.data.perHari.forEach(perHari => {
            data[parseInt(dateFormat(perHari.date, "dd")) - 1] =
                parseInt(perHari.profit.replace("$", "").replace(".00", "").replace(",", ""));
            setChart(data);
        });

    }
}

document.addEventListener("DOMContentLoaded", () => {
    getOverview();
    document.getElementById("date").innerHTML =
        `${day[date.getDay()]}, ${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
})