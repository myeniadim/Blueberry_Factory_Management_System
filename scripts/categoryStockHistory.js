import { categories } from "./data.js";

class CategoryStockHistory{
    constructor(stockID, categoryId, categoryType, weight, stockType, stockDate){
        this.id = stockID;
        this.categoryId = categoryId;
        this.categoryType = categoryType; 
        this.weight = weight;
        this.stockType = stockType;
        this.stockDate = stockDate;
        this.category = categories.find(c => c.itemID == categoryId);
    }

    updateCategoryInfo(){
        if (this.category != null){
            this.categoryId = this.category.itemID;
            this.categoryType = this.category.type;
        }
    }


    toTableRow(){
        return `
            <tr>
                <td>${this.id}</td>
                <td>${this.categoryId}</td>
                <td>${this.categoryType}</td>
                <td>${this.weight}kg</td>
                <td>${this.stockType}</td>
                <td>${this.stockDate}</td>
            </tr>
            `;
    }

    toCSVHeader(){
        return "Stock ID,Category ID,Category Type,Weight,Stock Type,Stock Date";
    }

    toCSVRow(){
        return `${this.id},${this.categoryId},${this.categoryType},${this.weight},${this.stockType},${this.stockDate}\n`;
    }

}

export default CategoryStockHistory;