import { Review } from "./review.entity.js";

export class Book {
    constructor(id, title, description, author, price, cover, genre, language, reviews = []) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.author = author;
        this.price = price;
        this.cover = cover;
        this.genre = genre;
        this.language = language;
        this.reviews = reviews;
    }
}