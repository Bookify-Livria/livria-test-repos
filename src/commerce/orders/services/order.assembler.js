import { Order } from '../model/order.entity.js';
import { CartAssembler } from '../../cart/services/cart.assembler.js';
import { Shipping } from '../model/shipping.entity.js';

export class OrderAssembler {
    static toEntityFromResource(resource) {
        const items = resource.items.map(CartAssembler.toEntityFromResource);
        const shipping = resource.shipping
            ? new Shipping(
                resource.shipping.address,
                resource.shipping.district,
                resource.shipping.reference
            )
            : null;

        return new Order(
            resource.id,
            resource.code,
            items,
            resource.email,
            resource.phone,
            resource.fullName,
            resource.delivery,
            shipping,
            resource.total,
            resource.date
        );
    }

    static toEntitiesFromResponse(response) {
        return response.data.map(this.toEntityFromResource);
    }

    static toResource(order) {
        return {
            id: order.id,
            code: order.code,
            items: order.items.map(CartAssembler.toResource),
            email: order.email,
            phone: order.phone,
            fullName: order.fullName,
            delivery: order.delivery,
            total: order.total,
            date: order.date,
            shipping: order.delivery
                ? {
                    address: order.shipping.address,
                    district: order.shipping.district,
                    reference: order.shipping.reference
                }
                : null
        };
    }


}
