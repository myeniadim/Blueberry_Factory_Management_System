class Category{
    constructor(itemID, type, quantityStock, reorderLevel, stockDate){
        this.itemID = itemID;
        this.type = type;
        this.quantityStock = quantityStock;
        this.reorderLevel = reorderLevel;
        this.stockAlert;
    }

    getStockAlert(){
        if(this.quantityStock < this.reorderLevel){
            this.stockAlert = "Stock Alert";
        }else{
            this.stockAlert = "Stock OK";
        }
        return this.stockAlert;
    }

    toCardView(){
        if (this.getStockAlert() == "Stock Alert"){
            return `
            <div class="card-view" id="bad">
                <h3>${this.type} BLUEBERRIES (ITEM ID:${this.itemID})</h3>
                <div>Stock Level: ${this.quantityStock}kg</div>
                <div>Stock Levels are Low!</div>
                <button class="update-stock-category-button" id="${this.itemID}">UPDATE STOCK</button>
            </div>
            `;
        }else{
            return `
            <div class="card-view" id="good">
                <h3>${this.type} BLUEBERRIES (ITEM ID:${this.itemID})</h3>
                <div>Stock Level: ${this.quantityStock}kg</div>
                <div>Stock Levels are Good!</div>
                <button class="update-stock-category-button" id="${this.itemID}">UPDATE STOCK</button>
            </div>
            `;
        }
    }

    toCardViewWithOutButtons(){
        if (this.getStockAlert() == "Stock Alert"){
            return `
            <div class="card-view" id="bad">
                <h3>${this.type} BLUEBERRIES (ITEM ID:${this.itemID})</h3>
                <div>Stock Level: ${this.quantityStock}kg</div>
                <div>Stock Levels are Low!</div>
            </div>
            `;
        }else{
            return `
            <div class="card-view" id="good">
                <h3>${this.type} BLUEBERRIES (ITEM ID:${this.itemID})</h3>
                <div>Stock Level: ${this.quantityStock}kg</div>
                <div>Stock Levels are Good!</div>
            </div>
            `;
        }
    }

    toTableRow(){
        return `
            <tr>
                <td>${this.itemID}</td>
                <td>${this.type}</td>
                <td>${this.reorderLevel}kg</td>
                <td>
                    <div class="actions">
                        <button class="edit-category-button" id="${this.itemID}">EDIT CATEGORY</button>
                    </div>
                </td>
            </tr>
            `;
    }

}
export default Category;