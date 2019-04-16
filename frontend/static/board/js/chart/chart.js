'use strict';

import {getCookie} from "../../../auth/js/cookie.js";
import {checkStatus} from "../info/utils.js";


const dateButton = document.getElementById('dateButton');

dateButton.addEventListener('click', () => {
    const startDate = formatDate(document.getElementById('startDate').value);
    const finishDate = formatDate(document.getElementById('finishDate').value);
    console.log(startDate, finishDate);
    let opts = {'start_date': startDate, 'finish_date': finishDate, 'username': getCookie('username')};
    getChartInfo(opts);
});

function formatDate(input) {
    return input.split('-').reverse().join('-');
}

function getChartInfo(opts) {
    function receive() {
        let init = {
            method: 'POST',
            mode: 'cors',
            credentials: 'include',
            headers: {
                "Access-Control-Allow-Credentials": "true",
                'Access-Control-Allow-Methods': 'POST',
                'Access-Control-Allow-Headers': 'Content-Type',
                "Content-Type": "application/json"
            },
            body: JSON.stringify(opts)
        };

        fetch(('http://127.0.0.1:5000/api/chart'), init)
            .then(checkStatus)
            .then(response => response.json())
            .then(data => {
                console.log(data);
                createChart(data);
            })
            .catch(error => {
                console.error(error);
                let chartError = document.getElementById('chartError');
                chartError.innerHTML = 'Bad dates';
            });
    }

    return receive();
}

function createChart(data) {
    let arrData = [];
    let labelsData = [];
    for (let elem in data) {
        for (let i in data[elem]) {
            let ind = data[elem][i];
            arrData.push(ind.money*100);
            labelsData.push(ind.category);
        }
    }
    let rgbArr = randomColor({
        count: arrData.length
    });

    let ctx = document.getElementById('chartPie').getContext('2d');
    ctx.canvas.width = 300;
    ctx.canvas.height = 300;

    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: labelsData,
            datasets: [{
                data: arrData,
                backgroundColor: rgbArr,
                borderWidth: 1
            }]
        },
        options: {
            legend: {
                labels: {
                    fontColor: 'white'
                }
            }
        }

    });
}

