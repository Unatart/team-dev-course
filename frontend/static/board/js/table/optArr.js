'use strict';

import {getArrTotal, getSpdTotal, getTime, objFromArrById} from "./utils.js";
import {getCookie} from "../../../auth/js/cookie.js";
import {checkStatus, parseJSON} from "../info/utils.js";


function editRow() {
    const n = this.tableLength;

    document.getElementById("editButton"+n).style.display="none";
    document.getElementById("saveButton"+n).style.display="block";

    let descr = document.getElementById("descrRow"+n);
    let money = document.getElementById("moneyRow"+n);
    let descrData = descr.innerHTML;
    let moneyData = money.innerHTML;

    descr.innerHTML = "<input type = 'text' id = 'descrText" + n + "' value = '" + descrData + "'>";
    money.innerHTML = "<input type = 'text' id = 'moneyText" + n + "' value = '" + moneyData + "'>";
}


function saveRow() {
    const n = this.tableLength;

    let descr = document.getElementById("descrText"+n).value;
    let money = document.getElementById("moneyText"+n).value;

    if (+money > 0) {
        let id = JSON.parse(window.localStorage.getItem('arrivalsList'))[n]['id'];
        let status = updateToLocal(descr, money, n, id);
        if (status === 200) {
            document.getElementById("descrRow" + n).innerHTML = descr;
            document.getElementById("moneyRow" + n).innerHTML = money;
            document.getElementById("editButton" + n).style.display = "block";
            document.getElementById("saveButton" + n).style.display = "none";
        }
    }

}

function updateToLocal(descr, money, n, id) {
    let arrivalsList = window.localStorage.getItem('arrivalsList');
    let arrList = JSON.parse(arrivalsList);

    let total = getArrTotal();

    let spendingsList = window.localStorage.getItem('spendingsList');

    if (!(spendingsList === 'null' || spendingsList == null)) {
        let totalSpd = getSpdTotal();

        console.log(id);
        let diff = objFromArrById(arrList, id)['money'] - money;

        if (total - diff - totalSpd > 0) {
            objFromArrById(arrList, id)['description'] = descr;
            objFromArrById(arrList, id)['money'] = money;

            let balance = total - diff - totalSpd;
            window.localStorage.setItem('balance', balance);
            window.localStorage.setItem('arrivalsList', JSON.stringify(arrList));
            document.getElementById('balance').innerHTML = window.localStorage.getItem('balance');
            updateToRemote('http://127.0.0.1:5000/api/arrivals', descr, money, id);
            return 200;
        }
        else {
            alert('updateToLocal1 arr bad balance');
            return 400;
        }

    }
    else {
        if (total - (objFromArrById(arrList, n)['money'] - +money) > 0) {
            let balance = total - (arrList.find(arr => arr.id === id)['money'] - +money);

            objFromArrById(arrList, id)['description'] = descr;
            objFromArrById(arrList, id)['money'] = money;

            window.localStorage.setItem('balance', balance);
            window.localStorage.setItem('arrivalsList', JSON.stringify(arrList));
            document.getElementById('balance').innerHTML = window.localStorage.getItem('balance');
            updateToRemote('http://127.0.0.1:5000/api/arrivals', descr, money, id);
            return 200;
        }
        else {
            alert('updateToLocal2 arr bad balance');
            return 400;
        }
    }

}


function updateToRemote(address, descr, money, id) {
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

        fetch(address+'/'+id, init)
            .then(checkStatus)
            .then(parseJSON)
            .catch((error) => {
                console.log(error);
            });
    }

    sendInfo();
}


function deleteRow() {
    const n = this.tableLength;

    let id = JSON.parse(window.localStorage.getItem('arrivalsList'))[n]['id'];
    let status = deleteToLocal(n, id);
    if (status === 200) {
        document.getElementById("row" + n + "").outerHTML = "";
    }
}

function deleteToLocal(n, id) {
    let arrivalsList = window.localStorage.getItem('arrivalsList');
    let arrList = JSON.parse(arrivalsList);

    let total = getArrTotal();
    let spendingsList = window.localStorage.getItem('spendingsList');

    if (!(spendingsList === 'null' || spendingsList == null)) {
        let spdList = JSON.parse(spendingsList);
        let totalSpd = getSpdTotal();

        if (total - objFromArrById(arrList, id)['money'] - totalSpd >= 0) {

            let balance = total - objFromArrById(arrList, id)['money'] - totalSpd;

            arrList = arrList.filter( (arrObj) => {
                return arrObj !== objFromArrById(arrList, id);
            });

            window.localStorage.setItem('balance', balance);
            window.localStorage.setItem('arrivalsList', JSON.stringify(arrList));
            document.getElementById('balance').innerHTML = window.localStorage.getItem('balance');
            deleteToRemote('http://127.0.0.1:5000/api/arrivals', id);
            return 200;
        }
        else {
            alert('deleteToLocal arr bad balance');
            return 403;
        }

    }
    else {
        if (total - objFromArrById(arrList, n)['money'] >= 0) {
            let balance = total - objFromArrById(arrList, id)['money'];

            arrList = arrList.filter( (arrObj) => {
                return arrObj !== objFromArrById(arrList, id);
            });

            window.localStorage.setItem('balance', balance);
            window.localStorage.setItem('arrivalsList', JSON.stringify(arrList));
            document.getElementById('balance').innerHTML = window.localStorage.getItem('balance');
            deleteToRemote('http://127.0.0.1:5000/api/arrivals', id);
            return 200;
        }
        else {
            alert('deleteToLocal arr bad balance');
            return 403;
        }
    }
}

function deleteToRemote(address, id) {
    let opt = {'username' : getCookie('username')};

    function sendInfo() {
        let init = {
            method: 'DELETE',
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

        fetch(address+'/'+id, init)
            .then(checkStatus)
            .then(parseJSON)
            .catch((error) => {
                console.log(error);
            });
    }

    sendInfo();
}


export {editRow, saveRow, deleteRow}
