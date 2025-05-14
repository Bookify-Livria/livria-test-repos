import { User } from '../model/user.entity.js';

export class UserAssembler {
    static toEntityFromResource(resource) {
        return new User(
            resource.id,
            resource.display,
            resource.user,
            resource.email,
            resource.icon,
            resource.password,
            resource.phrase,
            resource.order,
            resource.orderstatus,
            resource.subscription
        );
    }

    static toEntitiesFromResponse(response) {
        return response.data.map(this.toEntityFromResource);
    }

    static toResource(User){
        return {
            id: User.id,
            display: User.display,
            user: User.user,
            email: User.email,
            icon: User.icon,
            password: User.password,
            phrase: User.phrase,
            order: User.order,
            orderstatus: User.orderstatus,
            subscription: User.subscription
        };
    }
}
