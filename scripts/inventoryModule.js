import {openDialog, addRowToTable, updateTableRowStyles, updateTable, generateID, calculateDatePeriod, createCSVArea} from "./script.js";
import {storeData, changeableDatas, products, productStockHistory, categories, categoryStockHistory} from "./data.js";
import Category from "./category.js";
import CategoryStockHistory from "./categoryStockHistory.js";


function addUpdateCategoryStockButtonListeners(){
    document.querySelectorAll(".update-stock-category-button").forEach(button => {
        button.addEventListener("click", function(){
            let category = categories.find(c => c.id == button.id);
            document.getElementById("update-category-type").value = category.type;
            document.getElementById("current-stock-level").value = category.quantityStock;
            openDialog("update-category-stock-dialog");
        });
    });
}

updateCategoriesInput();

function updateCategoriesInput(){
    let categoryTypeList = document.querySelector("#category-type-list");
    categoryTypeList.innerHTML = "";
    categories.forEach(category => {
        categoryTypeList.innerHTML += `<option value="${category.type}">${category.type}</option>`;
    });
}

function addEditCategoryButtonListeners(){
    document.querySelectorAll(".edit-category-button").forEach(button => {
        button.addEventListener("click", function(){
            let category = categories.find(c => c.id == button.id);
            document.getElementById("edit-category-id").value = category.id;
            document.getElementById("edit-category-type").value = category.type;
            document.getElementById("edit-reorder-level").value = category.reorderLevel;
            openDialog("edit-category-dialog");
        });
    });
}

function addDeleteCategoryButtonListeners(){
    document.querySelectorAll(".delete-category-button").forEach(button => {
        button.addEventListener("click", function(){
            let category = categories.find(c => c.id == button.id);
            document.getElementById("delete-category-id").value = category.id;
            openDialog("delete-category-dialog");
        });
    });
}


function updateSupplierStock(){
    const cardView = document.querySelector(".card-view-solo-area .card-view");
    cardView.innerHTML = "";
    cardView.innerHTML += `
        <h3>UNCATEGORIZED BLUEBERRIES</h3>
        <div>Stock Level: ${changeableDatas.supplierStock}kg</div>
    `;
}
updateSupplierStock();


function updateCategoryStockView(filteredCategories){
    const cardView = document.querySelector(".card-view-area");
    cardView.innerHTML = "";
    filteredCategories.forEach(category => {
        cardView.innerHTML += category.toCardView();
    });
    addUpdateCategoryStockButtonListeners();
}

function updateCategoriesTable(categoriesList){
    updateTable(categoriesList, "categories-table");
    addEditCategoryButtonListeners();
    addDeleteCategoryButtonListeners();
}

function updateEverything(){
    updateCategoriesTable(categories);
    updateCategoryStockView(categories);
    updateTable(categoryStockHistory, "category-stock-history-table");
    createCSVArea(".generate-csv-button-area", categoryStockHistory, "category-stock-history-table");
}

updateEverything();


function isSameCategory(category){
    return categories.some(c => 
        c.type.toLowerCase() == category.type.toLowerCase()
    );
}


function createNewCategory(event){
    event.preventDefault();
    let id = generateID(categories);
    let type = document.getElementById("category-type").value;
    let quantityStock = 0;
    let reorderLevel = document.getElementById("reorder-level").value;
    let stockDate = document.getElementById("stock-date").value;

    if(type=="" || reorderLevel=="" || stockDate==""){
        alert("Please fill out all fields");
        return;
    }
    if(reorderLevel < 0){
        alert("Please enter a valid number");
        return;
    }
    let newCategory = new Category(id, type, quantityStock, reorderLevel, stockDate);
    if(isSameCategory(newCategory)){
        alert("Category already exists");
        return;
    }

    categories.push(newCategory);
    storeData("categories", categories);
    addRowToTable(newCategory, "categories-table");
    updateTableRowStyles("categories-table");
    addEditCategoryButtonListeners();
    updateCategoryStockView(categories);

    let newCategoryStockHistory = new CategoryStockHistory(generateID(categoryStockHistory), newCategory, quantityStock, "NEW CATEGORY", stockDate);
    categoryStockHistory.push(newCategoryStockHistory);
    storeData("categoryStockHistory", categoryStockHistory);
    updateTable(categoryStockHistory, "category-stock-history-table");
    createCSVArea(".generate-csv-button-area", categoryStockHistory, "category-stock-history-table");

    document.getElementById("add-category-dialog").close();
    document.getElementById("add-category-form").reset();
}

document.querySelector("#add-category-button").addEventListener("click", (event) => {
    createNewCategory(event);
});

document.querySelector("#edit-category-submit-button").addEventListener("click", (event) => {
    event.preventDefault();
    let id = document.getElementById("edit-category-id").value;
    let reorderLevel = document.getElementById("edit-reorder-level").value;
    let category = categories.find(c => c.id == id);
    if(reorderLevel < 0){
        alert("Please enter a valid number");
        return;
    }
    category.reorderLevel = reorderLevel;
    storeData("categories", categories);
    updateCategoriesTable(categories);
    updateCategoryStockView(categories);
    document.getElementById("edit-category-dialog").close();
});

document.querySelector("#update-category-stock-button").addEventListener("click", (event) => {
    event.preventDefault();
    let type = document.getElementById("update-category-type").value;
    let addedStock = parseFloat(document.getElementById("stock-level").value);
    let stockDate = document.getElementById("update-stock-date").value;
    let category = categories.find(c => c.type == type);
    if((addedStock < 0) || (addedStock == "")){
        alert("Please enter a valid number");
        return;
    }
    if(stockDate == ""){
        alert("Please enter a date");
        return;
    }
    if (changeableDatas.supplierStock < addedStock){
        alert("Not enough stock in supplier module");
        return;
    }
    category.quantityStock += addedStock;
    storeData("categories", categories);
    updateCategoriesTable(categories);
    let newCategoryStockHistory = new CategoryStockHistory(generateID(categoryStockHistory), category, addedStock, "STOCK IN", stockDate);
    categoryStockHistory.push(newCategoryStockHistory);
    storeData("categoryStockHistory", categoryStockHistory);
    updateTable(categoryStockHistory, "category-stock-history-table");
    changeableDatas.supplierStock -= addedStock;
    storeData("changeableDatas", changeableDatas);
    updateSupplierStock();
    updateCategoryStockView(categories);
    document.getElementById("update-category-stock-dialog").close();
    document.getElementById("update-category-stock-form").reset();
});

document.querySelector("#delete-category-submit-button").addEventListener("click", (event) => {
    event.preventDefault();
    let id = document.getElementById("delete-category-id").value;
    let category = categories.find(c => c.id == id);
    let tempProducts = [...products];
    let productsToDelete = tempProducts.filter(p => p.category.id == id);
    if(productsToDelete.length > 0){
        alert("Cannot delete category with products in it");
        return;
    }else if(category.quantityStock > 0){
        alert("Cannot delete category with stock in it");
        return;
    }else{
        let newCategories = categories.filter(c => c.id != id);
        storeData("categories", newCategories);
        let newCategoryStockHistory = categoryStockHistory.filter(c => c.category.id != id);
        storeData("categoryStockHistory", newCategoryStockHistory);
        updateCategoriesTable(newCategories);
        updateCategoryStockView(newCategories);
        updateTable(newCategoryStockHistory, "category-stock-history-table");
        document.getElementById("delete-category-dialog").close();
    }
});

document.querySelector("#search-category-stock").addEventListener("change", function(){
    let searchValue = document.getElementById("search-category-stock").value;
    let filteredCategories = categories;
    if (searchValue === "low"){
        filteredCategories = categories.filter(c => c.quantityStock < c.reorderLevel);
    }else if (searchValue === "high"){
        filteredCategories = categories.filter(c => c.quantityStock >= c.reorderLevel);
    }
    updateCategoryStockView(filteredCategories);
});


document.querySelector("#search-category").addEventListener("keyup", function(){
    let tempCategories = [...categories];
    let searchValue = document.getElementById("search-category").value.toLowerCase();
    let filteredCategories = tempCategories.filter(category => category.type.toLowerCase().includes(searchValue));
    updateCategoriesTable(filteredCategories);
});

document.querySelector("#select-period").addEventListener("change", function(){
    let period = document.getElementById("select-period").value;
    let startDate = document.getElementById("start-date").value;
    if(period != "select" && startDate != ""){
        let endDate = calculateDatePeriod(startDate, period);
        document.querySelector("#end-date").value = endDate.toISOString().split("T")[0];
    }else if(period == "select"){
        document.querySelector("#end-date").value = "";
    }
});


document.querySelector("#submit-filter-button").addEventListener("click", function(event){
    event.preventDefault();
    let type = document.getElementById("stock-history-category-type").value;
    let category = categories.find(c => c.type == type);
    let startDate = document.getElementById("start-date").value;
    let period = document.getElementById("select-period").value;
    let endDate = calculateDatePeriod(startDate, period);
    let filteredCategoryStockHistory;
    if (category != null && startDate == ""){
        filteredCategoryStockHistory = categoryStockHistory.filter(c => c.category.id == category.id);
    }else if (category != null && startDate != ""){
        filteredCategoryStockHistory = categoryStockHistory.filter(c => c.category.id == category.id && new Date(c.stockDate) >= new Date(startDate) && new Date(c.stockDate) <= new Date(endDate));
    }else if (category == null && startDate != ""){
        filteredCategoryStockHistory = categoryStockHistory.filter(c => new Date(c.stockDate) >= new Date(startDate) && new Date(c.stockDate) <= new Date(endDate));
    }else{
        alert("Please select a category or a start date");
        filteredCategoryStockHistory = categoryStockHistory;
    }
    updateTable(filteredCategoryStockHistory, "category-stock-history-table");
    document.getElementById("filter-history-dialog").close();
    document.getElementById("filter-history-form").reset();
    createCSVArea(".generate-csv-button-area", filteredCategoryStockHistory, "category-stock-history-table");
});

document.querySelector("#clear-filter-button").addEventListener("click", function(event){
    event.preventDefault();
    updateTable(categoryStockHistory, "category-stock-history-table");
    createCSVArea(".generate-csv-button-area", categoryStockHistory, "category-stock-history-table");
});