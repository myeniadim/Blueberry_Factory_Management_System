class Category{
    constructor(itemID, type, quantityStock, reorderLevel, stockDate){
        this.itemID = itemID;
        this.type = type;
        this.quantityStock = quantityStock;
        this.reorderLevel = reorderLevel;
        this.stockDate = stockDate;
        this.stockAlert;
        this.CategoryStockHistory = [];
    }

    getStockAlert(){
        if(this.quantityStock < this.reorderLevel){
            this.stockAlert = "Stock Alert";
        }else{
            this.stockAlert = "Stock OK";
        }
        return this.stockAlert;
    }

    toTableRow(){
        return `
            <tr>
                <td>${this.itemID}</td>
                <td>${this.type}</td>
                <td>${this.quantityStock}</td>
                <td>${this.reorderLevel}</td>
                <td>${this.getStockAlert()}</td>
                <td>${this.stockDate}</td>
                <td>
                    <div class="actions">
                        <button class="update-stock-category-button" id="${this.itemID}">UPDATE CATEGORY</button>
                        <button class="edit-category-button" id="${this.itemID}">EDIT CATEGORY</button>
                    </div>
                </td>
            </tr>
            `;
    }

}
export default Category;