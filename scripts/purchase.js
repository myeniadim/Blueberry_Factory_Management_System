import Farmer from './farmer.js';

class Purchase{
    constructor(purchaseId, farmer, date, quantity, priceperkg){
        this.id = purchaseId;
        this.farmer = farmer;
        this.date = date;
        this.quantity = quantity;
        this.priceperkg = priceperkg;
    }

    calculateTotalPrice(){
        return this.quantity * this.priceperkg;
    }

    toTableRow(){
        return `
            <tr>
                <td>${this.id}</td>
                <td>${this.farmer.id}</td>
                <td>${this.farmer.name}</td>
                <td>${this.date}</td>
                <td>${this.quantity}kg</td>
                <td>${this.priceperkg}$</td>
                <td>${this.calculateTotalPrice()}$</td>
            </tr>
        `;
    }
}

export default Purchase;