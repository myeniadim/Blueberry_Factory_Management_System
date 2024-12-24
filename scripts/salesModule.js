import {openDialog, addRowToTable, updateTableRowStyles, updateTable, generateItemID, generateID, calculateDatePeriod, createCSVArea, clearTable} from './script.js';
import {storeData, retrieveData, getFarmers, farmers, purchases, 
    changeableDatas, categories, categoryStockHistory, products, 
    productStockHistory, customers, orders, ordersHistory} from './data.js';
import Customer from './customer.js';
import Order from './order.js';
import OrderHistory from './orderHistory.js';
import ProductStockHistory from './productStockHistory.js';


function updateEverything(){
    updateCustomerTable(customers);
    //add other tables
    updateOrderTable(orders);
    updateOrdersHistoryTable(ordersHistory, ".generate-csv-button-area", "order-history-table");
    let tempOrders = [...orders];
    tempOrders = tempOrders.filter(order => order.status == "Delivered");
    let firstOrder = tempOrders[0];
    let lastOrder = tempOrders[tempOrders.length - 1];
    if (firstOrder && lastOrder){
        let totalRevenue = calculateRevenue(tempOrders);
        updateCardView(["ALL ORDERS", firstOrder.date, lastOrder.date, "ALL CUSTOMERS", "ALL PRODUCTS", totalRevenue]);
        let csvFileName = `${firstOrder.date}_to_${lastOrder.date}_allCustomers_allProducts_totalRevenue:${totalRevenue}.csv`;
        updateRevenueTable(tempOrders, csvFileName);
    }
}

updateEverything();

function addEditCustomerButtonListeners(){
    document.querySelectorAll(".edit-customer-button").forEach(button => {
        button.addEventListener("click", function(event){
            event.preventDefault();
            let customer = customers.find(cust => cust.id == event.target.id);
            document.querySelector("#edit-customer-id").value = customer.id;
            document.querySelector("#edit-customer-name").value = customer.name;
            document.querySelector("#edit-customer-address").value = customer.address;
            document.querySelector("#edit-customer-phone").value = customer.phoneNum;
            document.querySelector("#edit-customer-email").value = customer.email;
            openDialog("edit-customer-dialog");
        });
    });
}

function addDeleteCustomerButtonListeners(){
    document.querySelectorAll(".delete-customer-button").forEach(button =>{
        button.addEventListener("click", function(event){
            event.preventDefault();
            let customer = customers.find(cust => cust.id == event.target.id);
            let order = orders.find(ord => ord.customer.id == customer.id);
            if (order != null){
                alert("Customer has orders, cannot delete");
                return;
            }
            let index = customers.indexOf(customer);
            customers.splice(index, 1);
            storeData("customers", customers);
            updateCustomerTable(customers);
        });
    });
}

function updateCustomerTable(customerList){
    updateTable(customerList, "customers-table");
    //add Event Listeners
    addEditCustomerButtonListeners();
    addDeleteCustomerButtonListeners();
}

function addRowtoCustomerTable(customer){
    addRowToTable(customer, "customers-table");
    updateTableRowStyles("customers-table");
    //add Event Listeners
    addEditCustomerButtonListeners();
    addDeleteCustomerButtonListeners();
}

function updateOrdersHistoryTable(orderHistoryList, divClass, tabledID){
    updateTable(orderHistoryList, tabledID);
    createCSVArea(divClass, orderHistoryList, "order-history.csv");
}


function updateRevenueTable(orderList, fileName){
    const table = document.querySelector("#revenue-table");
    clearTable("revenue-table");
    orderList.forEach(order => {
        let row = order.toRevenueTableRow();
        table.innerHTML += row;
    });
    updateTableRowStyles("revenue-table");
    createCSVArea(".generate-revenue-csv-button-area", orderList, fileName);
}

function updateCardView(valueList){
    let cardArea = document.querySelector(".card-view");
    cardArea.innerHTML = "";
    cardArea.innerHTML += `
            <h2>${valueList[0]}</h3>
            <h3>START DATE: ${valueList[1]}</h3>
            <h3>END DATE: ${valueList[2]}</h3>
            <h3>SELECTED CUSTOMER: ${valueList[3]}</h3>
            <h3>SELECTED PRODUCT: ${valueList[4]}</h3>
            <div>TOTAL REVENUE: ${valueList[5]}$</div>
        `;
}

function calculateRevenue(tempOrders){
    let totalRevenue = tempOrders.reduce((acc, order) => acc + parseFloat(order.price), 0);
    return totalRevenue;
}

document.querySelector(".add-customer-button").addEventListener("click", function(event){
    event.preventDefault();
    let custName = document.querySelector("#customer-name").value;
    let custAddress = document.querySelector("#customer-address").value;
    let custPhoneNum = document.querySelector("#customer-phone").value;
    let custEmail = document.querySelector("#customer-email").value;
    if (custName != "" && custAddress != "" && (custPhoneNum != "" && custPhoneNum.length == 11) && custEmail != ""){
        let customer = customers.find(cust => cust.name == custName && cust.address == custAddress && cust.phoneNum == custPhoneNum && cust.email == custEmail);
        if (customer == null){
            let newCustomer = new Customer(generateID(customers), custName, custAddress, custPhoneNum, custEmail);
            customers.push(newCustomer);
            storeData("customers", customers);
            addRowtoCustomerTable(newCustomer);
            document.getElementById("add-customer-dialog").close();
        }else{
            alert("Customer already exists");
        }
    }else{
        alert("Please fill out all fields");
    }
});

document.querySelector(".edit-customer-submit-button").addEventListener("click", function(event){
    event.preventDefault();
    let custID = document.querySelector("#edit-customer-id").value;
    let custName = document.querySelector("#edit-customer-name").value;
    let custAddress = document.querySelector("#edit-customer-address").value;
    let custPhoneNum = document.querySelector("#edit-customer-phone").value;
    let custEmail = document.querySelector("#edit-customer-email").value;
    if (custName != "" && custAddress != "" && (custPhoneNum != "" && custPhoneNum.length == 11) && custEmail != ""){
        let customerList = customers.filter(cust => cust.name == custName && cust.address == custAddress && cust.phoneNum == custPhoneNum && cust.email == custEmail);
        if (customerList.length == 0){
            let customer = customers.find(cust => cust.id == custID);
            customer.name = custName;
            customer.address = custAddress;
            customer.phoneNum = custPhoneNum;
            customer.email = custEmail;
            storeData("customers", customers);
            updateCustomerTable(customers);
            document.getElementById("edit-customer-dialog").close();
        }else{
            alert("Customer already exists");
        }
    }else{
        alert("Please fill out all fields");
    }
});

document.querySelector("#search-customer").addEventListener("keyup", function(event){
    let tempCustomers = [...customers];
    let searchValue = document.querySelector("#search-customer").value.toLowerCase();
    let searchResults = tempCustomers.filter(cust => cust.name.toLowerCase().includes(searchValue.toLowerCase()));
    updateCustomerTable(searchResults);
});

//ORDERS
function addUpdateStatusButtonListeners(){
    document.querySelectorAll(".edit-order-button").forEach(button => {
        button.addEventListener("click", function(event){
            event.preventDefault();
            let order = orders.find(ord => ord.id == event.target.id);
            document.querySelector("#update-status-id").value = order.id;
            document.querySelector("#update-status").value = order.status;
            openDialog("update-status-dialog");
        });
    });
}

function addViewOrderDetailButtonListeners(){
    document.querySelectorAll(".view-order-details").forEach(button => {
        button.addEventListener("click", function(event){
            event.preventDefault();
            let order = orders.find(ord => ord.id == event.target.id);
            document.getElementById("view-sale-id").value = order.id;
            document.getElementById("view-customer-id").value = order.customer.id;
            document.getElementById("view-product-id").value = order.product.id;
            document.getElementById("view-customer-name").value = order.customer.name;
            document.getElementById("view-product-name").value = order.product.toString();
            document.getElementById("view-total-price").value = order.price;
            document.getElementById("view-date").value = order.date;
            openDialog("view-sale-detail-dialog");
        });
    });
}

function addViewOrderHistoryButtonListeners(){
    document.querySelectorAll(".view-order-history-details").forEach(button => {
        button.addEventListener("click", function(event){
            event.preventDefault();
            let order = orders.find(ord => ord.id == event.target.id);
            let orderHistory = ordersHistory.filter(ordHist => ordHist.orderId == order.id);
            updateOrdersHistoryTable(orderHistory, ".order-history-table-detail-csv", "order-history-table-detail");
            openDialog("view-history-dialog");
        });
    });
}

function updateOrderTable(orderList){
    updateTable(orderList, "sales-table");
    //add Event Listeners
    addUpdateStatusButtonListeners();
    addViewOrderHistoryButtonListeners();
    addViewOrderDetailButtonListeners();
}

function addRowtoOrderTable(order){
    addRowToTable(order, "sales-table");
    updateTableRowStyles("sales-table");
    //add Event Listeners
    addUpdateStatusButtonListeners();
    addViewOrderHistoryButtonListeners();
    addViewOrderDetailButtonListeners();
}

document.querySelector("#sale-customer-id").addEventListener("keyup", function(event){
    event.preventDefault();
    let customerID = document.querySelector("#sale-customer-id").value;
    let customer = customers.find(cust => cust.id == customerID);
    if (customer){
        document.querySelector("#sale-customer-name").value = customer.name;
    }else{
        document.querySelector("#sale-customer-name").value = "";
    }
});

document.querySelector("#sale-product-id").addEventListener("keyup", function(event){
    event.preventDefault();
    let productID = document.querySelector("#sale-product-id").value;
    let product = products.find(prod => prod.id == productID);
    if (product){
        document.querySelector("#sale-product-name").value = product.toString();
    }else{
        document.querySelector("#sale-product-name").value = "";
    }
});

document.querySelector("#filter-customer-id").addEventListener("keyup", function(event){
    event.preventDefault();
    let customerID = document.querySelector("#filter-customer-id").value;
    let customer = customers.find(cust => cust.id == customerID);
    if (customer){
        document.querySelector("#filter-customer-name").value = customer.name;
    }else{
        document.querySelector("#filter-customer-name").value = "";
    }
});

document.querySelector("#filter-product-id").addEventListener("keyup", function(event){
    event.preventDefault();
    let productID = document.querySelector("#filter-product-id").value;
    let product = products.find(prod => prod.id == productID);
    if (product){
        document.querySelector("#filter-product-name").value = product.toString();
    }else{
        document.querySelector("#filter-product-name").value = "";
    }
});

document.querySelector("#sale-product-number").addEventListener("keyup", function(event){
    event.preventDefault();
    let productID = document.querySelector("#sale-product-id").value;
    let product = products.find(prod => prod.id == productID);
    console.log(product);
    let productNum = document.querySelector("#sale-product-number").value;
    if (product && productNum){
        document.querySelector("#sale-total-price").value = product.price * productNum;
    }else{
        document.querySelector("#sale-total-price").value = "";
    }
});

document.querySelector(".add-sale-submit-button").addEventListener("click", function(event){
    event.preventDefault();
    let customerID = document.querySelector("#sale-customer-id").value;
    let productID = document.querySelector("#sale-product-id").value;
    let productNum = document.querySelector("#sale-product-number").value;
    let totalPrice = document.querySelector("#sale-total-price").value;
    let status = "Pending";
    let date = document.querySelector("#sale-date").value;
    if (customerID != "" && productID != "" && productNum != "" && totalPrice != "" && status != "" && date != ""){
        let customer = customers.find(cust => cust.id == customerID);
        let product = products.find(prod => prod.id == productID);
        if (product.stockNum < productNum){
            alert("Not enough stock");
            return;
        }

        let order = new Order(generateID(orders), customer, product, productNum, product.price, totalPrice, product.taxRate, status, date);
        orders.push(order);
        storeData("orders", orders);
        addRowtoOrderTable(order);

        product.stockNum -= productNum;
        storeData("products", products);

        let newProductStockHistory = new ProductStockHistory(generateID(productStockHistory), product, product.category, parseInt(order.productNum), "STOCK OUT (SOLD)", date);
        productStockHistory.push(newProductStockHistory);
        storeData("productStockHistory", productStockHistory);

        let newOrderHistory = order.createHistory(generateID(ordersHistory), status, date);
        ordersHistory.push(newOrderHistory);
        storeData("ordersHistory", ordersHistory);
        updateTable(ordersHistory, "order-history-table");
        document.getElementById("add-sale-dialog").close();
    }else{
        alert("Please fill out all fields");
    }
});

document.querySelector(".update-status-submit-button").addEventListener("click", function(event){
    event.preventDefault();
    let orderID = document.querySelector("#update-status-id").value;
    let status = document.querySelector("#update-status").value;
    let date = document.querySelector("#update-status-date").value;
    if (status != "" && date != ""){
        let order = orders.find(ord => ord.id == orderID);
        let newOrderHistoryTry = ordersHistory.find(ordHist => ordHist.orderId == orderID && ordHist.status == status);
        if (newOrderHistoryTry != null){
            alert("Order already has this status");
            return;
        }
        newOrderHistoryTry = ordersHistory.find(ordHist => ordHist.orderId == orderID && ordHist.status == "Cancelled");
        if (newOrderHistoryTry != null){
            alert("Order cancelled");
            return;
        }
        if(status == "Cancelled" && order.status != "Delivered"){
            let product = products.find(prod => prod.id == order.product.id);
            product.stockNum = parseInt(product.stockNum) + parseInt(order.productNum);
            storeData("products", products);

            let newProductStockHistory = new ProductStockHistory(generateID(productStockHistory), product, product.category, parseInt(order.productNum), "STOCK IN (SALE CANCELLED)", date);
            productStockHistory.push(newProductStockHistory);
            storeData("productStockHistory", productStockHistory);

        }else if(order.status == "Delivered"){
            alert("Order delivered, you cannot change!");
            return;
        }
        order.status = status;
        order.date = date;
        storeData("orders", orders);
        updateOrderTable(orders);
        let newOrderHistory = order.createHistory(generateID(ordersHistory), status, date);
        ordersHistory.push(newOrderHistory);
        storeData("ordersHistory", ordersHistory);
        updateTable(ordersHistory, "order-history-table");
        document.getElementById("update-status-dialog").close();
    }else{
        alert("Please fill out all fields");
    }
});

document.querySelector("#select-period").addEventListener("change", function(event){
    let option = document.querySelector("#select-period").value;
    let startDate = document.querySelector("#filter-start-date").value;
    if (startDate != "" && option != "select"){
        document.querySelector("#filter-end-date").value = new Date(calculateDatePeriod(startDate, option)).toISOString().split("T")[0];
    }
});

document.querySelector(".filter-order-history-submit-button").addEventListener("click", function(event){
    event.preventDefault();
    let tempOrders = [...orders];
    let orderList = tempOrders.filter(order => order.status == "Delivered");
    let customerId = document.querySelector("#filter-customer-id").value;
    let customerName = document.querySelector("#filter-customer-name").value;
    let productId = document.querySelector("#filter-product-id").value;
    let productName = document.querySelector("#filter-product-name").value;
    let startDate = document.querySelector("#filter-start-date").value;
    let endDate = document.querySelector("#filter-end-date").value;

    let filteredOrderList;

    if (customerName != "" && productName == "" && endDate == ""){
        filteredOrderList = orderList.filter(order => order.customer.id == customerId);
    }else if (customerName == "" && productName != "" && endDate == ""){
        filteredOrderList = orderList.filter(order => order.product.id == productId);
    }else if(customerName == "" && productName == "" && endDate != ""){
        filteredOrderList = orderList.filter(order => new Date(order.date) >= new Date(startDate) && new Date(order.date) <= new Date(endDate));
    }else if(customerName != "" && productName != "" && endDate == ""){
        filteredOrderList = orderList.filter(order => order.customer.id == customerId && order.product.id == productId);
    }else if(customerName != "" && productName == "" && endDate != ""){
        filteredOrderList = orderList.filter(order => order.customer.id == customerId && new Date(order.date) >= new Date(startDate) && new Date(order.date) <= new Date(endDate));
    }else if(customerName == "" && productName != "" && endDate != ""){
        filteredOrderList = orderList.filter(order => order.product.id == productId && new Date(order.date) >= new Date(startDate) && new Date(order.date) <= new Date(endDate));
    }else if(customerName != "" && productName != "" && endDate != ""){
        filteredOrderList = orderList.filter(order => order.customer.id == customerId && order.product.id == productId && new Date(order.date) >= new Date(startDate) && new Date(order.date) <= new Date(endDate));
    }else{
        alert("Please fill out at least one field");
        return;
    }
    updateRevenueTable(filteredOrderList, "filtered_revenue.csv");
    updateCardView(["FILTERED ORDERS", startDate, endDate, customerName, productName, calculateRevenue(filteredOrderList)]);
    document.getElementById("filter-order-history-dialog").close();
});

document.querySelector("#clear-filter-order-history-button").addEventListener("click", function(event){
    let filteredOrderList = orders.filter(order => order.status == "Delivered");
    updateRevenueTable(filteredOrderList, "order-history.csv");
    if (filteredOrderList.length > 0){
        updateCardView(["ALL ORDERS", filteredOrderList[0].date, filteredOrderList[orders.length - 1].date, "ALL CUSTOMERS", "ALL PRODUCTS", calculateRevenue(filteredOrderList)]);
    }
});

document.querySelector("#search-sales").addEventListener("keyup", function(event) {
    const searchValue = document.querySelector("#search-sales").value.toLowerCase();
    if (!searchValue) {
        updateOrderTable(orders);
        return;
    }
    
    const filteredOrders = orders.filter(order => 
        order.customer.name.toLowerCase().includes(searchValue) ||
        order.product.toString().toLowerCase().includes(searchValue) ||
        order.status.toLowerCase().includes(searchValue) ||
        order.date.toLowerCase().includes(searchValue)
    );

    updateOrderTable(filteredOrders);
});

document.querySelector("#search-order-history").addEventListener("keyup", function(event) {
    const searchValue = document.querySelector("#search-order-history").value.toLowerCase();
    if (!searchValue) {
        updateOrdersHistoryTable(ordersHistory, ".generate-csv-button-area", "order-history-table");
        return;
    }

    const filteredOrders = ordersHistory.filter(order =>
        order.customerName.toLowerCase().includes(searchValue) ||
        order.productName.toLowerCase().includes(searchValue) ||
        order.status.toLowerCase().includes(searchValue)
    );

    updateOrdersHistoryTable(filteredOrders, ".generate-csv-button-area", "order-history-table");
});
