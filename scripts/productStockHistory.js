class ProductStockHistory{
    constructor(productStockHistoryId, productId, productName, categoryId, categoryType, stockAmount, stockType, stockDate){
        this.id = productStockHistoryId;
        this.productId = productId;
        this.productName = productName;
        this.categoryId = categoryId;
        this.categoryType = categoryType;
        this.stockAmount = stockAmount;
        this.stockType = stockType;
        this.stockDate = stockDate;
    }

    toTableRow(){
        return `
            <tr>
                <td>${this.id}</td>
                <td>${this.productId}</td>
                <td>${this.productName}</td>
                <td>${this.categoryId}</td>
                <td>${this.categoryType}</td>
                <td>${this.stockAmount} Packages</td>
                <td>${this.stockType}</td>
                <td>${this.stockDate}</td>
            </tr>
            `;
    }

    toCSVHeader(){
        return "ID,Product ID,Product Name,Category ID,Category Type,Stock Amount,Stock Type,Stock Date\n";
    }

    toCSVRow(){
        return `${this.id},${this.productId},${this.productName},${this.categoryId},${this.categoryType},${this.stockAmount} Packages,${this.stockType},${this.stockDate}\n`;
    }
}

export default ProductStockHistory;