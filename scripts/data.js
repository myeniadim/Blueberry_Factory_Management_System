import Farmer from "./farmer.js";
import Purchase from "./purchase.js";
import Category from "./category.js";
import CategoryStockHistory from "./categoryStockHistory.js";
import Product from "./product.js";
import ProductStockHistory from "./productStockHistory.js";

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

function getChangeableDatas(){
    let changeableDatas = {
        supplierStock: 0
    };
    try {
        let loadedChangeableDatas = retrieveData("changeableDatas");
        if(loadedChangeableDatas){
            changeableDatas = loadedChangeableDatas;
        }
    } catch (error) {
        console.error("Error loading changeable datas from local storage");
    }
    return changeableDatas;
}

function getCategoryList(){
    let categoryList = [];
    try {
        let loadedCategories = retrieveData("categories");
        if(loadedCategories){
            loadedCategories.forEach(category => {
                categoryList.push(new Category(category.itemID, category.type, category.quantityStock, category.reorderLevel, category.stockDate));
            });
        }
    } catch (error) {
        console.error("Error loading categories from local storage");
    }
    return categoryList;
}

function getCategoryStockHistoryList(){
    let categoriesList = categories;
    let categoryStockHistoryList = [];
    if(categoriesList.length > 0){
        try {
            let loadedCategoryStockHistory = retrieveData("categoryStockHistory");
            if(loadedCategoryStockHistory){
                loadedCategoryStockHistory.forEach(categoryStockHistory => {
                    let category = categoriesList.find(c => c.itemID == categoryStockHistory.Category.itemID);
                    categoryStockHistoryList.push(new CategoryStockHistory(categoryStockHistory.id, category, categoryStockHistory.weight ,categoryStockHistory.stockType, categoryStockHistory.stockDate));
                });
            }
        } catch (error) {
            console.error("Error loading category stock history from local storage");
        }
    }
    return categoryStockHistoryList;
}

function getProductList(){
    let categoriesList = categories;
    let productList = [];
    try {
        let loadedProducts = retrieveData("products");
        if(loadedProducts){
            loadedProducts.forEach(product => {
                let category = categoriesList.find(c => c.itemID == product.category.itemID);
                productList.push(new Product(product.id, category, product.name, product.weight, product.price, product.stockNum, product.reorderLevel));
            });
        }
    } catch (error) {
        console.error("Error loading products from local storage");
    }
    return productList;
}

function getProductStockHistoryList(){
    let productStockHistoryList = [];
    try {
        let loadedProductStockHistory = retrieveData("productStockHistory");
        if(loadedProductStockHistory){
            loadedProductStockHistory.forEach(productStockHistory => {
                productStockHistoryList.push(new ProductStockHistory(productStockHistory.id, productStockHistory.productId, productStockHistory.productName, productStockHistory.categoryId, productStockHistory.categoryType, productStockHistory.stockAmount, productStockHistory.stockType, productStockHistory.stockDate));
            });
        }
    } catch (error) {
        console.error("Error loading product stock history from local storage");
    }
    return productStockHistoryList;
}



//Supplier
const farmers = getFarmers();
const purchases = getPurchaseList();
//
const changeableDatas = getChangeableDatas();
//Inventory
const categories = getCategoryList();
const categoryStockHistory = getCategoryStockHistoryList();
//Product Categorization
const products = getProductList();
const productStockHistory = getProductStockHistoryList();




export {storeData, retrieveData, getFarmers, farmers, purchases, changeableDatas, categories, categoryStockHistory, products, productStockHistory};