import { calculateDatePeriod, clearTable, createCSVArea, generateCSVFile } from "./script.js";
import { revenueList, purchases, customers, products } from "./data.js"; 

function updateDashboard(){
    let revenue = calculateRevenue(revenueList);
    let expenses = calculateExpenses(purchases);
    let tax = calculateTax(revenueList);
    let income = calculateIncome(revenue, expenses, tax)

    document.querySelector("#total-revenue").textContent = revenue + "$";
    document.querySelector("#total-expenses").textContent = expenses + "$";
    document.querySelector("#total-taxes").textContent = tax + "$";
    document.querySelector("#net-income").textContent = income + "$";
}

updateDashboard();

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

document.querySelector("#period-select-period").addEventListener("change", function(){
    let startDate = document.querySelector("#period-start-date").value;
    let period = document.querySelector("#period-select-period").value;
    if(startDate != "" && period != "select"){
        let endDate = calculateDatePeriod(startDate, period);
        document.querySelector("#period-end-date").value = endDate.toISOString().split("T")[0];
    }else{
        document.querySelector("#period-end-date").value = "";
    }

});

document.querySelector("#clear-period-submit-button").addEventListener("click", function(){
    document.querySelector("#period-start-date").value = "";
    document.querySelector("#period-select-period").value = "select";
    document.querySelector("#period-end-date").value = "";
    clearPeriodlyDashboard();
});

function updatePeriodlyDashboard(startDate, endDate){
    const newRevenueList = revenueList.filter(r => new Date(r.date) >= new Date(startDate) && new Date(r.date) <= new Date(endDate));
    const newPurchaseList = purchases.filter(p => new Date(p.date) >= new Date(startDate) && new Date(p.date) <= new Date(endDate));

    if(newRevenueList == null && newPurchaseList == null){
        alert("There is no Orders or Purchases in this time period!");
        return;
    }

    const revenue = calculateRevenue(newRevenueList);
    const expenses = calculateExpenses(newPurchaseList);
    const taxes = calculateTax(newRevenueList);
    const income = calculateIncome(revenue, expenses, taxes);

    document.querySelector("#period-revenue").textContent = revenue + "$";
    document.querySelector("#period-expenses").textContent = expenses + "$";
    document.querySelector("#period-tax").textContent = taxes + "$";
    document.querySelector("#period-income").textContent = income + "$";
}

document.querySelector("#calculate-period-submit-button").addEventListener("click", function(){
    let startDate = document.querySelector("#period-start-date").value;
    let endDate = document.querySelector("#period-end-date").value;
    if (startDate && endDate){
        updatePeriodlyDashboard(startDate, endDate);
    }
});

function clearPeriodlyDashboard(){
    document.querySelector("#period-revenue").textContent = 0 + "$";
    document.querySelector("#period-expenses").textContent = 0 + "$";
    document.querySelector("#period-tax").textContent = 0 + "$";
    document.querySelector("#period-income").textContent = 0 + "$";
}

function populateTaxTable(tempRevenueList){
    const table = document.querySelector("#tax-table");
    tempRevenueList.forEach(revenue =>{
        let row = revenue.toTaxTableRow();
        table.innerHTML += row;
    });
}

document.querySelector("#tax-customer-id").addEventListener("keyup", function(event){
    let custId = document.querySelector("#tax-customer-id").value;
    let customer = customers.find(c => c.id == custId);
    if (custId != "" && customer){
        document.querySelector("#tax-customer-name").value = customer.name;
    }else if (custId == ""){
        document.querySelector("#tax-customer-name").value = "";
    }
});

document.querySelector("#tax-product-id").addEventListener("keyup", function(event){
    let productId = document.querySelector("#tax-product-id").value;
    let product = products.find(p => p.id == productId);
    if (productId != "" && product){
        document.querySelector("#tax-product-name").value = product.toString();
    }else if (productId == ""){
        document.querySelector("#tax-product-name").value = "";
    }
});

document.querySelector("#tax-select-period").addEventListener("change", function(event){
    let startDate = document.querySelector("#tax-start-date").value;
    let period = document.querySelector("#tax-select-period").value;
    if(startDate != "" && period != "select"){
        let endDate = calculateDatePeriod(startDate, period);
        document.querySelector("#tax-end-date").value = endDate.toISOString().split("T")[0];
    }else{
        document.querySelector("#tax-end-date").value = "";
    }
});

document.querySelector("#clear-tax-submit-button").addEventListener("click", function(){
    document.querySelector("#tax-customer-id").value = "";
    document.querySelector("#tax-customer-name").value = "";
    document.querySelector("#tax-product-id").value = "";
    document.querySelector("#tax-product-name").value = "";
    document.querySelector("#tax-start-date").value = "";
    document.querySelector("#tax-select-period").value = "select";
    document.querySelector("#tax-end-date").value = "";
    clearTable("tax-table");
    document.querySelector("#tax-total-tax").textContent = 0 + "$";
});

document.querySelector("#filter-tax-submit-button").addEventListener("click", function(event){
    const tempRevenueList = [...revenueList];
    const custId = document.querySelector("#tax-customer-id").value;
    const custName = document.querySelector("#tax-customer-name").value;
    const productId = document.querySelector("#tax-product-id").value;
    const productName = document.querySelector("#tax-product-name").value;
    const startDate = document.querySelector("#tax-start-date").value;
    const endDate = document.querySelector("#tax-end-date").value;

    let filteredRevenueList;

    if (custName != "" && productName == "" && endDate == ""){
        filteredRevenueList = tempRevenueList.filter(order => order.customer.id == custId);
    }else if (custName == "" && productName != "" && endDate == ""){
        filteredRevenueList = tempRevenueList.filter(order => order.product.id == productId);
    }else if(custName == "" && productName == "" && endDate != ""){
        filteredRevenueList = tempRevenueList.filter(order => new Date(order.date) >= new Date(startDate) && new Date(order.date) <= new Date(endDate));
    }else if(custName != "" && productName != "" && endDate == ""){
        filteredRevenueList = tempRevenueList.filter(order => order.customer.id == custId && order.product.id == productId);
    }else if(custName != "" && productName == "" && endDate != ""){
        filteredRevenueList = tempRevenueList.filter(order => order.customer.id == custId && new Date(order.date) >= new Date(startDate) && new Date(order.date) <= new Date(endDate));
    }else if(custName == "" && productName != "" && endDate != ""){
        filteredRevenueList = tempRevenueList.filter(order => order.product.id == productId && new Date(order.date) >= new Date(startDate) && new Date(order.date) <= new Date(endDate));
    }else if(custName != "" && productName != "" && endDate != ""){
        filteredRevenueList = tempRevenueList.filter(order => order.customer.id == custId && order.product.id == productId && new Date(order.date) >= new Date(startDate) && new Date(order.date) <= new Date(endDate));
    }else{
        alert("Please fill out at least one field");
        return;
    }
    clearTable("tax-table");
    populateTaxTable(filteredRevenueList);
    createCSVArea(".fax-csv-button-area", filteredRevenueList, "tax-csv-report.csv");
    document.querySelector("#tax-total-tax").textContent = calculateTax(filteredRevenueList) + "$";

});
