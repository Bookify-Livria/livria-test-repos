import { Community } from '../model/community.entity.js';

export class CommunityAssembler {
    static toEntityFromResource(resource) {
        return new Community(
            resource.id,
            resource.name,
            resource.description,
            resource.type,
            resource.image,
        );
    }

    static toEntitiesFromResponse(response) {
        return response.data.map(this.toEntityFromResource);
    }
}
