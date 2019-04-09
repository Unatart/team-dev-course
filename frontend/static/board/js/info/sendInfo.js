// not used but as example

// import {checkStatus, parseJSON} from "./utils.js";
//
// /**
//  *
//  * @param address
//  * @param jsonInfo
//  * @param additive
//  * @returns {number}
//  */
// function sendInfo(address, jsonInfo, additive) {
//         let init = {
//             method: 'POST',
//             mode: 'cors',
//             credentials: 'include',
//             headers: {
//                 "Access-Control-Allow-Credentials" : "true",
//                 'Access-Control-Allow-Methods': 'POST',
//                 'Access-Control-Allow-Headers': 'Content-Type',
//                 "Content-Type" : "application/json"},
//             body: jsonInfo
//         };
//
//         if (additive !== '') {
//             address = address + '/' + additive;
//         }
//
//         let resp = 0;
//
//         fetch(address, init)
//             .then(checkStatus)
//             .then(parseJSON)
//             .then(data => {
//                 // do something with data
//             })
//             .catch(() => {
//                 alert('something wrong : fetch send info');
//             });
// }
//
// export {sendInfo}