
export class Order {
    constructor(id, code, items, email, phone, fullName, isDelivery, shipping = null, total, date) {
        this.id = id;
        this.code = code;
        this.items = items; // CartItem[]
        this.email = email;
        this.phone = phone;
        this.fullName = fullName;
        this.isDelivery = isDelivery;
        this.shipping = shipping;
        this.total = total;
        this.date = date;
    }
}