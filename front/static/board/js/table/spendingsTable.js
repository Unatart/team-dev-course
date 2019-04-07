'use strict';

import {sendInfo} from '../info/sendInfo.js';
import {deleteRowS, editRowS, saveRowS} from "./optSpd.js";
import {getArrTotal, getSpdTotal} from "./utils.js";

let addRowButtonS = document.getElementById('addRow2');

addRowButtonS.addEventListener('click', () => {
    const descr = document.getElementById('description2').value;
    const money = document.getElementById('money2').value;
    const category = document.getElementById('category');
    const selected = category.options[category.selectedIndex].value;

    if (descr !== '' && money !== '') {

        let status = addToLocalS(descr, money, selected);
        if (status === 200) {

            document.getElementById('balance').innerHTML = +window.localStorage.getItem('balance');

            let table = document.getElementById('spendingsTable');
            let tableLength = table.rows.length;
            table.insertRow(tableLength).outerHTML =
                "<tr id='rowS" + tableLength + "'>" +
                "<td id='descrRowS" + tableLength + "'>" + descr + "</td>" +
                "<td id='moneyRowS" + tableLength + "'>" + money + "</td>" +
                "<td id='categoryRowS" + tableLength + "'>" + selected + "</td>" +
                "<td>" +
                "<input type='button' id='editButtonS" + tableLength + "' value='Edit' class='edit' onclick='editRowS(" + tableLength + ")'>" +
                "<input type='button' id='saveButtonS" + tableLength + "' value='Save' class='save' onclick='saveRowS(" + tableLength + ")'> " +
                "<input type='button' id='deleteButtonS" + tableLength + "' value='Delete' class='delete' onclick='deleteRowS(" + tableLength + ")' > " +
                "</td>" +
                "</tr>";

            document.getElementById('editButtonS' + tableLength).onclick = editRowS.bind(this, tableLength);
            document.getElementById('saveButtonS' + tableLength).onclick = saveRowS.bind(this, tableLength);
            document.getElementById('deleteButtonS' + tableLength).onclick = deleteRowS.bind(this, tableLength);

        }

        document.getElementById('description2').value = '';
        document.getElementById('money2').value = '';

    }

    sendInfo();
});

function addToLocalS(descr, money, selected) {
    if (+money < 0) {
        return 400;
    }

    const currentChild = {'description': descr, 'money': money, 'category': selected};
    let spendingsList = window.localStorage.getItem('spendingsList');

    if (spendingsList === 'null' || spendingsList == null) {
        if (getArrTotal() - getSpdTotal() - currentChild['money'] >= 0) {
            let spdList = [];
            spdList.push(currentChild);
            window.localStorage.setItem('spendingsList', JSON.stringify(spdList));
            window.localStorage.setItem('balance', +window.localStorage.getItem('balance') - currentChild['money']);
            return 200;
        }
        else {
            alert('addToLocalS negative total');
            return 400;
        }

    } else {
        if (getArrTotal() - getSpdTotal() - currentChild['money'] >= 0) {
            let spdList = JSON.parse(spendingsList);
            spdList.push(currentChild);
            window.localStorage.setItem('spendingsList', JSON.stringify(spdList));
            window.localStorage.setItem('balance', +window.localStorage.getItem('balance') - currentChild['money']);
            return 200;
        }
        else {
            alert('addToLocalS negative total');
            return 400;
        }
    }
}

