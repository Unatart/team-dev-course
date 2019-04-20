'use strict';

import {editRow, saveRow, deleteRow} from "../table/optArr.js";
import {editRowS, saveRowS, deleteRowS} from "../table/optSpd.js";
import {style, getArrTotal, getSpdTotal} from "../table/utils.js";

function setBalance() {
    let balance = getArrTotal() - getSpdTotal();
    window.localStorage.setItem('balance', balance);
    document.getElementById('balance').innerHTML = balance;
}

function setCategories() {
    let arrCategory = JSON.parse(window.localStorage.getItem('category'));
    if (arrCategory != null) {
        let select = document.getElementById('category');

        for (let i = 0, length = arrCategory.length; i < length; i++) {
            select.options[i] = new Option(arrCategory[i]['description']);
        }
    }
}

function setTableArrivals() {
    let arrList = JSON.parse(window.localStorage.getItem('arrivalsList'));

    let fullArrList = [];
    if (arrList !== 'null') {
        let table = document.getElementById('arrivalsTable');

        for (let i = 0, length = arrList.length; i < length; i++) {
            const descr = arrList[i]['description'];
            const money = arrList[i]['money'];
            const date = arrList[i]['date'];
            const id = arrList[i]['id'];
            let tableLength = i;
            let currChild = {'id': id, 'description': descr, 'money': money, 'data': date, 'tInd': tableLength};

            table.insertRow(tableLength).outerHTML =
                "<tr id='row" + tableLength + "'>" +
                    "<td id='descrRow" + tableLength + "'>" + descr + "</td>" +
                    "<td id='moneyRow" + tableLength + "'>" + money + "</td>" +
                    "<td id='dateRow'>" + date + "</td>" +
                    "<td>" +
                        "<input style='display: block; " + style + "' type='button' id='editButton"+tableLength+"' value='Edit' class='edit'>" +
                        "<input style='display: none; " + style + "' type='button' id='saveButton" + tableLength + "' value='Save' class='save'> " +
                        "<input style='display: block; " + style + "' type='button' id='deleteButton" + tableLength + "' value='Delete' class='delete'> " +
                    "</td>" +
                "</tr>";

            document.getElementById('editButton'+tableLength).onclick = editRow.bind({...this, tableLength});
            document.getElementById('saveButton'+tableLength).onclick = saveRow.bind({...this, tableLength});
            document.getElementById('deleteButton'+tableLength).onclick = deleteRow.bind({...this, tableLength});

            fullArrList.push(currChild);
        }
    }
    window.localStorage.setItem('arrivalsList', JSON.stringify(fullArrList));
}

function setTableSpendings() {
    let spdList = JSON.parse(window.localStorage.getItem('spendingsList'));

    let fullSpdList = [];
    if (spdList !== 'null') {
        let table = document.getElementById('spendingsTable');

        for (let i = 0, length = spdList.length; i < length; i++) {
            const descr = spdList[i]['description'];
            const money = spdList[i]['money'];
            const selected = spdList[i]['category'];
            const date = spdList[i]['date'];
            const id = spdList[i]['id'];
            let tableLength = i;
            let currentChild = {'id': id, 'description': descr, 'money': money, 'category': selected, 'data': date, 'tInd': tableLength};
            table.insertRow(tableLength).outerHTML =
                "<tr id='rowS" + tableLength + "'>" +
                    "<td id='descrRowS" + tableLength + "'>" + descr + "</td>" +
                    "<td id='moneyRowS" + tableLength + "'>" + money + "</td>" +
                    "<td id='categoryRowS" + tableLength + "'>" + selected + "</td>" +
                    "<td id='dateRowS'>" + date + "</td>" +
                    "<td>" +
                        "<input style='display: block; " + style + "' type='button' id='editButtonS"+tableLength+"' value='Edit' class='edit'>" +
                        "<input style='display: none; " + style + "' type='button' id='saveButtonS" + tableLength + "' value='Save' class='save'> " +
                        "<input style='display: block; " + style + "' type='button' id='deleteButtonS" + tableLength + "' value='Delete' class='delete'> " +
                    "</td>" +
                "</tr>";

            document.getElementById('editButtonS'+tableLength).onclick = editRowS.bind({...this, tableLength});
            document.getElementById('saveButtonS'+tableLength).onclick = saveRowS.bind({...this, tableLength});
            document.getElementById('deleteButtonS'+tableLength).onclick = deleteRowS.bind({...this, tableLength});
            fullSpdList.push(currentChild);
        }
        window.localStorage.setItem('spendingsList', JSON.stringify(fullSpdList));
    }
}

export { setBalance, setCategories, setTableArrivals, setTableSpendings };




