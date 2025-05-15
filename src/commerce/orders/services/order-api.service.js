import axios from 'axios';
import { OrderAssembler } from './order.assembler.js';

export class OrderApiService {
    getOrders() {
        return axios.get('https://livria-6efh.onrender.com/order')
            .then(response => OrderAssembler.toEntitiesFromResponse(response))
            .catch(error => {
                console.error('Error fetching orders:', error);
                throw error;
            });
    }

    createOrder(rawResource) {
        const adapted = OrderAssembler.toResource(rawResource);
        return axios.post('https://livria-6efh.onrender.com/order', adapted)
            .catch(error => {
                console.error('Error creating order:', error);
                throw error;
            });
    }
}
