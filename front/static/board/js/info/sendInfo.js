'use strict';

import {getCookie} from '../../../auth/js/cookie.js';
import {checkStatus, parseJSON} from "./utils.js";

function sendInfo() {
    /**
     *
     * @returns {string}
     */
    function createInfo() {
        let opt = {
            'balance': window.localStorage.getItem('balance'),
            'arrivalsList': window.localStorage.getItem('arrivalsList'),
            'spendingsList': window.localStorage.getItem('spendingsList'),
            'categories': window.localStorage.getItem('category')
        };

        return JSON.stringify(opt);
    }

    /**
     *
     * @param address
     * @param jsonInfo
     */
    function send(address, jsonInfo) {
        let init = {
            method: 'POST',
            mode: 'cors',
            credentials: 'include',
            headers: {
                "Access-Control-Allow-Credentials" : "true",
                'Access-Control-Allow-Methods': 'POST',
                'Access-Control-Allow-Headers': 'Content-Type',
                "Content-Type" : "application/json"},
            body: jsonInfo
        };

        fetch(address, init)
            .then(checkStatus)
            .then(parseJSON)
            .catch(() => {
                alert('something wrong : fetch send info');
            });
    }

    let username = getCookie('username');
    let address = 'http://127.0.0.1:5000/api/users/' + username;
    let jsonInfo = createInfo();

    send(address, jsonInfo);
}


export {sendInfo}