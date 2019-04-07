'use strict';

import {sendInfo} from "../info/sendInfo.js";
import {getArrTotal, getSpdTotal} from "./utils.js";


function editRowS(n) {

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
        select.options[i] = new Option(arrCategory[i]);
    }
}


function saveRowS(n) {
    let descr = document.getElementById("descrTextS"+n).value;
    let money = document.getElementById("moneyTextS"+n).value;
    let category = document.getElementById("newCategory");
    const selected = category.options[category.selectedIndex].value;

    let status = updateToLocalS(descr, money, selected, n);

    if (status === 200) {
        document.getElementById("descrRowS"+n).innerHTML = descr;
        document.getElementById("moneyRowS"+n).innerHTML = money;
        document.getElementById("categoryRowS"+n).innerHTML = selected;

        document.getElementById("editButtonS"+n).style.display = "block";
        document.getElementById("saveButtonS"+n).style.display = "none";

        document.getElementById('balance').innerHTML = +window.localStorage.getItem('balance');
    }

}


function updateToLocalS(descr, money, selected, n) {
    if (+money < 0) {
        return 400;
    }

    let spendingsList = window.localStorage.getItem('spendingsList');
    let spdList = JSON.parse(spendingsList);

    let totalSpd = getSpdTotal();
    let total = getArrTotal();

    let diff = spdList[n]['money'] - money;
    diff = diff >=0 ? diff : (diff * -1);

    alert(totalSpd + diff);
    if (total - (totalSpd - diff) >= 0) {

        let balance = total - (totalSpd - diff);

        spdList[n]['description'] = descr;
        spdList[n]['money'] = money;
        spdList[n]['category'] = selected;


        window.localStorage.setItem('balance', balance);
        window.localStorage.setItem('spendingsList', JSON.stringify(spdList));
        sendInfo();
        return 200;
    }
    else {
        alert(' negative balance updateToLocalS ');
        return 400;
    }

}



function deleteRowS(n) {
    document.getElementById("rowS"+n+"").outerHTML="";
    deleteToLocalS(n);

    document.getElementById('balance').innerHTML = +window.localStorage.getItem('balance');
}

function deleteToLocalS(n) {
    let spendingsList = window.localStorage.getItem('spendingsList');
    let spdList = JSON.parse(spendingsList);

    spdList.splice(n, 1);

    window.localStorage.setItem('spendingsList', JSON.stringify(spdList));

    let totalSpd = getSpdTotal();
    let total = getArrTotal();

    let balance = total - totalSpd ;

    window.localStorage.setItem('balance', balance);

    sendInfo();
}

export {editRowS, saveRowS, deleteRowS}
