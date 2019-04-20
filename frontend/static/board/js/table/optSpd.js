'use strict';

import {getArrTotal, getSpdTotal, objFromArrById, checkForOnlyNumbers} from "./utils.js";
import {getTime} from "./utils.js";
import {getCookie} from "../../../auth/js/cookie.js";
import {checkStatus, parseJSON} from "../info/utils.js";


function editRowS() {
    const n = this.tableLength;
    console.log(n);

    document.getElementById("editButtonS"+n).style.display="none";
    document.getElementById("saveButtonS"+n).style.display="block";

    let descr = document.getElementById("descrRowS"+n);
    let money = document.getElementById("moneyRowS"+n);
    let category = document.getElementById("categoryRowS"+n);

    let descrData = descr.innerHTML;
    let moneyData = money.innerHTML;

    descr.innerHTML = "<input type = 'text' id = 'descrTextS" + n + "' value = '" + descrData + "'>";
    money.innerHTML = "<input type = 'text' id = 'moneyTextS" + n + "' value = '" + moneyData + "'>";
    category.innerHTML = "<select id = 'newCategory'></select>";

    let arrCategory = JSON.parse(window.localStorage.getItem('category'));
    let select = document.getElementById('newCategory');
    for (let i = 0, length = arrCategory.length; i < length; i++) {
        select.options[i] = new Option(arrCategory[i]['description']);
    }
}


function saveRowS() {
    const n = this.tableLength;

    let descr = document.getElementById("descrTextS"+n).value;
    let money = document.getElementById("moneyTextS"+n).value;
    let category = document.getElementById("newCategory");
    const selected = category.options[category.selectedIndex].value;

    if (+money > 0 && checkForOnlyNumbers(money)) {
        let id = (JSON.parse(window.localStorage.getItem('spendingsList')).find(x => x.tInd === n))['id'];
        let status = updateToLocalS(descr, money, selected, n, id);

        if (status === 200) {
            document.getElementById("descrRowS" + n).innerHTML = descr;
            document.getElementById("moneyRowS" + n).innerHTML = money;
            document.getElementById("categoryRowS" + n).innerHTML = selected;

            document.getElementById("editButtonS" + n).style.display = "block";
            document.getElementById("saveButtonS" + n).style.display = "none";
        }
    }
    else {
        document.getElementById('spendingError').innerHTML = '!!!Second field should contain only money amount(numbers).';
    }
}


function updateToLocalS(descr, money, selected, n, id) {
    let spendingsList = window.localStorage.getItem('spendingsList');
    let spdList = JSON.parse(spendingsList);
    let totalSpd = getSpdTotal();
    let total = getArrTotal();

    let diff = objFromArrById(spdList, id)['money'] - money;
    diff = diff >=0 ? diff : (diff * -1);

    console.log(totalSpd + diff);
    if (total - (totalSpd + diff) >= 0) {
        let balance = total - (totalSpd + diff);

        objFromArrById(spdList, id)['description'] = descr;
        objFromArrById(spdList, id)['money'] = money;
        objFromArrById(spdList, id)['category'] = selected;

        window.localStorage.setItem('balance', balance);
        window.localStorage.setItem('spendingsList', JSON.stringify(spdList));
        document.getElementById('balance').innerHTML = window.localStorage.getItem('balance');
        document.getElementById('spendingError').innerHTML = '';
        updateToRemoteS('http://127.0.0.1:5000/api/spendings', descr, money, selected, id);
        return 200;
    }
    else {
        console.log(new Error('negative balance updateToLocalS'));
        document.getElementById('spendingError').innerHTML = '!!!Cant do that. Negative balance';
        return 400;
    }

}

function updateToRemoteS(address, descr, money, category, id) {
    let today = getTime();
    let opt = {'username': getCookie('username'), 'description': descr, 'category': category, 'amount': money, 'date': today};

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
                document.getElementById('spendingError').innerHTML = '!!!DataBase error.';
            });
    }

    sendInfo();
}


function deleteRowS() {
    const n = this.tableLength;

    let id = (JSON.parse(window.localStorage.getItem('spendingsList')).find(x => x.tInd === n))['id'];
    document.getElementById("rowS"+n+"").outerHTML="";
    deleteToLocalS(n, id);
}


function deleteToLocalS(n, id) {
    let spendingsList = window.localStorage.getItem('spendingsList');
    let spdList = JSON.parse(spendingsList);

    spdList = spdList.filter( (spdObj) => {
        return spdObj !== objFromArrById(spdList, id);
    });

    window.localStorage.setItem('spendingsList', JSON.stringify(spdList));

    let totalSpd = getSpdTotal();
    let total = getArrTotal();
    let balance = total - totalSpd ;

    window.localStorage.setItem('balance', balance);
    document.getElementById('spendingError').innerHTML = '';
    document.getElementById('balance').innerHTML = window.localStorage.getItem('balance');
    deleteToRemoteS('http://127.0.0.1:5000/api/spendings', id);
}

function deleteToRemoteS(address, id) {
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
                let spdError = document.getElementById('spendingError');
                spdError.innerHTML = '!!!DataBase error';
            });
    }

    sendInfo();
}

export {editRowS, saveRowS, deleteRowS}
