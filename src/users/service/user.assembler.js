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
        );
    }

    static toEntitiesFromResponse(response) {
        return response.data.map(this.toEntityFromResource);
    }
}
