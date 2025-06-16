import { UserClient } from '../model/user-client.entity.js';

export class UserClientAssembler {
    static toEntityFromResource(resource) {
        return new UserClient(
            resource.id,
            resource.display,
            resource.user,
            resource.email,
            resource.password,
            resource.icon,
            resource.phrase,
            (resource.order || []).map(o => ({
                id: o.id,
                code: o.code,
                orderstatus: o.orderstatus
            })),
            resource.subscription
        );
    }

    static toEntitiesFromResponse(response) {
        return response.data.map(this.toEntityFromResource);
    }

    static toResource(user) {
        return {
            id: user.id,
            display: user.display,
            user: user.username,
            email: user.email,
            password: user.password,
            icon: user.icon,
            phrase: user.phrase,
            order: (user.order || []).map(o => ({
                id: o.id,
                code: o.code,
                orderstatus: o.orderstatus
            })),
            subscription: user.subscription,
            role: 'client'
        };
    }
}