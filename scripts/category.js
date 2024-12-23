class Category{
    constructor(id, type, quantityStock, reorderLevel){
        this.id = id;
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
                <div class="card-view-header">
                    <h3>ITEM ID: ${this.id}</h3>
                    <h3>${this.type.toUpperCase()} BLUEBERRIES</h3>
                </div>
                <div>Stock Level: ${this.quantityStock}kg</div>
                <div>Stock Levels are Low!</div>
                <button class="update-stock-category-button" id="${this.id}">UPDATE STOCK</button>
            </div>
            `;
        }else{
            return `
            <div class="card-view" id="good">
                <div class="card-view-header">
                    <h3>ITEM ID: ${this.id}</h3>
                    <h3>${this.type.toUpperCase()} BLUEBERRIES</h3>
                </div>
                <div>Stock Level: ${this.quantityStock}kg</div>
                <div>Stock Levels are Good!</div>
                <button class="update-stock-category-button" id="${this.id}">UPDATE STOCK</button>
            </div>
            `;
        }
    }

    toCardViewWithOutButtons(){
        if (this.getStockAlert() == "Stock Alert"){
            return `
            <div class="card-view" id="bad">
                <div class="card-view-header">
                    <h3>ITEM ID: ${this.id}</h3>
                    <h3>${this.type.toUpperCase()} BLUEBERRIES</h3>
                </div>
                <div>Stock Level: ${this.quantityStock}kg</div>
                <div>Stock Levels are Low!</div>
            </div>
            `;
        }else{
            return `
            <div class="card-view" id="good">
                <div class="card-view-header">
                    <h3>ITEM ID: ${this.id}</h3>
                    <h3>${this.type.toUpperCase()} BLUEBERRIES</h3>
                </div>
                <div>Stock Level: ${this.quantityStock}kg</div>
                <div>Stock Levels are Good!</div>
            </div>
            `;
        }
    }

    toTableRow(){
        return `
            <tr>
                <td>${this.id}</td>
                <td>${this.type}</td>
                <td>${this.reorderLevel}kg</td>
                <td>
                    <div class="actions">
                        <button class="edit-category-button" id="${this.id}">EDIT CATEGORY</button>
                        <button class="delete-category-button" id="${this.id}">DELETE CATEGORY</button>
                    </div>
                </td>
            </tr>
            `;
    }

}
export default Category;