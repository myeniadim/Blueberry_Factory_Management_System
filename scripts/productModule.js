import {openDialog, addRowToTable, updateTableRowStyles, updateTable, generateItemID, generateID, calculateDatePeriod} from './script.js';
import {storeData, changeableDatas, categories, categoryStockHistory, products, productStockHistory} from './data.js';
import Category from "./category.js";
import CategoryStockHistory from "./categoryStockHistory.js";
import Product from './product.js';
import ProductStockHistory from './productStockHistory.js';

function updateEveryThing(){
    updateCategories();
    updateCategoriesStockView(categories);
    updateProductsStockView(products);
    updateProductsTable(products);
    updateTable(productStockHistory, "product-stock-history-table");
}



function updateCategoriesStockView(categoryList){
    const cardView = document.querySelector("#category-stock-level-area");
    cardView.innerHTML = "";
    categoryList.forEach(category => {
        cardView.innerHTML += category.toCardViewWithOutButtons();
    });
}

function updateProductsTable(productList){
    updateTable(productList, "product-table")
    addEditProductButtonListeners();
    addDeleteProductButtonListeners();
}


function addUpdateCategoryStockButtonListeners(){
    document.querySelectorAll(".update-stock-product-button").forEach(button => {
        button.addEventListener("click", function(){
            console.log(button.id);
            let product = products.find(p => p.id == button.id);
            document.getElementById("update-product-id").value = product.id;
            document.getElementById("update-category-name").value = product.category.type;
            document.getElementById("update-product-name").value = product.name;
            openDialog("update-product-stock-dialog");
        });
    });
}

function addEditProductButtonListeners(){
    document.querySelectorAll(".edit-product-button").forEach(button => {
        button.addEventListener("click", function(){
            let product = products.find(p => p.id == button.id);
            document.getElementById("edit-product-id").value = product.id;
            document.getElementById("edit-product-category").value = product.category.type;
            document.getElementById("edit-product-name").value = product.name;
            document.getElementById("edit-product-weight").value = product.weight;
            document.getElementById("edit-product-price").value = product.price;
            document.getElementById("edit-reorder-alert-level").value = product.reorderLevel;
            openDialog("edit-product-dialog");
        });
    });
}

function addDeleteProductButtonListeners(){
    document.querySelectorAll(".delete-product-button").forEach(button =>{
        button.addEventListener("click", function(){
            document.getElementById("delete-product-id").value = button.id;
            document.getElementById("delete-product-category").value = products.find(p => p.id == button.id).category.type;
            document.getElementById("delete-product-name").value = products.find(p => p.id == button.id).name;
            openDialog("delete-product-dialog");
        });
    });
}


function updateProductsStockView(productList){
    const cardView = document.querySelector("#product-stock-level-area");
    cardView.innerHTML = "";
    productList.forEach(product => {
        cardView.innerHTML += product.toCardView();
    });
    addUpdateCategoryStockButtonListeners()
}


function updateCategories(){
    const categoryTypeList = document.querySelector("#category-list");
    categoryTypeList.innerHTML = "";
    categories.forEach(category => {
        categoryTypeList.innerHTML += `<option value="${category.type}">${category.type}</option>`;
    });
    
}

function isSameProduct(product){
    return products.some(p => p.category.type === product.category.type && (p.name === product.name || p.weight === product.weight));
}


document.querySelector("#add-product-submit-button").addEventListener("click", function(event){
    event.preventDefault();
    let categoryName = document.querySelector("#product-category").value;
    let category = categories.find(c => c.type === categoryName);
    let productName = document.querySelector("#product-name").value;
    let productWeight = document.querySelector("#product-weight").value;
    let productPrice = document.querySelector("#product-price").value;
    let reorderLevel = document.querySelector("#reorder-alert-level").value;
    let stockDate = document.querySelector("#product-stock-date").value;

    console.log(categoryName, productName, productWeight, productPrice, reorderLevel, stockDate);

    let product = new Product(generateID(products), category, productName, productWeight, productPrice, 0, reorderLevel);
    if((category != null && productName != "" && productWeight > 0 && productPrice > 0 && reorderLevel > 0 && stockDate != "") && !isSameProduct(product)){
        products.push(product);
        storeData("products", products);
        addRowToTable(product, "product-table");
        updateTableRowStyles("product-table");
        let newProductStockHistory = new ProductStockHistory(generateID(productStockHistory), product.id, product.name, product.category.itemID, product.category.type, 0, "Product Created", stockDate);
        productStockHistory.push(newProductStockHistory);
        storeData("productStockHistory", productStockHistory);
        updateTable(productStockHistory, "product-stock-history-table");
        document.querySelector("#add-product-dialog").close();
    }else{
        if (category == null) {
            alert("Please select a valid category");
        } else if (productName == "") {
            alert("Product name cannot be empty");
        } else if (productWeight <= 0) {
            alert("Product weight must be greater than 0");
        } else if (productPrice <= 0) {
            alert("Product price must be greater than 0");
        } else if (reorderLevel <= 0) {
            alert("Reorder level must be greater than 0");
        } else if (stockDate == "") {
            alert("Please provide a valid stock date");
        } else if (isSameProduct(product)) {
            alert("Product with the same name or weight already exists in the same category");
        }
    }
});

document.querySelector("#update-product-stock-submit-button").addEventListener("click", function(event){
    event.preventDefault();
    let productID = document.getElementById("update-product-id").value;
    let product = products.find(p => p.id == productID);
    let newStockNum = document.getElementById("update-product-stock-num").value;
    let stockDate = document.getElementById("update-product-stock-date").value;

    let weight = product.calculateTotalWeight(newStockNum);

    let category = categories.find(c => c.type == product.category.type);

    if(newStockNum > 0 && stockDate != "" && weight <= category.quantityStock){

        product.stockNum += parseInt(newStockNum);
        console.log(product.stockNum);
        storeData("products", products);
        updateTable(products, "product-table");
        updateProductsStockView(products);
        let newProductStockHistory = new ProductStockHistory(generateID(productStockHistory), product.id, product.name, product.category.itemID, product.category.type, newStockNum, "STOCK IN", stockDate);
        productStockHistory.push(newProductStockHistory);
        storeData("productStockHistory", productStockHistory);
        updateTable(productStockHistory, "product-stock-history-table");

        category.quantityStock = category.quantityStock - weight;

        storeData("categories", categories);
        updateCategoriesStockView(categories);
        let newCategoryStockHistory = new CategoryStockHistory(generateID(categoryStockHistory), category, weight, "STOCK OUT (PACKAGED)", stockDate);
        categoryStockHistory.push(newCategoryStockHistory);
        storeData("categoryStockHistory", categoryStockHistory);
        document.getElementById("update-product-stock-dialog").close();

    } else {
        if (newStockNum <= 0) {
            alert("Stock number must be greater than 0");
        } else if (stockDate == "") {
            alert("Please provide a valid stock date");
        } else if (weight > category.quantityStock) {
            alert("Insufficient stock in category");
        }
    }
});

document.querySelector("#select-category").addEventListener("change", function(){
    let value = document.querySelector("#select-category").value;
    let tempCategories = [...categories];
    let newCategoryList;
    if (value == "low"){
        newCategoryList = tempCategories.filter(c => c.quantityStock < c.reorderLevel);
    }else if (value == "high"){
        newCategoryList = tempCategories.filter(c => c.quantityStock >= c.reorderLevel);
    }else{
        newCategoryList = tempCategories;
    }
    updateCategoriesStockView(newCategoryList);
});

document.querySelector("#select-product").addEventListener("change", function(){
    let value = document.querySelector("#select-product").value;
    let tempProducts = [...products];
    let newProductList;
    if (value == "low"){
        newProductList = tempProducts.filter(p => p.stockNum < p.reorderLevel);
    }else if (value == "high"){
        newProductList = tempProducts.filter(p => p.stockNum >= p.reorderLevel);
    }else{
        newProductList = tempProducts;
    }
    updateProductsStockView(newProductList);
});

document.querySelector("#search-product").addEventListener("keyup", function(){
    let tempProducts = [...products];
    let searchValue = document.getElementById("search-product").value.toLowerCase();
    let filteredProducts = tempProducts.filter(product => product.name.toLowerCase().includes(searchValue));
    updateProductsTable(filteredProducts);
});

document.querySelector("#edit-product-submit-button").addEventListener("click", function(event){
    event.preventDefault();
    let productID = document.getElementById("edit-product-id").value;
    let product = products.find(p => p.id == productID);
    let categoryType = document.getElementById("edit-product-category").value;
    let productName = document.getElementById("edit-product-name").value;
    let productWeight = document.getElementById("edit-product-weight").value;
    let productPrice = document.getElementById("edit-product-price").value;
    let reorderLevel = document.getElementById("edit-reorder-alert-level").value;
    let stockDate = document.getElementById("edit-product-stock-date").value;
    let isSameProduct = products.some(product => (product.id != product.id && product.category.type == categoryType && (product.name == productName || product.weight == productWeight)));
    if((categoryType != "" && productName != "" && productWeight > 0 && productPrice > 0 && reorderLevel > 0 && stockDate != "") && !isSameProduct){
        if (product.weight != productWeight) {
            let category = categories.find(c => c.type == product.category.type);
            let weight = product.calculateTotalWeight(product.stockNum);
            product.stockNum = 0;
            category.quantityStock = + (category.quantityStock + weight).toFixed(2);
            storeData("categories", categories);
            updateCategoriesStockView(categories);
            let newCategoryStockHistory = new CategoryStockHistory(generateID(categoryStockHistory), category, weight, "STOCK OUT (PRODUCT UPDATED)", stockDate);
            categoryStockHistory.push(newCategoryStockHistory);
            storeData("categoryStockHistory", categoryStockHistory);
            let newProductStockHistory = new ProductStockHistory(generateID(productStockHistory), product.id, product.name, product.category.itemID, product.category.type, product.stockNum, "STOCK OUT (CHANGED PRODUCT WEIGHT)", stockDate);
            productStockHistory.push(newProductStockHistory);
            storeData("productStockHistory", productStockHistory);
            updateTable(productStockHistory, "product-stock-history-table");
        }
        product.weight = productWeight; 
        product.name = productName;
        product.price = productPrice;
        product.reorderLevel = reorderLevel;
        storeData("products", products);
        updateTable(products, "product-table");
        updateProductsStockView(products);
        document.getElementById("edit-product-dialog").close();
    }else{
        if (categoryType == "") {
            alert("Please select a valid category");
        } else if (productName == "") {
            alert("Product name cannot be empty");
        } else if (productWeight <= 0) {
            alert("Product weight must be greater than 0");
        } else if (productPrice <= 0) {
            alert("Product price must be greater than 0");
        } else if (reorderLevel <= 0) {
            alert("Reorder level must be greater than 0");
        } else if (stockDate == "") {
            alert("Please provide a valid stock date");
        } else if (isSameProduct) {
            alert("Product with the same name or weight already exists in the same category");
        }
    }
});

document.querySelector("#delete-product-submit-button").addEventListener("click", function(event){
    event.preventDefault();
    let productID = document.getElementById("delete-product-id").value;
    let product = products.find(p => p.id == productID);
    let stockDate = document.getElementById("delete-product-stock-date").value;
    let category = categories.find(c => c.type == product.category.type);
    let weight = product.calculateTotalWeight(product.stockNum);
    category.quantityStock = + (category.quantityStock + weight).toFixed(2);
    storeData("categories", categories);
    updateCategoriesStockView(categories);
    let newCategoryStockHistory = new CategoryStockHistory(generateID(categoryStockHistory), category, weight, "STOCK IN (PRODUCT DELETED)", stockDate);
    categoryStockHistory.push(newCategoryStockHistory);
    storeData("categoryStockHistory", categoryStockHistory);
    let newProductStockHistory = new ProductStockHistory(generateID(productStockHistory), product.id, product.name, product.category.itemID, product.category.type, product.stockNum, "STOCK OUT (PRODUCT DELETED)", stockDate);
    productStockHistory.push(newProductStockHistory);
    storeData("productStockHistory", productStockHistory);
    updateTable(productStockHistory, "product-stock-history-table");
    let tempProducts = products.filter(p => p.id != productID);
    storeData("products", tempProducts);
    updateTable(tempProducts, "product-table");
    updateProductsStockView(tempProducts);
    document.getElementById("delete-product-dialog").close();
});

updateEveryThing();