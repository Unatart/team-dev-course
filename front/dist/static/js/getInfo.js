const username = window.localStorage.getItem('username');

let node = document.createElement('LI');
let textnode = document.createTextNode(username);
node.appendChild(textnode);
document.getElementById('infoBox').appendChild(node);