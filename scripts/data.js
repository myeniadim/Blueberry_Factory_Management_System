import Farmer from "./farmer.js";

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

const farmers = getFarmers();


export {storeData, retrieveData, getFarmers, farmers};