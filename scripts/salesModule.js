import {openDialog, addRowToTable, updateTableRowStyles, updateTable, generateItemID, generateID, calculateDatePeriod, createCSVArea} from './script.js';
import {storeData, retrieveData, getFarmers, farmers, purchases, 
    changeableDatas, categories, categoryStockHistory, products, 
    productStockHistory, customers, orders, ordersHistory} from './data.js';
import Customer from './customer.js';
import Order from './order.js';
import OrderHistory from './orderHistory.js';


function updateEverything(){
    updateCustomerTable(customers);
    //add other tables
    updateOrderTable(orders);
    updateTable(ordersHistory, "order-history-table");
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

function updateCustomerTable(customerList){
    updateTable(customerList, "customers-table");
    //add Event Listeners
    addEditCustomerButtonListeners();
}

function addRowtoCustomerTable(customer){
    addRowToTable(customer, "customers-table");
    updateTableRowStyles("customers-table");
    //add Event Listeners
    addEditCustomerButtonListeners();
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
            updateTable(orderHistory, "order-history-table-detail");
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
        let order = new Order(generateID(orders), customer, product, productNum, product.price, totalPrice, status, date);
        orders.push(order);
        storeData("orders", orders);
        addRowtoOrderTable(order);
        product.stockNum -= productNum;
        storeData("products", products);
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
        }else if(order.status == "Delivered"){
            alert("Order delivered, you cannot change!");
            return;
        }
        order.status = status;
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