import { calculateDatePeriod, generateCSVFile } from "./script.js";
import { changeableDatas, purchases, categoryStockHistory, categories, products, productStockHistory, revenueList} from "./data.js"; 

document.querySelector("#navbar-period-dashbord-button").addEventListener("click", function(){
    document.querySelector(".report-filter-period-area-container").style.display = "none";
    isFiltered = false;
    updateContent();
});

document.querySelector("#navbar-period-report-button").addEventListener("click", function(){
    document.querySelector(".report-filter-period-area-container").style.display = "block";
});


document.querySelector("#report-select-period").addEventListener("change", function(){
    let startDate = document.querySelector("#report-start-date").value;
    let period = document.querySelector("#report-select-period").value;
    if (startDate != "" && period != "select"){
        document.querySelector("#report-end-date").value = calculateDatePeriod(startDate, period).toISOString().split("T")[0];;
    }else{
        document.querySelector("#report-end-date").value = "";
    }
});

let isFiltered = false;

let filteredOrderList;
let filteredCategoryStockHistory;
let filteredProductStockHistory;

document.querySelector("#generate-report-submit-button").addEventListener("click", function(event){
    event.preventDefault();
    let startDate = document.querySelector("#report-start-date").value;
    let endDate = document.querySelector("#report-end-date").value;
    if (endDate != ""){
        const deneme = "slm";
    }
});



function updateSupplierStock(){
    let stockView = document.querySelector(".supplier-stock-level-area>.card-view-solo-area>.card-view");
    stockView.innerHTML = `
    <h3>UNCATEGORIZED BLUEBERRIES</h3>
    <div>Stock Level</div>
    <div>${changeableDatas.supplierStock}kg</div>
    `;
}

function calculateSupplierStockInAndStockOut(startDate, endDate){
    let filteredPurchases = purchases.filter(purchase => new Date(purchase.date) >= new Date(startDate) && new Date(purchase.date) <= new Date(endDate));
    let filteredCategoryStockHistory = categoryStockHistory.filter(stock => new Date(stock.stockDate) >= new Date(startDate) && new Date(stock.stockDate) <= new Date(endDate));
    let lastFilteredCategoryStockHistory = filteredCategoryStockHistory.filter(stock => stock.stockType.toLowerCase().includes("stock in"));

    let stockIn = 0;
    let stockOut = 0;
    filteredPurchases.forEach(purchase => {
        stockIn += purchase.quantity;
    });

    console.log(lastFilteredCategoryStockHistory)
    lastFilteredCategoryStockHistory.forEach(stock => {
        stockOut += stock.weight;
    });

    return [stockIn, stockOut];
}

function updateFilteredSupplierStock(startDate, endDate){
    let stockLevels = calculateSupplierStockInAndStockOut(startDate, endDate);
    let stockView = document.querySelector(".supplier-stock-level-area>.card-view-solo-area>.card-view");
    stockView.innerHTML = `
    <h3>UNCATEGORIZED BLUEBERRIES</h3>
    <div>Stock In: ${stockLevels[0]}kg</div>
    <div>Stock Out: ${stockLevels[1]}kg</div>
    <div>Total: ${stockLevels[0] - stockLevels[1]}kg</div>
    `;
}

function addPurchaseHistoryCSVButtonListeners(startDate, endDate){
    document.querySelector("#purchase-history-csv").addEventListener("click", function(){
        if (!isFiltered){
            generateCSVFile(purchases, "purchase-history.csv");
        }else{
            let filteredPurchaseList = purchases.filter(purchase => new Date(purchase.date) >= new Date(startDate) && new Date(purchase.date) <= new Date(endDate));
            if (filteredPurchaseList.length == 0){
                alert("There is no data to export.");
                return;
            }
            let fileName = `purchase-history-${startDate}-${endDate}.csv`;
            generateCSVFile(filteredPurchaseList, fileName);
        }
    });
}

function updateCategoryStock(){
    let stockView = document.querySelector("#category-stock-level-area .card-view-area");
    stockView.innerHTML = "";
    categories.forEach(category => {
        stockView.innerHTML += category.toCardViewWithOutButtons();
    });
}

function calculateCategoryStockInAndStockOut(category, startDate, endDate){
    let filteredCategoryStockHistory = categoryStockHistory.filter(stock => stock.category == category && new Date(stock.stockDate) >= new Date(startDate) && new Date(stock.stockDate) <= new Date(endDate));
    let stockInFilteredCategoryStockHistory = filteredCategoryStockHistory.filter(stock => stock.stockType.toLowerCase().includes("stock in"));
    let stockOutFilteredCategoryStockHistory = filteredCategoryStockHistory.filter(stock => stock.stockType.toLowerCase().includes("stock out"));

    let stockIn = 0;
    let stockOut = 0;
    stockInFilteredCategoryStockHistory.forEach(stock => {
        stockIn += stock.weight;
    });

    stockOutFilteredCategoryStockHistory.forEach(stock => {
        stockOut += stock.weight;
    });

    return [stockIn, stockOut];
}

function updateFilteredCategoryStock(startDate, endDate){
    let stockView = document.querySelector("#category-stock-level-area .card-view-area");
    stockView.innerHTML = "";
    categories.forEach(category => {
        let stock = calculateCategoryStockInAndStockOut(category, startDate, endDate);
        stockView.innerHTML += `
            <div class="card-view" id="good">
                <div class="card-view-header">
                    <h3>ITEM ID: ${category.id}</h3>
                    <h3>${category.type.toUpperCase()} BLUEBERRIES</h3>
                </div>
                <div>Stock IN: ${stock[0]}kg</div>
                <div>Stock Out: ${stock[1]}kg</div>
                <div>Total: ${stock[0] - stock[1]}kg</div>
            </div>
            `;
    });
}

function addCategoryStockHistoryCSVButtonListeners(startDate, endDate){
    document.querySelector("#category-stock-history-csv").addEventListener("click", function(){
        if (!isFiltered){
            generateCSVFile(categoryStockHistory, "category-stock-history.csv");
        }else{
            let filteredCategoryStockHistory = categoryStockHistory.filter(stock => new Date(stock.stockDate) >= new Date(startDate) && new Date(stock.stockDate) <= new Date(endDate));
            if (filteredCategoryStockHistory.length == 0){
                alert("There is no data to export.");
                return;
            }
            fileName = `category-stock-history-${startDate}-${endDate}.csv`;
            generateCSVFile(filteredCategoryStockHistory, fileName);
        }
    });
}

function updateProductStock(){
    let stockView = document.querySelector("#product-stock-level-area");
    stockView.innerHTML = "";
    products.forEach(product => {
        stockView.innerHTML += product.toCardViewWithOutButtons();
    });
}

function calculateProductStockInAndStockOut(product, startDate, endDate){
    let filteredProductStockHistory = productStockHistory.filter(stock => stock.product == product && new Date(stock.stockDate) >= new Date(startDate) && new Date(stock.stockDate) <= new Date(endDate));
    let stockInFilteredProductStockHistory = filteredProductStockHistory.filter(stock => stock.stockType.toLowerCase().includes("stock in"));
    let stockOutFilteredProductStockHistory = filteredProductStockHistory.filter(stock => stock.stockType.toLowerCase().includes("stock out"));

    let stockIn = 0;
    let stockOut = 0;
    stockInFilteredProductStockHistory.forEach(stock => {
        stockIn += +stock.stockAmount;
    });

    stockOutFilteredProductStockHistory.forEach(stock => {
        stockOut += +stock.stockAmount;
    });

    return [stockIn, stockOut];
}

function updateFilteredProductStock(startDate, endDate){
    let stockView = document.querySelector("#product-stock-level-area");
    stockView.innerHTML = "";
    products.forEach(product => {
        let stock = calculateProductStockInAndStockOut(product, startDate, endDate);
        stockView.innerHTML += `
            <div class="card-view" id="${product.getStockAlertID()}">
                <div class="card-view-header">
                    <h3>Product ID: ${product.id}</h3>
                    <h3>${product.category.type.toUpperCase()} BLUEBERRIES</h3>
                    <h3>${product.name.toUpperCase()} PACKAGE (${product.weight}kg)</h3>
                </div>
                <div>Stock IN: ${stock[0]} Packages</div>
                <div>Stock Out: ${stock[1]} Packages</div>
                <div>Total: ${stock[0] - stock[1]} Packages</div>
            </div>
            `;
    });
}

function addProductStockHistoryCSVButtonListeners(startDate, endDate){
    document.querySelector("#product-stock-history-csv").addEventListener("click", function(){
        if (!isFiltered){
            generateCSVFile(productStockHistory, "product-stock-history.csv");
        }else{
            let filteredProductStockHistory = productStockHistory.filter(stock => new Date(stock.stockDate) >= new Date(startDate) && new Date(stock.stockDate) <= new Date(endDate));
            if (filteredProductStockHistory.length == 0){
                alert("There is no data to export.");
                return;
            }
            fileName = `product-stock-history-${startDate}-${endDate}.csv`;
            generateCSVFile(filteredProductStockHistory, fileName);
        }
    });
}

function calculateRevenue(orderList){
    let total = 0;
    for(let order of orderList){
        total += +order.price;
    }
    return total;
}

function calculateExpenses(purchaseList){
    let total = parseFloat(0);
    for (let purchase of purchaseList){
        total += purchase.price;
    }
    return total;
}

function calculateTax(orderList){
    let total = 0;
    for(let order of orderList){
        total += +order.tax;
    }
    return total;
}

function calculateIncome(revenue, expenses, taxes){
    return revenue - (expenses + taxes);
}

function updateRevenue(tempRevenueList){
    document.querySelector("#total-revenue").innerHTML = calculateRevenue(tempRevenueList).toFixed(2) + " $";
}

function updateExpenses(tempPurchaseList){
    document.querySelector("#total-expenses").innerHTML = calculateExpenses(tempPurchaseList).toFixed(2) + " $";
}

function updateTax(tempRevenueList){
    document.querySelector("#total-taxes").innerHTML = calculateTax(tempRevenueList).toFixed(2) + " $";
}

function updateIncome(tempRevenueList, tempPurchaseList){
    let revenue = calculateRevenue(tempRevenueList);
    let expenses = calculateExpenses(tempPurchaseList);
    let taxes = calculateTax(tempRevenueList);
    document.querySelector("#net-income").innerHTML = calculateIncome(revenue, expenses, taxes).toFixed(2) + " $";
}

function addOrderHistoryCSVButtonListeners(startDate, endDate){
    document.querySelector("#order-history-csv").addEventListener("click", function(){
        if (!isFiltered){
            generateCSVFile(revenueList, "order-history.csv");
        }else{
            let filteredRevenueList = revenueList.filter(order => new Date(order.date) >= new Date(startDate) && new Date(order.date) <= new Date(endDate));
            if (filteredRevenueList.length == 0){
                alert("There is no data to export.");
                return;
            }
            fileName = `order-history-${startDate}-${endDate}.csv`;
            generateCSVFile(filteredRevenueList, fileName);
        }
    });
}

function addPurchaseHistory2CSVButtonListeners(startDate,endDate){
    document.querySelector("#purchase-history-2-csv").addEventListener("click", function(){
        if (!isFiltered){
            generateCSVFile(purchases, "purchase-history.csv");
        }else{
            let filteredPurchaseList = purchases.filter(purchase => new Date(purchase.date) >= new Date(startDate) && new Date(purchase.date) <= new Date(endDate));
            if (filteredPurchaseList.length == 0){
                alert("There is no data to export.");
                return;
            }
            let fileName = `purchase-history-${startDate}-${endDate}.csv`;
            generateCSVFile(filteredPurchaseList, fileName);
        }
    });
}

function addTaxHistoryCSVButtonListeners(startDate, endDate){
    document.querySelector("#tax-history-csv").addEventListener("click", function(){
        if (!isFiltered){
            generateCSVFile(revenueList, "tax-history.csv");
        }else{
            let filteredRevenueList = revenueList.filter(order => new Date(order.date) >= new Date(startDate) && new Date(order.date) <= new Date(endDate));
            if (filteredRevenueList.length == 0){
                alert("There is no data to export.");
                return;
            }
            let fileName = `tax-history-${startDate}-${endDate}.csv`;
            generateCSVFile(filteredRevenueList, fileName);
        }
    });
}

function updateContent(startDate, endDate){
    if (!isFiltered){
        updateSupplierStock();
        addPurchaseHistoryCSVButtonListeners();
        updateCategoryStock();
        addCategoryStockHistoryCSVButtonListeners();
        updateProductStock();
        addProductStockHistoryCSVButtonListeners();
        updateRevenue(revenueList);
        updateExpenses(purchases);
        updateTax(revenueList);
        updateIncome(revenueList, purchases);
        addOrderHistoryCSVButtonListeners();
        addPurchaseHistory2CSVButtonListeners();
        addTaxHistoryCSVButtonListeners();
    }else{
        updateFilteredSupplierStock(startDate, endDate);
        addPurchaseHistoryCSVButtonListeners(startDate, endDate);
        updateFilteredCategoryStock(startDate, endDate);
        addCategoryStockHistoryCSVButtonListeners(startDate, endDate);
        updateFilteredProductStock(startDate, endDate);
        let newRevenueList = revenueList.filter(order => new Date(order.date) >= new Date(startDate) && new Date(order.date) <= new Date(endDate));
        let newPurchaseList = purchases.filter(purchase => new Date(purchase.date) >= new Date(startDate) && new Date(purchase.date) <= new Date(endDate));
        updateRevenue(newRevenueList);
        updateExpenses(newPurchaseList);
        updateTax(newRevenueList);
        updateIncome(newRevenueList, newPurchaseList);
        addOrderHistoryCSVButtonListeners(startDate, endDate);
        addPurchaseHistory2CSVButtonListeners(startDate, endDate);
    }
}

document.querySelector("#generate-report-submit-button").addEventListener("click", function(event){
    event.preventDefault();
    let startDate = document.querySelector("#report-start-date").value;
    let endDate = document.querySelector("#report-end-date").value;
    if (startDate != "" && endDate != ""){
        isFiltered = true;
        updateContent(startDate, endDate);
    }
});

document.querySelector("#clear-report-submit-button").addEventListener("click", function(){
    document.querySelector("#report-start-date").value = "";
    document.querySelector("#report-end-date").value = "";
    isFiltered = false;
    updateContent();
});


updateContent();