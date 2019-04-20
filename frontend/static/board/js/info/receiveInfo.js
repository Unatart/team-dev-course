'use strict';

import {setBalance, setCategories, setTableArrivals, setTableSpendings} from '../setupBoard/setupInfo.js';
import {getCookie} from "../../../auth/js/cookie.js";
import {checkStatus} from "./utils.js";

function receiveInfo() {
    /**
     *
     * @param address
     */
    function receive() {
        fetch('http://127.0.0.1:5000/api/users'+'/'+getCookie('username'))
            .then(checkStatus)
            .then(response => response.json())
            .then(data => {
                console.log(data);

                for (let elem in data) {
                    window.localStorage.setItem(elem, JSON.stringify(data[elem]));
                }

                setCategories();
                setTableArrivals();
                setTableSpendings();
                setBalance();
            })
            .catch(error => console.error(error));
    }

    return receive();
}

export {receiveInfo}