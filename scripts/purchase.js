import Farmer from './farmer.js';

class Purchase{
    constructor(purchaseId, farmer, date, quantity, priceperkg){
        this.id = purchaseId;
        this.farmer = farmer;
        this.date = date;
        this.quantity = parseFloat(quantity);
        this.priceperkg = parseFloat(priceperkg);
        this.price = this.quantity * this.priceperkg;
    }

    calculateTotalPrice(){
        return (this.quantity * this.priceperkg).toFixed(2);
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
                <td>${this.price.toFixed(2)}$</td>
            </tr>
        `;
    }

    toCSVHeader(){
        return "Purchase ID,Farmer ID,Farmer Name,Purchase Date,Quantity,Price Per KG,Total Price\n";
    }

    toCSVRow(){
        return `${this.id},${this.farmer.id},${this.farmer.name},${this.date},${this.quantity}kg,${this.priceperkg}$,${this.price.toFixed(2)}$\n`;
    }
}

export default Purchase;