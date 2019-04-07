let CategoryButton = document.getElementById('addCategory');

CategoryButton.addEventListener('click', () => {
    const categoryView = document.getElementById('categoryDescript').value;
    alert('hello');
    if (categoryView !== '') {
        let select = document.getElementById('category');

        alert('hello');
        select.options[select.options.length] = new Option(categoryView);
    }
});