import Farmer from "./farmer.js";

function storeData(dataTitle, data){
    localStorage.setItem(dataTitle, JSON.stringify(data));
}

function retrieveData(dataTitle){
    return JSON.parse(localStorage.getItem(dataTitle));
}

function getFarmers(){
    const farmers = [];
    try {
        let loadedFarmers = retrieveData("farmers");
        if(loadedFarmers){
            loadedFarmers.forEach(farmer => {
                farmers.push(new Farmer(farmer.id, farmer.name, farmer.phoneNum, farmer.email, farmer.address, farmer.city, farmer.country, farmer.country));
            });
        }
    } catch (error) {
        console.error("Error loading farmers from local storage");
    }
    return farmers;
}


export {storeData, retrieveData, getFarmers};