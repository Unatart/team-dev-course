'use strict';

import {getCookie} from "../../../auth/js/cookie.js";
import {checkStatus, parseJSON} from "../info/utils.js";

let CategoryButton = document.getElementById('addCategory');

CategoryButton.addEventListener('click', () => {
    const categoryView = document.getElementById('categoryDescript').value;
    let select = document.getElementById('category');

    if (categoryView !== '') {
        if (window.localStorage.getItem('category') === 'null' || window.localStorage.getItem('category') == null) {

            let arrCategory = [];
            arrCategory.push({'description': categoryView});
            window.localStorage.setItem('category', JSON.stringify(arrCategory));
            addCategoryToRemote('http://127.0.0.1:5000/api/categories', categoryView);

            for (let i = 0, length = arrCategory.length; i < length; i++) {
                select.options[i] = new Option(arrCategory[i]['description']);
            }
            document.getElementById('spendingError').innerHTML = '';
        } else {
            let arrCategory = JSON.parse(window.localStorage.getItem('category'));

            if (!alreadyExist(arrCategory, categoryView)) {
                arrCategory.push({'description': categoryView});
                window.localStorage.setItem('category', JSON.stringify(arrCategory));
                addCategoryToRemote('http://127.0.0.1:5000/api/categories', categoryView);

                for (let i = 0, length = arrCategory.length; i < length; i++) {
                    select.options[i] = new Option(arrCategory[i]['description']);
                }
            }
        }
    }

    document.getElementById('categoryDescript').value = '';
});

function alreadyExist(arr, str) {
    return arr.indexOf(str) > -1;
}

function addCategoryToRemote(address, descr) {
    let opt = {'username': getCookie('username'), 'description': descr};

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

        fetch(address, init)
            .then(checkStatus)
            .then(parseJSON)
            .catch((error) => {
                console.log(error);
                let spdError = document.getElementById('spendingError');
                spdError.innerHTML = '!!!DataBase error.';
            });
    }

    sendInfo();
}
