import {openDialog, closeDialog, populateTable, clearTable, addRowToTable, updateTableRowStyles, updateTable} from "./script.js";
import Farmer from "./farmer.js";
import {storeData, retrieveData, getFarmers, farmers} from "./data.js";


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

//FARMERS SECTION

function addEditEventListenersToButtons(){
    document.querySelectorAll(".edit-farmer-button").forEach(button => {
        button.addEventListener("click", function(){
            openDialog("edit-farmer-dialog");
            let farmer = farmers.find(f => f.id == button.id);
            document.querySelector("#edit-farmer-id").value = farmer.id;
            document.querySelector("#edit-farmer-name").value = farmer.name;
            document.querySelector("#edit-farmer-phone").value = farmer.phoneNumber;
            document.querySelector("#edit-farmer-email").value = farmer.email;
            document.querySelector("#edit-farmer-address").value = farmer.address;
            document.querySelector("#edit-farmer-city").value = farmer.city;
            document.querySelector("#edit-farmer-country").value = farmer.country;
        });
    });
}

function addDeleteEventListenersToButtons(){
    document.querySelectorAll(".delete-farmer-button").forEach(button => {
        button.addEventListener("click", function(){
            deleteFarmer(button.id);
        });
    });
}

function generateID(objectList){
    let id = 1;
    if(objectList.length > 0){
        id = objectList[objectList.length - 1].id + 1;
    }
    return id;
}

function isSameFarmer(farmer){
    return farmers.some(f => 
        f.name === farmer.name && 
        f.phoneNumber === farmer.phoneNumber && 
        f.email === farmer.email && 
        f.address === farmer.address && 
        f.city === farmer.city && 
        f.country === farmer.country
    );
}

function searchFarmers(){
    let searchInput = document.querySelector("#search-farmer").value;
    let searchResults = farmers.filter(farmer => farmer.name.toLowerCase().includes(searchInput.toLowerCase()));
    let searchResultsByAddress = farmers.filter(farmer => farmer.address.toLowerCase().includes(searchInput.toLowerCase()));
    let combinedResults = [...new Set([...searchResults, ...searchResultsByAddress])];
    updateTable(combinedResults, "farmers-table"), addEditEventListenersToButtons(), addDeleteEventListenersToButtons();
}

function addFarmer(event){
    event.preventDefault();
    let fName = document.querySelector("#farmer-name").value;
    let fPhoneNum = document.querySelector("#farmer-phone").value;
    let fMail = document.querySelector("#farmer-email").value;
    let fAddress = document.querySelector("#farmer-address").value;
    let fCity = document.querySelector("#farmer-city").value;
    let fCountry = document.querySelector("#farmer-country").value;
    let farmer = new Farmer(generateID(farmers), fName, fPhoneNum, fMail, fAddress, fCity, fCountry, fCountry);
    if (isSameFarmer(farmer)){
        alert("Farmer already exists");
        return;
    }
    farmers.push(farmer);
    storeData("farmers", farmers);
    addRowToTable(farmer, "farmers-table");
    updateTableRowStyles("farmers-table"), addEditEventListenersToButtons(), addDeleteEventListenersToButtons();
    document.querySelector("#add-farmer-dialog").close();
}

function editFarmer(event){
    event.preventDefault();
    let fID = document.querySelector("#edit-farmer-id").value;
    let fName = document.querySelector("#edit-farmer-name").value;
    let fPhoneNum = document.querySelector("#edit-farmer-phone").value;
    let fMail = document.querySelector("#edit-farmer-email").value;
    let fAddress = document.querySelector("#edit-farmer-address").value;
    let fCity = document.querySelector("#edit-farmer-city").value;
    let fCountry = document.querySelector("#edit-farmer-country").value;

    const farmer = farmers.find(f => f.id == parseInt(fID));
    
    farmer.name = fName;
    farmer.phoneNumber = fPhoneNum;
    farmer.email = fMail;
    farmer.address = fAddress;
    farmer.city = fCity;
    farmer.country = fCountry;

    storeData("farmers", farmers);
    updateTable(farmers, "farmers-table"), addEditEventListenersToButtons(), addDeleteEventListenersToButtons();
    document.querySelector("#edit-farmer-dialog").close();
}

function deleteFarmer(farmerID){
    const index = farmers.findIndex(f => f.id == farmerID);
    farmers.splice(index, 1);
    storeData("farmers", farmers);
    updateTable(farmers, "farmers-table"), addEditEventListenersToButtons(), addDeleteEventListenersToButtons();
}


document.querySelector("#add-farmer-button").addEventListener("click", (event) =>{
    addFarmer(event);
});

document.querySelector("#edit-farmer-button").addEventListener("click", (event) =>{
    editFarmer(event);
});

document.querySelector("#search-farmer").addEventListener("keyup", searchFarmers);

updateTable(farmers, "farmers-table"), addEditEventListenersToButtons(), addDeleteEventListenersToButtons();


//PURCHASE RECORDS SECTION

