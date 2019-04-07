const addRowButton = document.getElementById('addRow');

addRowButton.addEventListener('click', () => {
    const descr = document.getElementById('description').value;
    const money = document.getElementById('money').value;

    const currentChild = {'description': descr, 'money': money};
    let arrivalList = window.localStorage.getItem('arrivalList');
    if (arrivalList == null) {
        let arrList = [];
        arrList.push(currentChild);
        window.localStorage.setItem('arrivalList',JSON.stringify(arrList));
    } else {
        let arrList = JSON.parse(arrivalList);
        arrList.push(currentChild);
        window.localStorage.setItem('arrivalList',JSON.stringify(arrList));
    }

    if (checkForOnlyNumbers(money)) {
        let balance = + window.localStorage.getItem('balance');

        if (balance == null) {
            balance = 0;
        }

        balance += +money;

        window.localStorage.setItem('balance', balance);

        document.getElementById('balance').innerHTML = balance;

        if (descr !== '' && money !== '') {

            let table = document.getElementById('arrivalsTable');
            let tableLength = table.rows.length - 1;
            let newRow = table.insertRow(tableLength).outerHTML =
                "<tr id='row" + tableLength + "'>" +
                "<td id='descrRow" + tableLength + "'>" + descr + "</td>" +
                "<td id='moneyRow" + tableLength + "'>" + money + "</td>" +
                "<td>" +
                "<input type='button' id='editButton"+tableLength+"' value='Edit' class='edit' onclick='editRow("+tableLength+")'>" +
                "<input type='button' id='saveButton" + tableLength + "' value='Save' class='save' onclick='saveRow("+tableLength+")'> " +
                "<input type='button' id='deleteButton" + tableLength + "' value='Delete' class='delete' onclick='deleteRow("+tableLength+")' > " +
                "</td>" +
                "</tr>";

            document.getElementById('description').value = '';
            document.getElementById('money').value = '';

        }
    }
});


function editRow(n) {
    document.getElementById("editButton"+n).style.display="none";
    document.getElementById("saveButton"+n).style.display="block";

    let descr = document.getElementById("descrRow"+n);
    let money = document.getElementById("moneyRow"+n);

    let descrData = descr.innerHTML;
    let moneyData = money.innerHTML;

    descr.innerHTML = "<input type = 'text' id = 'descrText" + n + "' value = '" + descrData + "'>";
    money.innerHTML = "<input type = 'text' id = 'moneyText" + n + "' value = '" + moneyData + "'>";
}


function saveRow(n) {
    let descr = document.getElementById("descrText"+n).value;
    let money = document.getElementById("moneyText"+n).value;

    document.getElementById("descrRow"+n).innerHTML = descr;
    document.getElementById("moneyRow"+n).innerHTML = money;

    document.getElementById("editButton"+n).style.display = "block";
    document.getElementById("saveButton"+n).style.display = "none";
}


function deleteRow(n) {
    document.getElementById("row"+n+"").outerHTML="";
}

function checkForOnlyNumbers(str) {
    for (let i of str) {
        if ( i >= '0' && i <= '9') {
            return true;
        }
    }
    return false;
}
