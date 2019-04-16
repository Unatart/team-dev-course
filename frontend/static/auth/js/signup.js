'use strict';

import {setCookie} from './cookie.js';

const toSignUpButton = document.getElementById('toSignUp');
const toSignInButton = document.getElementById('toSignIn');
const container = document.getElementById('container');

toSignUpButton.addEventListener('click', () => {
    container.classList.add('right-panel-active');
});

toSignInButton.addEventListener('click', () => {
    container.classList.remove('right-panel-active');
});

const signUpButton = document.getElementById('signUp');
const signInButton = document.getElementById('signIn');

/**
 *
 * @param response
 * @returns {*}
 */
function checkStatus(response) {
    if (response.status >= 200 && response.status < 300) {
        return response
    } else {
        let error = new Error(response.statusText);
        error.response = response;
        throw error;
    }
}

/**
 *
 * @param response
 * @returns {any | Promise<any>}
 */
function parseJSON(response) {
    return response.json();
}

signUpButton.addEventListener('click', () => {
    let username = document.getElementById('usernameUp').value;
    let email = document.getElementById('emailUp').value;
    let password = document.getElementById('passwordUp').value;

    let opts = { 'username': username, 'email': email, 'password': password };

    function register() {
        let init = {
            method: 'POST',
            mode: 'cors',
            credential: 'include',
            headers: {
                "Access-Control-Allow-Credentials" : "true",
                "Content-Type" : "application/json"},
            body: JSON.stringify(opts)
        };

        fetch('http://127.0.0.1:5000/api/users', init)
            .then(checkStatus)
            .then(parseJSON)
            .then(data => {
                setCookie('username', data[0]['username']);
                document.location.href = '/frontend/static/board/board.html';
            })

            .catch((error) => {
                console.log(error);
                let errorUp = document.getElementById('signUpError');
                errorUp.innerHTML = 'Such user already exists';
            });
    }

    register();
});

signInButton.addEventListener('click', () => {
    let username = document.getElementById('usernameIn').value;
    let password = document.getElementById('passwordIn').value;

    let opts = {};
    if (username.includes('@')) {

        opts = { 'email' : username, 'password' : password};

    } else {

        opts = { 'username': username, 'password': password };

    }

    function login() {
        let init = {
            method: 'POST',
            mode: 'cors',
            credentials: 'include',
            headers: {
                "Access-Control-Allow-Credentials" : "true",
                'Access-Control-Allow-Methods': 'POST',
                'Access-Control-Allow-Headers': 'Authorization, Content-Type',
                "Content-Type" : "application/json"},
            body: JSON.stringify(opts)
        };

        fetch('http://127.0.0.1:5000/api/login', init)
            .then(checkStatus)
            .then(parseJSON)
            .then(data => {
                setCookie('username', data['username']);
                document.location.href = '/frontend/static/board/board.html';

            })
            .catch((error) => {
                console.log(error);
                let errorIn = document.getElementById('signInError');
                errorIn.innerHTML = 'No such user';
            });
    }

    login();
});
