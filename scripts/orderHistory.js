class OrderHistory{
    constructor(id, orderId, customerId, customerName, customerAddress, customerPhoneNum, customerEmail, productId, productName, productNum, productPrice, price, status, date){
        this.id = id;
        this.orderId = orderId;
        this.customerId = customerId;
        this.customerName = customerName;
        this.customerAddress = customerAddress;
        this.customerPhoneNum = customerPhoneNum;
        this.customerEmail = customerEmail;
        this.productId = productId;
        this.productName = productName;
        this.productNum = productNum;
        this.productPrice = productPrice;
        this.price = price;
        this.status = status;
        this.date = date;
    }

    toTableRow(){
        return  `
            <tr>
                <td>${this.id}</td>
                <td>${this.orderId}</td>
                <td>${this.customerId}</td>
                <td>${this.customerName}</td>
                <td>${this.productId}</td>
                <td>${this.productName}</td>
                <td>${this.price}</td>
                <td>${this.status}</td>
                <td>${this.date}</td>
            </tr>
        `;
    }
}

export default OrderHistory;