import { Community } from '../model/community.entity.js';

export class CommunityAssembler {
    // Convert API response to entity model
    static toEntitiesFromResponse(response) {
        if (!response || !response.data) {
            return [];
        }

        return response.data.map(item => this.toEntity(item));
    }

    // Convert a single API item to entity model
    static toEntity(item) {
        if (!item) {
            return null;
        }

        return {
            id: item.id,
            name: item.name,
            description: item.description,
            type: item.type,
            image: item.image
        };
    }

    // Convert entity model to API model (for creating/updating)
    static toApiModel(entity) {
        if (!entity) {
            return null;
        }

        return {
            name: entity.name,
            description: entity.description,
            type: entity.type,
            image: entity.image
        };
    }
}