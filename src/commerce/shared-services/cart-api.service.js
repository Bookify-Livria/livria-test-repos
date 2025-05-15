import axios from 'axios';
import { CartAssembler} from "../cart/services/cart.assembler.js";

export class CartApiService {
    getCart() {
        return axios.get('https://livria.onrender.com/cart')
            .then(response => CartAssembler.toEntitiesFromResponse(response))
            .catch(error => {
                console.error('Error fetching cart:', error);
                throw error;
            });
    }

    addToCart(cartItem) {
        return axios.post('https://livria.onrender.com/cart', CartAssembler.toResource(cartItem))
            .catch(error => {
                console.error('Error adding to cart:', error);
                throw error;
            });
    }

    removeFromCart(Id) {
        return axios.delete(`https://livria.onrender.com/cart/${Id}`)
            .then(response => {
                console.log('User deleted successfully:', response.data);
            })
            .catch(error => {
                console.error('Error deleting user:', error);
                throw error;
            });
    }

    clearCart() {
        return axios.get('https://livria.onrender.com/cart')
            .then(response => {
                const items = response.data;
                return Promise.all(items.map(item =>
                    axios.delete(`https://livria.onrender.com/cart/${item.id}`)
                ));
            })
            .catch(error => {
                console.error('Error clearing cart:', error);
                throw error;
            });
    }
}