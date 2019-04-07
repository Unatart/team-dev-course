'use strict';

import {sendInfo} from '../info/sendInfo.js';
import {editRow, saveRow, deleteRow} from "./optArr.js";

const addRowButton = document.getElementById('addRow');

addRowButton.addEventListener('click', () => {
    const descr = document.getElementById('description').value;
    const money = document.getElementById('money').value;

    if (checkForOnlyNumbers(money)) {

        let status = addToLocal(descr, money);

        if (status === 200) {
            let balance = + window.localStorage.getItem('balance');

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
                    "<td>" +
                    "<input type='button' id='editButton"+tableLength+"' value='Edit' class='edit'>" +
                    "<input type='button' id='saveButton" + tableLength + "' value='Save' class='save'> " +
                    "<input type='button' id='deleteButton" + tableLength + "' value='Delete' class='delete'> " +
                    "</td>" +
                    "</tr>";

                document.getElementById('editButton'+tableLength).onclick = editRow.bind(this, tableLength);
                document.getElementById('saveButton'+tableLength).onclick = saveRow.bind(this, tableLength);
                document.getElementById('deleteButton'+tableLength).onclick = deleteRow.bind(this, tableLength);

            }
        }

        document.getElementById('description').value = '';
        document.getElementById('money').value = '';
    }

    sendInfo();
});

function checkForOnlyNumbers(str) {
    for (let i of str) {
        if ( i >= '0' && i <= '9') {
            return true;
        }
    }
    return false;
}

function addToLocal(descr, money) {
    if (+money < 0) {
        return 400;
    }

    const currentChild = {'description': descr, 'money': money};
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

    return 200;

}
