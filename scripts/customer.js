class Customer{
    constructor(id, name, address, phoneNum, email){
        this.id = id;
        this.name = name;
        this.address = address;
        this.phoneNum = phoneNum;
        this.email = email;
    }

    toTableRow(){
        return  `
            <tr>
                <td>${this.id}</td>
                <td>${this.name}</td>
                <td>${this.address}</td>
                <td>${this.phoneNum}</td>
                <td>${this.email}</td>
                <td>
                    <div class="actions">
                        <button class="edit-customer-button" id="${this.id}">EDIT</button>
                        <button class="delete-customer-button" id="${this.id}">DELETE</button>
                    </div>
                </td>
            </tr>
        `;
    }
}

export default Customer;