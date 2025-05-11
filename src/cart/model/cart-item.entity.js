import {Book} from "../../books/model/book.entity.js";

export class CartItem {
    constructor(book, quantity = 1) {
        this.book = book;
        this.quantity = quantity;
    }
}

