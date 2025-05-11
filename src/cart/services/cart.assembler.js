import { CartItem } from '../model/cart-item.entity.js';
import { BookAssembler } from '../../books/services/book.assembler.js';

export class CartAssembler {
    static toEntityFromResource(resource) {
        const book = BookAssembler.toEntityFromResource(resource.book);
        return new CartItem(resource.id, book, resource.quantity);
    }

    static toEntitiesFromResponse(response) {
        return response.data.map(this.toEntityFromResource);
    }

    static toResource(cartItem) {
        return {
            id: cartItem.id,
            book: {
                id: cartItem.book.id,
                title: cartItem.book.title,
                description: cartItem.book.description,
                author: cartItem.book.author,
                price: cartItem.book.price,
                cover: cartItem.book.cover,
                genre: cartItem.book.genre,
                language: cartItem.book.language
            },
            quantity: cartItem.quantity
        };
    }
}
