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

function parseJSON(response) {
    return response.json();
}

signUpButton.addEventListener('click', () => {
    let username = document.getElementById('usernameUp').value;
    let email = document.getElementById('emailUp').value;
    let password = document.getElementById('passwordUp').value;
    if (username === '' || email === '' || password === '') {
        document.getElementById('signUpError').innerHTML = 'Invalid data';
    }
    else {
        let opts = {'username': username, 'email': email, 'password': password};
        register(opts);
    }

    function register(opts) {
        let init = {
            method: 'POST',
            mode: 'cors',
            credential: 'include',
            headers: {
                "Access-Control-Allow-Credentials": "true",
                "Content-Type": "application/json"
            },
            body: JSON.stringify(opts)
        };

        fetch('http://127.0.0.1:5000/api/users', init)
            .then((response) => {
                if (response.status >= 200 && response.status < 300) {
                    return response;
                } else {
                    document.getElementById('signUpError').innerHTML = 'DataBase error';
                    let error = new Error(response.statusText);
                    error.response = response;
                    throw error;
                }
            })
            .then(parseJSON)
            .then(data => {
                setCookie('username', data[0]['username']);
                document.location.href = '/frontend/static/board/board.html';
            })

            .catch((error) => {
                console.log(error);
            });
    }
});

signInButton.addEventListener('click', () => {
    let username = document.getElementById('usernameIn').value;
    let password = document.getElementById('passwordIn').value;

    if (username === '' || password === '') {
        document.getElementById('signInError').innerHTML = 'Invalid data';
    }
    else {
        let opts = {};
        if (username.includes('@')) {

            opts = {'email': username, 'password': password};

        } else {

            opts = {'username': username, 'password': password};

        }


        login(opts);
    }

    function login(opts) {
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
            .then((response) => {
                if (response.status >= 200 && response.status < 300) {
                    return response;
                } else {
                    if (response.status === 403) {
                        document.getElementById('signInError').innerHTML = 'No such user';
                    }
                    else {
                        document.getElementById('signInError').innerHTML = 'DataBase error';
                    }
                    let error = new Error(response.statusText);
                    error.response = response;
                    throw error;
                }
            })
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
});
