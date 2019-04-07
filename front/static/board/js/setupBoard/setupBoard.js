'use strict';

import {getCookie} from '../../../auth/js/cookie.js';
import {receiveInfo} from "../info/receiveInfo.js";

function setUsername() {
    const username = getCookie('username');

    if (username == null) {
        document.location.href = '/front/static/index/index.html';
    }

    let node = document.createElement('LI');
    let textNode = document.createTextNode(username);
    node.appendChild(textNode);
    document.getElementById('infoBox').appendChild(node);
}

setUsername();
receiveInfo();