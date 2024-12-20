class Product{
    constructor(id, category, name, weight, price, stockNum, reorderLevel){
        this.id = id;
        this.category = category;
        this.name = name;
        this.weight = weight;
        this.price = price;
        this.stockNum = stockNum;
        this.reorderLevel = reorderLevel;
        this.stockAlert;
    }

    getStockAlert(){
        if(this.stockNum < this.reorderLevel){
            this.stockAlert = "LOW STOCK!";
        }else{
            this.stockAlert = "GOOD STOCK!";
        }
        return this.stockAlert;
    }

    getStockAlertID(){
        if(this.stockNum < this.reorderLevel){
            return "bad";
        }else{
            return "good";
        }
    }

    calculateTotalWeight(packageNum){
        return (this.weight * packageNum).toFixed(2);
    }

    toCardView(){
        return `
        <div class="card-view" id="${this.getStockAlertID()}">
            <h3>Product ID: ${this.id}</h3>
            <h3>${this.name}(${this.weight}kg) ${this.category} BLUEBERRIES</h3>
            <div>Stock Level: ${this.stockNum} Packages</div>
            <div>Stock Levels are ${this.getStockAlert()}</div>
            <button class="update-stock-product-button" id="${this.id}">UPDATE STOCK</button>
        </div>
        `;
    }

    toTableRow(){
        return `
        <tr>
            <td>${this.id}</td>
            <td>${this.category.type}</td>
            <td>${this.name}</td>
            <td>${this.weight}kg</td>
            <td>${this.price}$</td>
            <td>${this.stockNum}kg</td>
            <td>${this.reorderLevel} Packages</td>
            <td>
                <button class="edit-product-button" id="${this.id}">EDIT</button>
                <button class="delete-product-button" id="${this.id}">DELETE</button>
            </td>
        </tr>
        `;
    }

}

export default Product;