import {openDialog, addRowToTable, updateTableRowStyles, updateTable, generateItemID, generateID, calculateDatePeriod} from "./script.js";
import {storeData, changeableDatas, categories, categoryStockHistory} from "./data.js";
import Category from "./category.js";
import CategoryStockHistory from "./categoryStockHistory.js";

function addUpdateCategoryStockButtonListeners(){
    document.querySelectorAll(".update-stock-category-button").forEach(button => {
        button.addEventListener("click", function(){
            let category = categories.find(c => c.itemID == button.id);
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
            let category = categories.find(c => c.itemID == button.id);
            document.getElementById("edit-category-id").value = category.itemID;
            document.getElementById("edit-category-type").value = category.type;
            document.getElementById("edit-reorder-level").value = category.reorderLevel;
            openDialog("edit-category-dialog");
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


function updateCategoryStockView(){
    const cardView = document.querySelector(".card-view-area");
    cardView.innerHTML = "";
    categories.forEach(category => {
        cardView.innerHTML += category.toCardView();
    });
    addUpdateCategoryStockButtonListeners();
}

function updateCategoriesTable(categoriesList){
    updateTable(categoriesList, "categories-table");
    addEditCategoryButtonListeners();
}

updateCategoryStockView();

updateTable(categories, "categories-table");
updateTable(categoryStockHistory, "category-stock-history-table");
addEditCategoryButtonListeners();


function isSameCategory(category){
    return categories.some(c => 
        c.type.toLowerCase() == category.type.toLowerCase()
    );
}


function createNewCategory(event){
    event.preventDefault();
    let itemID = generateItemID(categories);
    console.log(itemID);
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
    let newCategory = new Category(itemID, type, quantityStock, reorderLevel, stockDate);
    if(isSameCategory(newCategory)){
        alert("Category already exists");
        return;
    }

    categories.push(newCategory);
    storeData("categories", categories);
    addRowToTable(newCategory, "categories-table");
    let newCategoryStockHistory = new CategoryStockHistory(generateID(categoryStockHistory), newCategory, quantityStock, "Category Created", stockDate);
    categoryStockHistory.push(newCategoryStockHistory);
    addRowToTable(newCategoryStockHistory, "category-stock-history-table");
    storeData("categoryStockHistory", categoryStockHistory);
    updateTableRowStyles("categories-table");
    updateCategoryStockView();
    document.getElementById("add-category-dialog").close();
    document.getElementById("add-category-form").reset();
}

document.querySelector("#add-category-button").addEventListener("click", (event) => {
    createNewCategory(event);
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
    let newCategoryStockHistory = new CategoryStockHistory(generateID(categoryStockHistory), category, addedStock, "Stock IN", stockDate);
    categoryStockHistory.push(newCategoryStockHistory);
    storeData("categoryStockHistory", categoryStockHistory);
    updateTable(categoryStockHistory, "category-stock-history-table");
    changeableDatas.supplierStock -= addedStock;
    storeData("changeableDatas", changeableDatas);
    updateSupplierStock();
    updateCategoryStockView();
    document.getElementById("update-category-stock-dialog").close();
    document.getElementById("update-category-stock-form").reset();
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

    if(type != "" && category == null){
        alert("Category does not exist. Please enter a valid type or do not enter category type");
        return;
    }
    if(category == null && startDate == ""){
        alert("Please select a category or enter a start date");
        return;
    }else if(category == null && (startDate != "" && period == "select")){
        alert("Please select a period");
        return;
    }else if(category != null && startDate == ""){
        alert("Please enter a start date");
        return;
    }else if(category != null && (startDate != "" && period == "select")){
        alert("Please select a period");
        return;
    }else if(category == null && (startDate != "" && period != "select")){
        let endDate = calculateDatePeriod(startDate, period);
        let filteredCategoryStockHistory = categoryStockHistory.filter(c => new Date(c.stockDate) >= new Date(startDate) && new Date(c.stockDate) <= new Date(endDate));
        document.querySelector("#end-date").value = endDate.toISOString().split("T")[0];
        updateTable(filteredCategoryStockHistory, "category-stock-history-table");
        document.querySelector("#filter-history-dialog").close();
        document.querySelector("#filter-history-form").reset();
    }else if(category != null && (startDate != "" && period != "select")){
        let endDate = calculateDatePeriod(startDate, period);
        let filteredCategoryStockHistory = categoryStockHistory.filter(c => c.Category.itemID == category.itemID && new Date(c.stockDate) >= new Date(startDate) && new Date(c.stockDate) <= new Date(endDate));
        document.querySelector("#end-date").value = endDate.toISOString().split("T")[0];
        updateTable(filteredCategoryStockHistory, "category-stock-history-table");
        document.querySelector("#filter-history-dialog").close();
        document.querySelector("#filter-history-form").reset();
    }
});

document.querySelector("#clear-filter-button").addEventListener("click", function(event){
    event.preventDefault();
    document.querySelector("#stock-history-category-type").value = "";
    document.querySelector("#start-date").value = "";
    document.querySelector("#end-date").value = "";
    document.querySelector("#select-period").value = "select";
    updateTable(categoryStockHistory, "category-stock-history-table");
});