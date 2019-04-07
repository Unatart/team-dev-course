'use strict';

import {sendInfo} from "../info/sendInfo.js";
import {getArrTotal, getSpdTotal} from "./utils.js";


function editRow(n) {
    document.getElementById("editButton"+n).style.display="none";
    document.getElementById("saveButton"+n).style.display="block";

    let descr = document.getElementById("descrRow"+n);
    let money = document.getElementById("moneyRow"+n);

    let descrData = descr.innerHTML;
    let moneyData = money.innerHTML;

    descr.innerHTML = "<input type = 'text' id = 'descrText" + n + "' value = '" + descrData + "'>";
    money.innerHTML = "<input type = 'text' id = 'moneyText" + n + "' value = '" + moneyData + "'>";
}


function saveRow(n) {
    let descr = document.getElementById("descrText"+n).value;
    let money = document.getElementById("moneyText"+n).value;

    let status = updateToLocal(descr, money, n);

    if (status === 200) {
        document.getElementById("descrRow"+n).innerHTML = descr;
        document.getElementById("moneyRow"+n).innerHTML = money;

        document.getElementById("editButton"+n).style.display = "block";
        document.getElementById("saveButton"+n).style.display = "none";

        document.getElementById('balance').innerHTML = +window.localStorage.getItem('balance');
    }

}

function updateToLocal(descr, money, n) {
    if (+money < 0) {
        return 400;
    }
    let arrivalsList = window.localStorage.getItem('arrivalsList');
    let arrList = JSON.parse(arrivalsList);

    let total = getArrTotal();

    let spendingsList = window.localStorage.getItem('spendingsList');

    if (!(spendingsList === 'null' || spendingsList == null)) {
        let spdList = JSON.parse(spendingsList);

        let totalSpd = getSpdTotal();

        let diff = arrList[n]['money'] - money;
        // diff = diff < 0 ? (diff * -1) : diff;
        alert(diff);

        if (total - diff - totalSpd > 0) {
            arrList[n]['description'] = descr;
            arrList[n]['money'] = money;

            let balance = total - diff - totalSpd;
            window.localStorage.setItem('balance', balance);
            window.localStorage.setItem('arrivalsList', JSON.stringify(arrList));

            sendInfo();
            return 200;
        }
        else {
            alert('updateToLocal1 arr bad balance');
            return 400;
        }

    }
    else {
        if (total - (arrList[n]['money'] - +money) > 0) {
            let balance = total - (arrList[n]['money'] - +money);

            arrList[n]['description'] = descr;
            arrList[n]['money'] = money;

            window.localStorage.setItem('balance', balance);
            window.localStorage.setItem('arrivalsList', JSON.stringify(arrList));

            sendInfo();
            return 200;
        }
        else {
            alert('updateToLocal2 arr bad balance');
            return 400;
        }
    }

}


function deleteRow(n) {
    document.getElementById("row"+n+"").outerHTML="";
    let status = deleteToLocal(n);

    if (status === 200) {
        document.getElementById('balance').innerHTML = +window.localStorage.getItem('balance');
    }

}

function deleteToLocal(n) {
    let arrivalsList = window.localStorage.getItem('arrivalsList');
    let arrList = JSON.parse(arrivalsList);

    let total = getArrTotal();

    let spendingsList = window.localStorage.getItem('spendingsList');

    if (!(spendingsList === 'null' || spendingsList == null)) {
        let spdList = JSON.parse(spendingsList);

        let totalSpd = getSpdTotal();

        if (total - arrList[n]['money'] - totalSpd >= 0) {

            let balance = total - arrList[n]['money'] - totalSpd;

            arrList.splice(n, 1);

            window.localStorage.setItem('balance', balance);
            window.localStorage.setItem('arrivalsList', JSON.stringify(arrList));

            sendInfo();
            return 200;
        }
        else {
            alert('deleteToLocal arr bad balance');
            return 400;
        }

    }
    else {
        if (total - arrList[n]['money'] >= 0) {
            let balance = total - arrList[n]['money'];

            arrList.splice(n, 1);

            window.localStorage.setItem('balance', balance);
            window.localStorage.setItem('arrivalsList', JSON.stringify(arrList));

            sendInfo();
            return 200;
        }
        else {
            alert('deleteToLocal arr bad balance');
            return 400;
        }
    }
}


export {editRow, saveRow, deleteRow}
