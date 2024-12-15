import Farmer from "./farmer.js";
import Purchase from "./purchase.js";

function storeData(dataTitle, data){
    localStorage.setItem(dataTitle, JSON.stringify(data));
}

function retrieveData(dataTitle){
    return JSON.parse(localStorage.getItem(dataTitle));
}

function getFarmers(){
    let farmersList = [];
    try {
        let loadedFarmers = retrieveData("farmers");
        if(loadedFarmers){
            loadedFarmers.forEach(farmer => {
                farmersList.push(new Farmer(farmer.id, farmer.name, farmer.phoneNumber, farmer.email, farmer.address, farmer.city, farmer.country));
            });
        }
    } catch (error) {
        console.error("Error loading farmers from local storage");
    }
    return farmersList;
}

function getPurchaseList(){
    let purchaseList = [];
    try {
        let loadedPurchases = retrieveData("purchases");
        if(loadedPurchases){
            loadedPurchases.forEach(purchase => {
                let farmer = farmers.find(f => f.id == purchase.farmer.id);
                purchaseList.push(new Purchase(purchase.id, farmer, purchase.date, purchase.quantity, purchase.priceperkg));
            });
        }
    } catch (error) {
        console.error("Error loading purchases from local storage");
    }
    return purchaseList;
}

const farmers = getFarmers();
const purchases = getPurchaseList();


export {storeData, retrieveData, getFarmers, farmers, purchases};