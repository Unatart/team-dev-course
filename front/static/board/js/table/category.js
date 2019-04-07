'use strict';

import {sendInfo} from '../info/sendInfo.js';

let CategoryButton = document.getElementById('addCategory');

CategoryButton.addEventListener('click', () => {
    const categoryView = document.getElementById('categoryDescript').value;
    let select = document.getElementById('category');

    if (categoryView !== '') {
        if (window.localStorage.getItem('category') === 'null' || window.localStorage.getItem('category') == null) {

            let arrCategory = [];
            arrCategory.push(categoryView);
            window.localStorage.setItem('category', JSON.stringify(arrCategory));

            for (let i = 0, length = arrCategory.length; i < length; i++) {
                select.options[i] = new Option(arrCategory[i]);
            }

        } else {

            let arrCategory = JSON.parse(window.localStorage.getItem('category'));

            if (!alreadyExist(arrCategory, categoryView)) {
                arrCategory.push(categoryView);
                window.localStorage.setItem('category', JSON.stringify(arrCategory));

                for (let i = 0, length = arrCategory.length; i < length; i++) {
                    select.options[i] = new Option(arrCategory[i]);
                }
            }
        }
    }

    document.getElementById('categoryDescript').value = '';

    sendInfo();
});

function alreadyExist(arr, str) {
    return arr.indexOf(str) > -1;
}