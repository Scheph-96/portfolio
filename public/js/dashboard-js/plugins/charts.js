import { months, getCssPropertyValue, monthsHalfYear } from "../tools/util.js";


let themeEventTarget;

/**
 * Annual Income Chart
*/
function lineChart() {
    Chart.defaults.color = getCssPropertyValue('--default-text-color');
    themeEventTarget = document.querySelector('.my-chart');
    const target = document.getElementById('annual-income-chart');

    let chart = new Chart(
        target,
        {
            type: 'line',
            options: {
                scales: {
                    x: {
                        grid: {
                            drawOnChartArea: false,
                        }
                    },
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: getCssPropertyValue('--chart-grid-line-color'),
                        }
                    },
                },
                plugins: {
                    legend: {
                        display: false
                    }
                }
            },
            data: {
                labels: months,
                datasets: [
                    {
                        label: 'Monthly Income',
                        data: [0, 8000, 45000, 38000, 52000, 100000, 90000, 56000, 34000, 89000, 99000, 49000],
                        fill: true,
                        backgroundColor: 'rgba(30, 144, 255, .2)',
                        borderColor: '#1e90ff',
                        tension: 0,
                        pointStyle: 'rect'
                    }
                ]
            }
        }
    );

    themeEventTarget.addEventListener('theme-switch', () => {
        chart.options.scales.y.ticks.color = getCssPropertyValue('--default-text-color');
        chart.options.scales.x.ticks.color = getCssPropertyValue('--default-text-color');
        chart.options.scales.y.grid.color = getCssPropertyValue('--chart-grid-line-color');
        chart.update();
    });

}

/**
 *  Annual Projects Chart
 *  @param {Boolean} isOverview dashboard page or projects page ? if true then it's dashboard page 
*/
function barChart(isOverview) {
    Chart.defaults.color = getCssPropertyValue('--default-text-color');
    themeEventTarget = document.querySelector('.my-chart');

    let target, chart;

    target = isOverview ? document.getElementById('projects-bar-chart-overview') 
                        : document.getElementById('annual-projects-chart');

    chart = new Chart(
        target,
        {
            type: 'bar',
            options: {
                // responsive: false,
                scales: {
                    x: {
                        grid: {
                            drawOnChartArea: false,
                        }
                    },
                    y: {
                        beginAtZero: true,
                        grace: 1,
                        grid: {
                            color: getCssPropertyValue('--chart-grid-line-color'),
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: true,
                        position: 'bottom',
                        align: 'end',
                        labels: {
                            padding: 20,
                            usePointStyle: true,
                            pointStyle: 'circle',
                            boxWidth: 8,
                            boxHeight: 8,
                        },
                    },
                },
            },
            data: {
                labels: isOverview ? monthsHalfYear : months,
                datasets: isOverview ? [
                    {
                        label: 'New',
                        data: [10, 5, 7, 2, 9, 12],
                        backgroundColor: '#C0C0C0',
                        barPercentage: .7,
                        categoryPercentage: .7,
                    },
                    {
                        label: 'Overdue',
                        data: [3, 2, 4, 3, 5, 2],
                        backgroundColor: '#FF4500',
                        barPercentage: .7,
                        categoryPercentage: .7,
                    },
                    {
                        label: 'OnGoing',
                        data: [15, 17, 22, 13, 16, 10],
                        backgroundColor: '#FFD950',
                        barPercentage: .7,
                        categoryPercentage: .7,
                    },
                    {
                        label: 'Complete',
                        data: [18, 20, 30, 15, 12, 8],
                        backgroundColor: '#02BC77',
                        barPercentage: .7,
                        categoryPercentage: .7,
                    },
                    {
                        label: 'Abort',
                        data: [5, 2, 1, 4, 3, 2],
                        backgroundColor: '#dc143c',
                        barPercentage: .7,
                        categoryPercentage: .7,
                    },
                ] : [

                    {
                        label: 'New',
                        data: [10, 5, 7, 2, 9, 12, 10, 5, 7, 2, 9, 12],
                        backgroundColor: '#C0C0C0',
                        barPercentage: .7,
                        categoryPercentage: .7,
                    },
                    {
                        label: 'Overdue',
                        data: [3, 2, 4, 3, 5, 2, 3, 2, 4, 3, 5, 2],
                        backgroundColor: '#FF4500',
                        barPercentage: .7,
                        categoryPercentage: .7,
                    },
                    {
                        label: 'Ongoing',
                        data: [15, 17, 22, 13, 16, 10, 15, 17, 22, 13, 16, 10],
                        backgroundColor: '#FFD950',
                        barPercentage: .7,
                        categoryPercentage: .7,
                    },
                    {
                        label: 'Complete',
                        data: [18, 20, 30, 15, 12, 8, 18, 20, 30, 15, 12, 8],
                        backgroundColor: '#02BC77',
                        barPercentage: .7,
                        categoryPercentage: .7,
                    },
                    {
                        label: 'Abort',
                        data: [5, 2, 1, 4, 3, 2, 5, 2, 1, 4, 3, 2],
                        backgroundColor: '#dc143c',
                        barPercentage: .7,
                        categoryPercentage: .7,
                    },
                ]
            },
        }
    );

    themeEventTarget.addEventListener('theme-switch', () => {
        chart.options.scales.y.ticks.color = getCssPropertyValue('--default-text-color');
        chart.options.scales.x.ticks.color = getCssPropertyValue('--default-text-color');
        chart.options.plugins.legend.labels.color = getCssPropertyValue('--default-text-color');
        chart.options.scales.y.grid.color = getCssPropertyValue('--chart-grid-line-color');
        chart.update();
    });

}


function pieChart() {
    Chart.defaults.color = getCssPropertyValue('--default-text-color');
    themeEventTarget = document.querySelector('.my-chart');

    let target, chart;

    target = document.getElementById('annual-customers-chart');

    chart = new Chart(
        target,
        {
            type: 'pie',
            options: {
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: true,
                        position: 'right',
                        align: 'end',
                        labels: {
                            // padding: 20,
                            usePointStyle: true,
                            pointStyle: 'circle',
                            boxWidth: 10,
                            boxHeight: 10,
                        },
                    },
                },
            },
            data: {
                labels: [
                    'Unregistered Customers',
                    'Registered Customers',
                    'Lost Customers',
                ],
                datasets: [{
                    label: 'Customers',
                    data: [30, 101, 19],
                    borderColor: 'transparent',
                    backgroundColor: [
                        '#FFD950',
                        '#02BC77',
                        '#FF2366',
                    ]
                }]
            }
        }
    );



    themeEventTarget.addEventListener('theme-switch', () => {
        chart.options.plugins.legend.labels.color = getCssPropertyValue('--default-text-color');
        chart.update();
    });
}



export {
    lineChart,
    barChart,
    pieChart,
}