import {openDialog, closeDialog, populateTable, clearTable, addRowToTable} from "./script.js";
import Farmer from "./farmer.js";
import {storeData, retrieveData, getFarmers} from "./data.js";

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

const farmers = getFarmers();

function addFarmer(event){
    event.preventDefault();
    let fName = document.querySelector("#farmer-name").value;
    let fPhoneNum = document.querySelector("#farmer-phone").value;
    let fMail = document.querySelector("#farmer-email").value;
    let fAddress = document.querySelector("#farmer-address").value;
    let fCity = document.querySelector("#farmer-city").value;
    let fCountry = document.querySelector("#farmer-country").value;
    let farmer = new Farmer(1, fName, fPhoneNum, fMail, fAddress, fCity, fCountry, fCountry);
    farmers.push(farmer);
    storeData("farmers", farmers);
    addRowToTable(farmer, "farmers-table");
    updateTableRowStyles("farmers-table");
    document.querySelector("#add-farmer-dialog").close();
}

populateTable(farmers, "farmers-table");
updateTableRowStyles("farmers-table");

document.querySelector("#add-farmer-button").addEventListener("click", (event) =>{
    addFarmer(event);
});

