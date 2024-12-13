function showSection(sectionClassName, event){
    event.preventDefault();
    var sections = document.getElementsByTagName("section");
    for(var i = 0; i < sections.length; i++){
        sections[i].style.display = "none";
    }
    document.getElementsByClassName(sectionClassName)[0].style.display = "block";
}

document.querySelectorAll(".navbar-button").forEach(button => {
    button.addEventListener("click", function(event){
        showSection(button.id, event);
    });
});

function openDialog(dialogID){
    let dialog = document.getElementById(dialogID);
    dialog.showModal();
}

function closeDialog(event, dialogID){
    event.preventDefault();
    let dialog = document.getElementById(dialogID);
    dialog.close();
}

function populateTable(objectList, tableID){
    const table = document.querySelector(`#${tableID}`);
    objectList.forEach(object => {
        let row = object.toTableRow();
        table.innerHTML += row;
    });
}

function clearTable(tableID){
    const table = document.querySelector(`#${tableID}`);
    const header = table.querySelector('tr').outerHTML; 
    table.innerHTML = header;
}

function addRowToTable(object, tableID){
    const table = document.querySelector(`#${tableID}`);
    let row = object.toTableRow();
    table.innerHTML += row;
}

function updateTableRowStyles(tableId) {
    const table = document.getElementById(tableId);
    const rows = table.getElementsByTagName("tr");
    for (let i = 0; i < rows.length; i++) {
        if (i % 2 === 0) {
            rows[i].classList.add("even-row");
        } else {
            rows[i].classList.remove("even-row");
        }
    }
}

export {openDialog, closeDialog, populateTable, clearTable, addRowToTable, updateTableRowStyles};