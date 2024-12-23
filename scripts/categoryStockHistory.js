class CategoryStockHistory{
    constructor(stockID, category, weight, stockType, stockDate){
        this.id = stockID;
        this.category = category;
        this.weight = weight;
        this.stockType = stockType;
        this.stockDate = stockDate;
    }


    toTableRow(){
        return `
            <tr>
                <td>${this.id}</td>
                <td>${this.category.id}</td>
                <td>${this.category.type}</td>
                <td>${this.weight}kg</td>
                <td>${this.stockType}</td>
                <td>${this.stockDate}</td>
            </tr>
            `;
    }

    toCSVHeader(){
        return "Stock ID,Category ID,Category Type,Change Weight,Stock Type,Stock Date\n";
    }

    toCSVRow(){
        return `${this.id},${this.category.id},${this.category.type},${this.weight}kg,${this.stockType},${this.stockDate}\n`;
    }

}

export default CategoryStockHistory;