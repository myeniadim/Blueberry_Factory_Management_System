import OrderHistory from './orderHistory.js';

class Order{
    constructor(id, customer, product, productNum, productPrice, price, taxRate, status, date){
        this.id = id;
        this.customer = customer;
        this.product = product;
        this.productNum = productNum;
        this.productPrice = productPrice;
        this.price = price;
        this.taxRate = taxRate;
        this.status = status;
        this.date = date;
        this.tax = this.price * this.taxRate;
    }

    createHistory(id, status, date){
        let orderHistory = new OrderHistory(id, this.id, this.customer.id, this.customer.name, 
            this.customer.address, this.customer.phoneNum, this.customer.email,
            this.product.id, this.product.toString(), this.productNum, this.productPrice, this.price, status, date);
        return orderHistory;
    }


    toTableRow(){
        return  `
            <tr>
                <td>${this.id}</td>
                <td>${this.customer.name}</td>
                <td>${this.product.toString()}</td>
                <td>${this.productNum}</td>
                <td>${this.product.price}$</td>
                <td>${this.price}$</td>
                <td>${this.status}</td>
                <td>${this.date}</td>
                <td>
                    <div class="actions">
                        <button class="view-order-details" id="${this.id}">VIEW DETAIL</button>
                        <button class="view-order-history-details" id="${this.id}">VIEW HISTORY</button>
                        <button class="edit-order-button" id="${this.id}">UPDATE STATUS</button>
                    </div>
                </td>
            </tr>
        `;
    }

    toRevenueTableRow(){
        return  `
            <tr>
                <td>${this.id}</td>
                <td>${this.customer.name}</td>
                <td>${this.product.toString()}</td>
                <td>${this.productNum}</td>
                <td>${this.product.price}$</td>
                <td>${this.price}$</td>
                <td>${this.date}</td>
            </tr>
        `;
    }

    toTaxTableRow(){
        return  `
            <tr>
                <td>${this.id}</td>
                <td>${this.customer.name}</td>
                <td>${this.product.toString()}</td>
                <td>${this.price}$</td>
                <td>${this.taxRate}$</td>
                <td>${this.tax.toFixed(2)}$</td>
                <td>${this.date}</td>
            </tr>
        `;
    }

    toCSVHeaderTax(){
        return "Order ID,Customer Name,Product Name,Total Price,Tax Rate,Tax,Date\n";
    }

    toCSVRowTax(){
        return `${this.id},${this.customer.name},${this.product.toString()},${this.price},${this.taxRate},${this.tax.toFixed(2)},${this.date}\n`
    }

    toCSVRow(){
        return  `${this.id},${this.customer.name},${this.product.toString()},${this.productNum},${this.product.price},${this.price},${this.date}\n`;
    }

    toCSVHeader(){
        return "Order ID,Customer Name,Product Name,Product Quantity,Product Price,Total Price,Date\n";
    }


}

export default Order;