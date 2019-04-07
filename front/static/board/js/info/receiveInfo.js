'use strict';

import {setBalance, setCategories, setTableArrivals, setTableSpendings} from '../setupBoard/setupInfo.js';
import {getCookie} from "../../../auth/js/cookie.js";
import {checkStatus, parseJSON} from "./utils.js";

function receiveInfo() {
    /**
     *
     * @param address
     */
    function receive(address) {
        let init = {
            method: 'GET',
            mode: 'cors',
            credentials: 'include'
        };

        fetch(address)
            .then(checkStatus)
            .then(parseJSON)
            .then(data => {
                for ( let elem in data) {
                    window.localStorage.setItem(elem, data[elem]);
                }
                setBalance();
                setCategories();
                setTableArrivals();
                setTableSpendings();
            })
            .catch(() => {
                alert('something wrong : fetch receive info');
            });

    }

    let username = getCookie('username');
    let address = 'http://127.0.0.1:5000/api/users/' + username;

    return receive(address);
}

export {receiveInfo}