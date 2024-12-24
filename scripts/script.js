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

document.querySelectorAll(".add-object-button").forEach(button => {
    button.addEventListener("click", function(){
        openDialog(button.id);
    });
});

document.querySelectorAll(".cancel-button").forEach(button => {
    button.addEventListener("click", function(event){
        closeDialog(event, button.id);
    });
});

function generateID(objectList){
    let id = 1;
    if(objectList.length > 0){
        id = objectList[objectList.length - 1].id + 1;
    }
    return id;
}

function generateItemID(objectList){
    let id = 1;
    if(objectList.length > 0){
        id = objectList[objectList.length - 1].itemID + 1;
    }
    return id;
}

function calculateDatePeriod(startDate, period){
    let date = new Date(startDate);
    if (period == "daily"){
        date.setDate(date.getDate() + 1);
    } else if (period == "weekly"){
        date.setDate(date.getDate() + 7);
    } else if (period == "monthly"){
        date.setMonth(date.getMonth() + 1);
    } else if (period == "yearly"){
        date.setFullYear(date.getFullYear() + 1);
    }return date;
}

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

function updateTable(objectList, tabledID){
    clearTable(tabledID);
    populateTable(objectList, tabledID);
    updateTableRowStyles(tabledID);
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

function createCSVArea(btnClassName, objectList, fileName){
    if (objectList.length > 0){
        let buttonArea = document.querySelector(btnClassName);
        buttonArea.innerHTML = "";
        let downloadButton = document.createElement("button");
        downloadButton.textContent = "Download CSV";
        downloadButton.addEventListener("click", function() {
            generateCSVFile(objectList, fileName);
        });
        buttonArea.appendChild(downloadButton);
    }
}

function generateCSVFile(objectList, fileName){
    let csvContent = "data:text/csv;charset=utf-8,";
    if (fileName.includes("tax")){
        csvContent += objectList[0].toCSVHeaderTax();
    }else{
        csvContent += objectList[0].toCSVHeader();
    }
    objectList.forEach(object => {
        if (fileName.includes("tax")){
            csvContent += object.toCSVRowTax();
        }else{
            csvContent += object.toCSVRow();
        }
    });
    var encodedUri = encodeURI(csvContent);
    var link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", fileName);
    document.body.appendChild(link);
    link.click();
}

export {openDialog, closeDialog, populateTable, clearTable, addRowToTable, updateTableRowStyles, updateTable, generateID, generateItemID, showSection, calculateDatePeriod, generateCSVFile, createCSVArea};