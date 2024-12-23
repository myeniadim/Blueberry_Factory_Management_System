import Farmer from "./farmer.js";
import Purchase from "./purchase.js";
import Category from "./category.js";
import CategoryStockHistory from "./categoryStockHistory.js";
import Product from "./product.js";
import ProductStockHistory from "./productStockHistory.js";
import Customer from "./customer.js";
import Order from "./order.js";
import OrderHistory from "./orderHistory.js";

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
    let categoriesList = [];
    try {
        let loadedCategories = retrieveData("categories");
        if(loadedCategories){
            loadedCategories.forEach(category => {
                categoriesList.push(new Category(category.id, category.type, category.quantityStock, category.reorderLevel));
            });
        }
    } catch (error) {
        console.error("Error loading categories from local storage");
    }
    return categoriesList;
}

function getCategoryStockHistoryList(){
    let categoryStockHistoryList = [];
    try {
        let loadedCategoryStockHistory = retrieveData("categoryStockHistory");
        if(loadedCategoryStockHistory){
            loadedCategoryStockHistory.forEach(categoryStock => {
                let category = categories.find(c => c.id == categoryStock.category.id);
                categoryStockHistoryList.push(new CategoryStockHistory(categoryStock.id, category, categoryStock.weight, categoryStock.stockType, categoryStock.stockDate));
            });
        }
    } catch (error) {
        console.error("Error loading category stock history from local storage");
    }
    return categoryStockHistoryList;
}

function getProductList(){
    let productsList = [];
    try {
        let loadedProducts = retrieveData("products");
        if(loadedProducts){
            loadedProducts.forEach(product => {
                let category = categories.find(c => c.id == product.category.id);
                productsList.push(new Product(product.id, category, product.name, product.weight, product.price, product.taxRate, product.stockNum, product.reorderLevel));
            });
        }
    } catch (error) {
        console.error("Error loading products from local storage");
    }
    return productsList;
}

function getProductStockHistoryList(){
    let productStockHistoryList = [];
    try {
        let loadedProductStockHistory = retrieveData("productStockHistory");
        if(loadedProductStockHistory){
            loadedProductStockHistory.forEach(productStock => {
                let product = products.find(p => p.id == productStock.product.id);
                let category = categories.find(c => c.id == productStock.category.id);
                productStockHistoryList.push(new ProductStockHistory(productStock.id, product, category, productStock.stockAmount, productStock.stockType, productStock.stockDate));
            });
        }
    } catch (error) {
        console.error("Error loading product stock history from local storage");
    }
    return productStockHistoryList;
}

function getCustomers(){
    let customersList = [];
    try {
        let loadedCustomers = retrieveData("customers");
        if(loadedCustomers){
            loadedCustomers.forEach(customer => {
                customersList.push(new Customer(customer.id, customer.name, customer.address, customer.phoneNum, customer.email));
            });
        }
    } catch (error) {
        console.error("Error loading customers from local storage");
    }
    return customersList;
}

function getOrders(){
    let ordersList = [];
    try {
        let loadedOrders = retrieveData("orders");
        if(loadedOrders){
            loadedOrders.forEach(order => {
                let customer = customers.find(c => c.id == order.customer.id);
                let product = products.find(p => p.id == order.product.id);
                ordersList.push(new Order(order.id, customer, product, order.productNum, order.productPrice, order.price, order.status, order.date));
            });
        }
    } catch (error) {
        console.error("Error loading orders from local storage");
    }
    return ordersList;
}

function getOrdersHistory(){
    let ordersHistoryList = [];
    try {
        let loadedOrdersHistory = retrieveData("ordersHistory");
        if(loadedOrdersHistory){
            loadedOrdersHistory.forEach(orderHistory => {
                ordersHistoryList.push(new OrderHistory(orderHistory.id, orderHistory.orderId, orderHistory.customerId, orderHistory.customerName, orderHistory.customerAddress, orderHistory.customerPhoneNum, orderHistory.customerEmail, orderHistory.productId, orderHistory.productName, orderHistory.productNum, orderHistory.productPrice, orderHistory.price, orderHistory.status, orderHistory.date));
            });
        }
    } catch (error) {
        console.error("Error loading orders history from local storage");
    }
    return ordersHistoryList;
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
//Sales
const customers = getCustomers();
const orders = getOrders();
const ordersHistory = getOrdersHistory();




export {storeData, retrieveData, getFarmers, farmers, purchases, 
    changeableDatas, categories, categoryStockHistory, products, 
    productStockHistory, customers, orders, ordersHistory};