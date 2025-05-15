import axios from 'axios';
import { OrderAssembler } from './order.assembler.js';

export class OrderApiService {
    getOrders() {
        return axios.get('https://livria.onrender.com/order')
            .then(response => OrderAssembler.toEntitiesFromResponse(response))
            .catch(error => {
                console.error('Error fetching orders:', error);
                throw error;
            });
    }

    createOrder(rawResource) {
        const adapted = OrderAssembler.toResource(rawResource);
        return axios.post('https://livria.onrender.com/order', adapted)
            .catch(error => {
                console.error('Error creating order:', error);
                throw error;
            });
    }
}
