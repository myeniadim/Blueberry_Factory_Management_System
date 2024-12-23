class ProductStockHistory{
    constructor(productStockHistoryId, product, category, stockAmount, stockType, stockDate){
        this.id = productStockHistoryId;
        this.product = product;
        this.category = category;
        this.stockAmount = stockAmount;
        this.stockType = stockType;
        this.stockDate = stockDate;
    }

    toTableRow(){
        return `
            <tr>
                <td>${this.id}</td>
                <td>${this.product.id}</td>
                <td>${this.product.name}</td>
                <td>${this.category.id}</td>
                <td>${this.category.type}</td>
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
        return `${this.id},${this.product.id},${this.product.name},${this.category.id},${this.category.type},${this.stockAmount} Packages,${this.stockType},${this.stockDate}\n`;
    }
}

export default ProductStockHistory;