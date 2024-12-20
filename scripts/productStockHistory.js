class ProductStockHistory{
    constructor(productStockHistoryId, product, stockAmount, stockType, stockDate){
        this.id = productStockHistoryId;
        this.product = product;
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
                <td>${this.product.category.id}</td>
                <td>${this.product.category.type}</td>
                <td>${this.stockAmount} Packages</td>
                <td>${this.stockType}</td>
                <td>${this.stockDate}</td>
            </tr>
            `;
    }
}