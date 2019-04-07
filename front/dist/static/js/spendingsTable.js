let addRowButton2 = document.getElementById('addRow2');

addRowButton2.addEventListener('click', () => {
    const descr = document.getElementById('description2').value;
    const money = document.getElementById('money2').value;
    const category = document.getElementById('category');
    const selected = category.options[category.selectedIndex].value;

    const currentChild = {'description': descr, 'money': money, 'category': selected};
    let spendingsList = window.localStorage.getItem('spendingsList');
    if (spendingsList == null) {
        let spdList = [];
        spdList.push(currentChild);
        window.localStorage.setItem('spendingsList', JSON.stringify(spdList));
    } else {
        let spdList = JSON.parse(spendingsList);
        spdList.push(currentChild);
        window.localStorage.setItem('spendingsList', JSON.stringify(spdList));
    }

    if (descr !== '' && money !== '') {

        let table = document.getElementById('spendingsTable');
        let tableLength = table.rows.length - 1;
        let newRow = table.insertRow(tableLength).outerHTML =
            "<tr id='rowS" + tableLength + "'>" +
                "<td id='descrRowS" + tableLength + "'>" + descr + "</td>" +
                "<td id='moneyRowS" + tableLength + "'>" + money + "</td>" +
                "<td id='categoryRowS" + tableLength + "'>" + selected + "</td>" +
                "<td>" +
                    "<input type='button' id='editButtonS"+tableLength+"' value='Edit' class='edit' onclick='editRowS("+tableLength+")'>" +
                    "<input type='button' id='saveButtonS" + tableLength + "' value='Save' class='save' onclick='saveRowS("+tableLength+")'> " +
                    "<input type='button' id='deleteButtonS" + tableLength + "' value='Delete' class='delete' onclick='deleteRowS("+tableLength+")' > " +
                "</td>" +
            "</tr>";

        document.getElementById('description2').value = '';
        document.getElementById('money2').value = '';

    }
});


function editRowS(n) {
    document.getElementById("editButtonS"+n).style.display="none";
    document.getElementById("saveButtonS"+n).style.display="block";

    let descr = document.getElementById("descrRowS"+n);
    let money = document.getElementById("moneyRowS"+n);
    let category = document.getElementById("categoryRowS"+n);

    let descrData = descr.innerHTML;
    let moneyData = money.innerHTML;

    descr.innerHTML = "<input type = 'text' id = 'descrTextS" + n + "' value = '" + descrData + "'>";
    money.innerHTML = "<input type = 'text' id = 'moneyTextS" + n + "' value = '" + moneyData + "'>";
    category.innerHTML = "<select id = 'newCategory'></select>";

    let arrCategory = JSON.parse(window.localStorage.getItem('category'));
    let select = document.getElementById('newCategory');
    for (let i = 0, length = arrCategory.length; i < length; i++) {
        select.options[i] = new Option(arrCategory[i]);
    }
}


function saveRowS(n) {
    let descr = document.getElementById("descrTextS"+n).value;
    let money = document.getElementById("moneyTextS"+n).value;
    let category = document.getElementById("newCategory");
    const selected = category.options[category.selectedIndex].value;


    document.getElementById("descrRowS"+n).innerHTML = descr;
    document.getElementById("moneyRowS"+n).innerHTML = money;
    document.getElementById("categoryRowS"+n).innerHTML = selected;

    document.getElementById("editButtonS"+n).style.display = "block";
    document.getElementById("saveButtonS"+n).style.display = "none";
}


function deleteRowS(n) {
    document.getElementById("rowS"+n+"").outerHTML="";
}
