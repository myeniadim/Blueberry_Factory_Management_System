import {openDialog, addRowToTable, updateTableRowStyles, updateTable, generateItemID, generateID, calculateDatePeriod, createCSVArea} from './script.js';
import {storeData, changeableDatas, categories, categoryStockHistory, products, productStockHistory, orders} from './data.js';
import CategoryStockHistory from "./categoryStockHistory.js";
import Product from './product.js';
import ProductStockHistory from './productStockHistory.js';

function updateEveryThing(){
    updateCategories();
    updateProducts();
    updateCategoriesStockView(categories);
    updateProductsStockView(products);
    updateProductsTable(products);
    updateTable(productStockHistory, "product-stock-history-table");
    createCSVArea(".button-area", productStockHistory, "product_stock_history");
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

function addRowtoProductsTable(product){
    addRowToTable(product, "product-table");
    updateTableRowStyles("product-table");
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
            document.getElementById("edit-product-price").value = product.price;
            document.getElementById("edit-product-tax-rate").value = product.taxRate;
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

    const categoryTypeList2 = document.querySelector("#category-type-list");
    categoryTypeList2.innerHTML = "";
    categories.forEach(category => {
        categoryTypeList2.innerHTML += `<option value="${category.type}">${category.type}</option>`;
    });
}

function updateProducts(){
    const productList = document.querySelector("#product-type-list");
    productList.innerHTML = "";
    products.forEach(product => {
        productList.innerHTML += `<option value="${product.name}">${product.name}</option>`;
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
    let productTaxRate = document.querySelector("#product-tax-rate").value;
    let reorderLevel = document.querySelector("#reorder-alert-level").value;
    let stockDate = document.querySelector("#product-stock-date").value;

    console.log(categoryName, productName, productWeight, productPrice, reorderLevel, stockDate);

    let product = new Product(generateID(products), category, productName, productWeight, productPrice, productTaxRate, 0, reorderLevel);
    if((category != null && productName != "" && productWeight > 0 && productPrice > 0 && (productTaxRate > 0 && productTaxRate < 1) && reorderLevel > 0 && stockDate != "") && !isSameProduct(product)){
        products.push(product);
        storeData("products", products);
        addRowtoProductsTable(product);
        updateProductsStockView(products);
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
        } else if (productTaxRate <= 0 || productTaxRate >= 1) {
            alert("Tax rate must be between 0 and 1");
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
        let newProductStockHistory = new ProductStockHistory(generateID(productStockHistory), product, category, newStockNum, "STOCK IN", stockDate);
        productStockHistory.push(newProductStockHistory);
        storeData("productStockHistory", productStockHistory);
        updateTable(productStockHistory, "product-stock-history-table");

        category.quantityStock = category.quantityStock - weight;

        storeData("categories", categories);
        updateCategoriesStockView(categories);
        let newCategoryStockHistory = new CategoryStockHistory(generateID(categoryStockHistory), category, weight, "STOCK OUT (PACKAGED)", stockDate);
        categoryStockHistory.push(newCategoryStockHistory);
        storeData("categoryStockHistory", categoryStockHistory);
        updateProductsTable(products);
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
    let productName = document.getElementById("edit-product-name").value;
    let productWeight = product.weight;
    let productPrice = document.getElementById("edit-product-price").value;
    let productTaxRate = document.getElementById("edit-product-tax-rate").value;
    let reorderLevel = document.getElementById("edit-reorder-alert-level").value;
    let isSameProduct = products.some(product => (product.id != product.id && product.category.type == categoryType && (product.name == productName || product.weight == productWeight)));

    if(productName != "" && productPrice > 0 && productTaxRate > 0 && productTaxRate < 1 && reorderLevel > 0 && !isSameProduct){
        product.name = productName;
        product.price = productPrice;
        product.taxRate = productTaxRate;
        product.reorderLevel = reorderLevel;
        storeData("products", products);
        updateProductsTable(products);
        updateProductsStockView(products);
        document.getElementById("edit-product-dialog").close();
    }
});

document.querySelector("#delete-product-submit-button").addEventListener("click", function(event){
    event.preventDefault();
    let productID = document.getElementById("delete-product-id").value;
    let product = products.find(p => p.id == productID);
    let order = orders.find(o => o.product == productID);
    if(order == null && product.stockNum == 0){
        let index = products.findIndex(p => p.id == productID);
        products.splice(index, 1);
        storeData("products", products);
        let tempProducts = [...products];
        let index2 = productStockHistory.findIndex(p => p.product.id == productID);
        productStockHistory.splice(index2, 1);
        storeData("productStockHistory", productStockHistory);
        updateProductsTable(tempProducts);
        updateProductsStockView(tempProducts);
        updateCategoriesStockView(categories);
        updateTable(productStockHistory, "product-stock-history-table");
        document.getElementById("delete-product-dialog").close();
    }else if(order != null){
        alert("Cannot delete product with active orders");
    }else if(product.stockNum > 0){
        alert("Cannot delete product with stock");
    }
});

document.querySelector("#select-period").addEventListener("change", function(){
    let period = document.getElementById("select-period").value;
    let startDate = document.getElementById("start-date").value;
    if (startDate != ""){
        let endDate = calculateDatePeriod(startDate, period);
        document.getElementById("end-date").value = endDate.toISOString().split("T")[0];
    }
});

document.querySelector("#filter-product-history").addEventListener("click", function(event){
    event.preventDefault();
    let categoryType = document.getElementById("products-stock-history-category-type").value;
    let productName = document.getElementById("products-stock-history-product-type").value;
    let startDate = document.getElementById("start-date").value;
    let period = document.getElementById("select-period").value;
    let endDate = calculateDatePeriod(startDate, period);
    let filteredProductStockHistory;
    let category = categories.find(c => c.type == categoryType);
    let product = products.find(p => p.name == productName);

    if (category != null && product == null && startDate == ""){
        filteredProductStockHistory = productStockHistory.filter(p => p.category.id == category.id);
    }else if (category != null && product != null && startDate == ""){
        filteredProductStockHistory = productStockHistory.filter(p => p.category.id == category.id && p.product.id == product.id);
    }else if (category != null && product == null && startDate != ""){
        filteredProductStockHistory = productStockHistory.filter(p => p.category.id == category.id && new Date(p.stockDate) >= new Date(startDate) && new Date(p.stockDate) <= new Date(endDate));
    }else if (category != null && product != null && startDate != ""){
        filteredProductStockHistory = productStockHistory.filter(p => p.category.id == category
        .id && p.product.id == product.id && new Date(p.stockDate) >= new Date(startDate) && new Date(p.stockDate) <= new Date(endDate));
    }else if (category == null && product != null && startDate == ""){
        filteredProductStockHistory = productStockHistory.filter(p => p.product.id == product.id);
    }else if (category == null && product != null && startDate != ""){
        filteredProductStockHistory = productStockHistory.filter(p => p.product.id == product.id && new Date(p.stockDate) >= new Date(startDate) && new Date(p.stockDate) <= new Date(endDate));
    }else if (category == null && product == null && startDate != ""){
        filteredProductStockHistory = productStockHistory.filter(p => new Date(p.stockDate) >= new Date(startDate) && new Date(p.stockDate) <= new Date(endDate));
    }else{
        alert("Please select at least one filter criteria");
    }
    updateTable(filteredProductStockHistory, "product-stock-history-table");
    document.getElementById("filter-product-history-dialog").close();
    createCSVArea(".button-area", filteredProductStockHistory, "product_stock_history");
});

document.querySelector("#clear-product-filter-button").addEventListener("click", function(event){
    event.preventDefault();
    updateTable(productStockHistory, "product-stock-history-table");
    createCSVArea(".button-area", productStockHistory, "product_stock_history");
});

updateEveryThing();
