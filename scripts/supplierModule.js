import {openDialog, closeDialog, populateTable, clearTable, addRowToTable, updateTableRowStyles, updateTable} from "./script.js";
import Farmer from "./farmer.js";
import Purchase from "./purchase.js";
import {storeData, retrieveData, getFarmers, farmers, purchases} from "./data.js";


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

function updateFarmersTable(farmerList){
    updateTable(farmerList, "farmers-table");
    updateTableRowStyles("farmers-table");
    addEditEventListenersToButtons();
    addDeleteEventListenersToButtons();
    updateSelectFarmerOptions();
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
    const tempFarmers = [...farmers];
    let searchInput = document.querySelector("#search-farmer").value;
    let searchResults = tempFarmers.filter(farmer => farmer.name.toLowerCase().includes(searchInput.toLowerCase()));
    let searchResultsByAddress = tempFarmers.filter(farmer => farmer.address.toLowerCase().includes(searchInput.toLowerCase()));
    let combinedResults = [...new Set([...searchResults, ...searchResultsByAddress])];
    updateFarmersTable(combinedResults);
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
    if(fName == "" || fPhoneNum == "" || fMail == "" || fAddress == "" || fCity == "" || fCountry == ""){
        alert("All fields must be filled");
        return;
    }
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
    updateFarmersTable(farmers);
    document.querySelector("#edit-farmer-dialog").close();
}

function deleteFarmer(farmerID){
    const index = farmers.findIndex(f => f.id == farmerID);
    farmers.splice(index, 1);
    storeData("farmers", farmers);
    updateFarmersTable(farmers);
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

function addPurchase(event){
    event.preventDefault();
    let farmerID = document.querySelector("#farmer-id").value;
    let purchaseDate = document.querySelector("#purchase-date").value;
    let purchaseQuantity = document.querySelector("#purchase-quantity").value;
    let purchasePricePerKg = document.querySelector("#purchase-price-per-kg").value;
    let farmer = farmers.find(f => f.id == farmerID);
    let purchase = new Purchase(generateID(purchases), farmer, purchaseDate, purchaseQuantity, purchasePricePerKg);
    if(farmer == null){
        alert("Farmer does not exist");
        return;
    }
    if(purchaseQuantity <= 0 || purchasePricePerKg <= 0){
        alert("Quantity and price per kg must be greater than 0");
        return;
    }
    if(purchaseDate == ""){
        alert("Date must be filled");
        return;
    }
    purchases.push(purchase);
    storeData("purchases", purchases);
    addRowToTable(purchase, "purchases-table"), addSortEventListeners();
    updateTableRowStyles("purchases-table");
    document.querySelector("#add-purchase-dialog").close();
}

document.querySelector("#add-purchase-button").addEventListener("click", (event) =>{
    addPurchase(event);
});

updateTable(purchases, "purchases-table"), addSortEventListeners();

function searchPurchases(){
    const tempPurchases = [...purchases];
    let searchInput = document.querySelector("#search-purchase").value;
    let searchResults = tempPurchases.filter(purchase => purchase.farmer.name.toLowerCase().includes(searchInput.toLowerCase()));
    let searchResultsByDate = tempPurchases.filter(purchase => purchase.date.includes(searchInput));
    let combinedResults = [...new Set([...searchResults, ...searchResultsByDate])];
    updateTable(combinedResults, "purchases-table");
}

document.querySelector("#search-purchase").addEventListener("keyup", searchPurchases);


let lastSortedColumn = null;
let sortOrder = 'asc';

function addSortEventListeners() {
    document.querySelectorAll(".clickable-th").forEach(button => {
        button.addEventListener("click", function(event) {
            if (lastSortedColumn === button.id) {
                sortOrder = sortOrder === 'asc' ? 'desc' : 'asc';
            } else {
                sortOrder = 'asc';
            }
            lastSortedColumn = button.id;
            sortPurchases(event, button.id, sortOrder);
        });
    });
}

function sortPurchases(event, column, order) {
    event.preventDefault();
    const tempPurchases = [...purchases];
    let sortedPurchases = [];
    if (column == "purchase-id") {
        sortedPurchases = tempPurchases.sort((a, b) => order === 'asc' ? a.id - b.id : b.id - a.id);
    } else if (column == "farmer-id") {
        sortedPurchases = tempPurchases.sort((a, b) => order === 'asc' ? a.farmer.id - b.farmer.id : b.farmer.id - a.farmer.id);
    } else if (column == "farmer-name") {
        sortedPurchases = tempPurchases.sort((a, b) => order === 'asc' ? a.farmer.name.localeCompare(b.farmer.name) : b.farmer.name.localeCompare(a.farmer.name));
    } else if (column == "date") {
        sortedPurchases = tempPurchases.sort((a, b) => order === 'asc' ? a.date.localeCompare(b.date) : b.date.localeCompare(a.date));
    } else if (column == "quantity") {
        sortedPurchases = tempPurchases.sort((a, b) => order === 'asc' ? a.quantity - b.quantity : b.quantity - a.quantity);
    } else if (column == "price") {
        sortedPurchases = tempPurchases.sort((a, b) => order === 'asc' ? a.priceperkg - b.priceperkg : b.priceperkg - a.priceperkg);
    } else if (column == "cost") {
        sortedPurchases = tempPurchases.sort((a, b) => order === 'asc' ? a.calculateTotalPrice() - b.calculateTotalPrice() : b.calculateTotalPrice() - a.calculateTotalPrice());
    }
    updateTable(sortedPurchases, "purchases-table");
    addSortEventListeners(); 
}


//EXPENSE CALCULATION SECTION

updateSelectFarmerOptions();

function updateSelectFarmerOptions(){
    let selectFarmer = document.querySelector("#select-farmer");
    selectFarmer.innerHTML = "<option value='select'>Select Farmer</option>";
    farmers.forEach(farmer => {
        let option = document.createElement("option");
        option.value = farmer.id;
        option.textContent = " (Farmer ID: " + farmer.id + ") " + farmer.name;
        selectFarmer.appendChild(option);
    });
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

document.querySelector("#submit-cost-button").addEventListener("click", function(event){
    event.preventDefault();
    let farmerID = document.querySelector("#select-farmer").value;
    let startDate = document.querySelector("#start-date").value;
    let period = document.querySelector("#select-period").value;
    let totalCost = 0;
    if (farmerID == "select" && startDate == ""){
        alert("Please select a farmer or enter a start date");
        return;
    }else if (farmerID == "select" && (startDate != "" && period == "select")){
        alert("Please select a period");
        return;
    }else if (farmerID != "select" && startDate == ""){
        alert("Please enter a start date");
        return;
    }else if (farmerID != "select" && (startDate != "" && period == "select")){
        alert("Please select a period");
        return;
    }else if (farmerID == "select" && (startDate != "" && period != "select")){
        console.log("clicked");
        let endDate = calculateDatePeriod(startDate, period);
        let filteredPurchases = purchases.filter(purchase => new Date(purchase.date) >= new Date(startDate) && new Date(purchase.date) <= endDate);
        filteredPurchases.forEach(purchase => {
            totalCost += purchase.calculateTotalPrice();
        });
        document.querySelector("#end-date").value = endDate.toISOString().split('T')[0];
        updateTable(filteredPurchases, "calculate-purchases-table");
        document.querySelector("#sum-of-total-cost").textContent = "Total Cost: " + totalCost + "$";
    }else if (farmerID != "select" && (startDate != "" && period != "select")){
        let endDate = calculateDatePeriod(startDate, period);
        let filteredPurchases = purchases.filter(purchase => purchase.farmer.id == farmerID && new Date(purchase.date) >= new Date(startDate) && new Date(purchase.date) <= endDate);
        filteredPurchases.forEach(purchase => {
            totalCost += purchase.calculateTotalPrice();
        });
        document.querySelector("#end-date").value = endDate.toISOString().split('T')[0];
        updateTable(filteredPurchases, "calculate-purchases-table");
        document.querySelector("#sum-of-total-cost").textContent = "Total Cost: " + totalCost + "$";
    }
});
