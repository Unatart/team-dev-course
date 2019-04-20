'use strict';

export function getArrTotal() {
    let arrivalsList = window.localStorage.getItem('arrivalsList');

    let total = 0;

    if (!(arrivalsList === 'null' || arrivalsList == null)) {
        let arrList = JSON.parse(arrivalsList);

        for (let i = 0, length = arrList.length; i < length; i++) {
            total += +arrList[i]['money'];
        }
    }

    return total;
}

export function getSpdTotal() {
    let spendingsList = window.localStorage.getItem('spendingsList');

    let totalSpd = 0;

    if (!(spendingsList === 'null' || spendingsList == null)) {
        let spdList = JSON.parse(spendingsList);

        for (let i = 0, length = spdList.length; i < length; i++) {
            totalSpd += +spdList[i]['money'];
        }
    }

    return totalSpd;
}

export function getTime() {
    let today = new Date();

    let dd = today.getDate();
    let mm = today.getMonth() + 1;
    let yyyy = today.getFullYear();

    if (dd < 10) {
        dd = '0' + dd;
    }

    if (mm < 10) {
        mm = '0' + mm;
    }

    return dd + '-' + mm + '-' + yyyy;
}

export let style = 'border: rgba(0,0,0,0); ' +
    'margin: 0 auto 0 auto; color: #fff;' +
    'border-bottom: 1px solid #fff; background-color: rgba(0,0,0,0); ' +
    'word-spacing: 2px; ' +
    'font-family: \'Quicksand\', sans-serif; color: #fff;';


export function objFromArrById(arr, n) {
    return arr.find(obj => obj.id === n);
}

export function checkForOnlyNumbers(str) {
    for (let i of str) {
        if ( i >= '0' && i <= '9') {
            return true;
        }
    }
    return false;
}