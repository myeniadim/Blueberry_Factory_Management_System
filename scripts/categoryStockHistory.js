import Category from './category.js';

class CategoryStockHistory{
    constructor(stockID, category, weight, stockType ,stockDate){
        this.id = stockID;
        this.Category = category;
        this.weight = weight;
        this.stockType = stockType;
        this.stockDate = stockDate;
    }

    toTableRow(){
        return `
            <tr>
                <td>${this.id}</td>
                <td>${this.Category.itemID}</td>
                <td>${this.Category.type}</td>
                <td>${this.weight}kg</td>
                <td>${this.stockType}</td>
                <td>${this.stockDate}</td>
            </tr>
            `;
    }
}

export default CategoryStockHistory;