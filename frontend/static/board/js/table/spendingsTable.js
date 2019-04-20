'use strict';

import {deleteRowS, editRowS, saveRowS} from "./optSpd.js";
import {getArrTotal, getSpdTotal, style, checkForOnlyNumbers} from "./utils.js";
import {getTime} from "./utils.js";
import {getCookie} from "../../../auth/js/cookie.js";
import {checkStatus, parseJSON} from "../info/utils.js";

let addRowButtonS = document.getElementById('addRow2');

addRowButtonS.addEventListener('click', () => {
    const descr = document.getElementById('description2').value;
    const money = document.getElementById('money2').value;
    const category = document.getElementById('category');
    console.log(typeof category.options[category.selectedIndex]);
    if (typeof category.options[category.selectedIndex] === 'undefined') {
        document.getElementById('spendingError').innerHTML = '!!!Add category before adding spendings.'
    }
    else {
        const selected = category.options[category.selectedIndex].value;
        console.log(selected);
        if (descr !== '' && money !== '') {
            document.getElementById('spendingError').innerHTML = '';
            if (+money > 0 && checkForOnlyNumbers(money)) {
                addToRemoteS('http://127.0.0.1:5000/api/spendings', descr, money, selected);
            }
            else {
                document.getElementById('spendingError').innerHTML = '!!!Second field should contain only money amount(numbers).';
            }

            document.getElementById('description2').value = '';
            document.getElementById('money2').value = '';
        } else {
            document.getElementById('spendingError').innerHTML = '!!!Fields must be filled.';
        }
    }
});

function addToLocalS(descr, money, selected, id) {
    let d = getTime();
    let table = document.getElementById('spendingsTable');
    let tableLength = table.rows.length;
    const currentChild = {'id': id, 'description': descr, 'money': money, 'category': selected, 'data': d, 'tInd': tableLength};
    let spendingsList = window.localStorage.getItem('spendingsList');

    if (spendingsList === 'null' || spendingsList == null) {
        let spdList = [];
        spdList.push(currentChild);
        window.localStorage.setItem('spendingsList', JSON.stringify(spdList));
        window.localStorage.setItem('balance', +window.localStorage.getItem('balance') - currentChild['money']);
        createRowS(descr, money, selected, d);

    } else {
        let spdList = JSON.parse(spendingsList);
        spdList.push(currentChild);
        window.localStorage.setItem('spendingsList', JSON.stringify(spdList));
        window.localStorage.setItem('balance', +window.localStorage.getItem('balance') - currentChild['money']);
        createRowS(descr, money, selected, d);
    }
}

function addToRemoteS(address, descr, money, category) {
    let today = getTime();
    let opt = {'username': getCookie('username'), 'description': descr, 'amount': money, 'date': today, 'category': category};

    if (getArrTotal() - getSpdTotal() - money >= 0) {
        sendInfo();
    }
    else {
        console.log(new Error('addToLocalS negative total'));
        document.getElementById('spendingError').innerHTML = '!!!Cant do that. Negative balance.';
    }

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
                addToLocalS(descr, money, category, id);
            })
            .catch((error) => {
                console.log(error);
                document.getElementById('spendingError').innerHTML = '!!!DataBase error.';
            });
    }
}

function createRowS(descr, money, selected, date) {
    document.getElementById('balance').innerHTML = window.localStorage.getItem('balance');

    console.log(date);
    let table = document.getElementById('spendingsTable');
    let tableLength = table.rows.length;
    table.insertRow(tableLength).outerHTML =
        "<tr id='rowS" + tableLength + "'>" +
            "<td id='descrRowS" + tableLength + "'>" + descr + "</td>" +
            "<td id='moneyRowS" + tableLength + "'>" + money + "</td>" +
            "<td id='categoryRowS" + tableLength + "'>" + selected + "</td>" +
            "<td id='dateRowS'>" + date + "</td>" +
            "<td>" +
                "<input style='display: block; " + style + "' type='button' id='editButtonS" + tableLength + "' value='Edit' class='edit' onclick='editRowS(" + tableLength + ")'>" +
                "<input style='display: none; " + style + "' type='button' id='saveButtonS" + tableLength + "' value='Save' class='save' onclick='saveRowS(" + tableLength + ")'> " +
                "<input style='display: block; " + style + "' type='button' id='deleteButtonS" + tableLength + "' value='Delete' class='delete' onclick='deleteRowS(" + tableLength + ")' > " +
            "</td>" +
        "</tr>";

    document.getElementById('editButtonS' + tableLength).onclick = editRowS.bind({...this, tableLength});
    document.getElementById('saveButtonS' + tableLength).onclick = saveRowS.bind({...this, tableLength});
    document.getElementById('deleteButtonS' + tableLength).onclick = deleteRowS.bind({...this, tableLength});
}


