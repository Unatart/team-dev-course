function setUsername() {
    const username = window.localStorage.getItem('username');

    let node = document.createElement('LI');
    let textNode = document.createTextNode(username);
    node.appendChild(textNode);
    document.getElementById('infoBox').appendChild(node);
}

function setBalance() {
    let balance = + window.localStorage.getItem('balance');

    if (balance == null) {
        balance = 0;
    }

    document.getElementById('balance').innerHTML = balance;
}

function setCategories() {
    if (window.localStorage.getItem('category') != null) {
        let arrCategory = JSON.parse(window.localStorage.getItem('category'));
        let select = document.getElementById('category');

        for (let i = 0, length = arrCategory.length; i < length; i++) {
            select.options[i] = new Option(arrCategory[i]);
        }
    }
}

setUsername();
setBalance();
setCategories();