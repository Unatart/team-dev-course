'use strict';

import {deleteRow, editRow, saveRow} from "./optArr.js";
import {getCookie} from "../../../auth/js/cookie.js";
import {getTime, style, checkForOnlyNumbers} from "./utils.js";
import {checkStatus, parseJSON} from "../info/utils.js";

const addRowButton = document.getElementById('addRow');

addRowButton.addEventListener('click', () => {
    const descr = document.getElementById('description').value;
    const money = document.getElementById('money').value;

    if (descr !== '' && money !== '') {
        if (+money > 0 && checkForOnlyNumbers(money) && money.charAt(0) !== '0') {
            document.getElementById('arrivalError').innerHTML = '';
            addToRemote('http://127.0.0.1:5000/api/arrivals', descr, money);
            document.getElementById('description').value = '';
            document.getElementById('money').value = '';
        } else {
            document.getElementById('arrivalError').innerHTML = '!!!Second field should contain only money amount.'
        }
    } else {
        document.getElementById('arrivalError').innerHTML = '!!!Fields must be filled.';
    }
});

function addToLocal(descr, money, id) {
    let today = getTime();
    let table = document.getElementById('arrivalsTable');
    let tableLength = table.rows.length;
    const currentChild = {'id': id, 'description': descr, 'money': money, 'data': today, 'tInd': tableLength};
    let arrivalsList = window.localStorage.getItem('arrivalsList');

    if (arrivalsList === 'null' || arrivalsList == null) {
        let arrList = [];
        arrList.push(currentChild);
        window.localStorage.setItem('arrivalsList',JSON.stringify(arrList));
    } else {
        let arrList = JSON.parse(arrivalsList);
        arrList.push(currentChild);
        window.localStorage.setItem('arrivalsList',JSON.stringify(arrList));
    }

    createRow(descr, money, today, id);
}

function addToRemote(address, descr, money) {
    let today = getTime();
    let opt = {'username': getCookie('username'), 'description': descr, 'amount': money, 'date': today};
    function sendInfo() {
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
            body: JSON.stringify(opt)
        };


        fetch(address, init)
            .then(checkStatus)
            .then(parseJSON)
            .then(data => {
                let id = data['id'];
                addToLocal(descr, money, id);
            })
            .catch((error) => {
                console.log(error);
                let arrError = document.getElementById('arrivalError');
                arrError.innerHTML = '!!!DataBase error';
            });
    }

    sendInfo();
}

function createRow(descr, money, date) {
    let balance = +window.localStorage.getItem('balance');

    balance == null ? balance = 0 : balance += +money;

    window.localStorage.setItem('balance', balance);

    document.getElementById('balance').innerHTML = balance;

    if (descr !== '' && money !== '') {
        let table = document.getElementById('arrivalsTable');
        let tableLength = table.rows.length;
        table.insertRow(tableLength).outerHTML =
            "<tr id='row" + tableLength + "'>" +
            "<td id='descrRow" + tableLength + "'>" + descr + "</td>" +
            "<td id='moneyRow" + tableLength + "'>" + money + "</td>" +
            "<td id='dateRow'>" + date + "</td>" +
            "<td>" +
            "<input style='display: block; " + style + "' type='button' id='editButton" + tableLength + "' value='Edit' class='edit'>" +
            "<input style='display: none; " + style + "' type='button' id='saveButton" + tableLength + "' value='Save' class='save'> " +
            "<input style='display: block; " + style + "' type='button' id='deleteButton" + tableLength + "' value='Delete' class='delete'> " +
            "</td>" +
            "</tr>";

        document.getElementById('editButton' + tableLength).onclick = editRow.bind({...this, tableLength});
        document.getElementById('saveButton' + tableLength).onclick = saveRow.bind({...this, tableLength});
        document.getElementById('deleteButton' + tableLength).onclick = deleteRow.bind({...this, tableLength});
    }
}
