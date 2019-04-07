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