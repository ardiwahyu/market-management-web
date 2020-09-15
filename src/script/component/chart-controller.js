function setChart(data) {
    const ctx = document.getElementById("recent-rep-chart");
    if (ctx) {
        ctx.height = 250;

        new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['1', '2', '3', '4', '5',
                    '6', '7', '8', '9', '10',
                    '11', '12', '13', '14', '15',
                    '16', '17', '18', '19', '20',
                    '21', '22', '23', '24', '25',
                    '26', '27', '28', '29', '30', '31'],
                datasets: [
                    {
                        label: 'Pendapatan',
                        backgroundColor: 'rgba(0,181,233,0.8)',
                        borderColor: 'transparent',
                        pointHoverBackgroundColor: '#fff',
                        borderWidth: 0,
                        data: data
                    }
                ]
            },
            options: {
                maintainAspectRatio: true,
                legend: {
                    display: false
                },
                responsive: true,
                scales: {
                    xAxes: [{
                        gridLines: {
                            drawOnChartArea: false,
                            color: '#f2f2f2'
                        },
                        ticks: {
                            fontFamily: "Poppins",
                            fontSize: 12,
                            autoSkip: true,
                            maxTicksLimit: 6,
                            stepSize: 5
                        }
                    }],
                    yAxes: [{
                        ticks: {
                            beginAtZero: true,
                            maxTicksLimit: 5,
                            // stepSize: 50,
                            // max: data.max,
                            fontFamily: "Poppins",
                            fontSize: 12
                        },
                        gridLines: {
                            display: true,
                            color: '#f2f2f2'
                        }
                    }]
                },
                elements: {
                    point: {
                        radius: 0,
                        hitRadius: 10,
                        hoverRadius: 4,
                        hoverBorderWidth: 3
                    }
                }
            }
        });
    }
}

module.exports = setChart;