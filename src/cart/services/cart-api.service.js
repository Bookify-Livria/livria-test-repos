import axios from 'axios';
import { CartAssembler} from "./cart.assembler.js";

export class CartApiService {
    getCart() {
        return axios.get('http://localhost:3001/cart')
            .then(response => CartAssembler.toEntitiesFromResponse(response))
            .catch(error => {
                console.error('Error fetching cart:', error);
                throw error;
            });
    }

    addToCart(cartItem) {
        return axios.post('http://localhost:3001/cart', CartAssembler.toResource(cartItem))
            .catch(error => {
                console.error('Error adding to cart:', error);
                throw error;
            });
    }

    removeFromCart(bookId) {
        return axios.delete(`http://localhost:3001/cart/${bookId}`)
    }

    clearCart() {
        return axios.delete('http://localhost:3001/cart')
            .catch(error => {
                console.error('Error clearing cart:', error);
                throw error;
            });
    }
}