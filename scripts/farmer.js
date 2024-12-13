class Farmer {
    constructor(id, name, phoneNumber, email, address, city, country){
        this.id = id;
        this.name = name;
        this.phoneNumber = phoneNumber;
        this.email = email;
        this.address = address;
        this.city = city;
        this.country = country;
    }

    getId() {
        return this.id;
    }

    getName() {
        return this.name;
    }

    setName(name) {
        this.name = name;
    }

    getPhoneNumber() {
        return this.phoneNumber;
    }

    setPhoneNumber(phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    getEmail() {
        return this.email;
    }

    setEmail(email) {
        this.email = email;
    }

    getAddress() {
        return this.address;
    }

    setAddress(address) {
        this.address = address;
    }

    getCity() {
        return this.city;
    }

    setCity(city) {
        this.city = city;
    }

    getCountry() {
        return this.country;
    }

    setCountry(country) {
        this.country = country;
    }

    toTableRow(){
        return `
            <tr>
                <td>${this.getId()}</td>
                <td>${this.getName()}</td>
                <td>${this.getPhoneNumber()}</td>
                <td>${this.getEmail()}</td>
                <td>${this.getAddress()}</td>
                <td>${this.getCity()}</td>
                <td>${this.getCountry()}</td>
                <td>
                    <div class="actions">
                        <button class="edit-button">Edit</button>
                        <button class="delete-button">Delete</button>
                    </div>
                </td>
            </tr>
        `;
    }
}

export default Farmer;