import { User } from '../model/user.entity.js';

export class UserAssembler {
    static toEntityFromResource(resource) {
        return new User(
            resource.id,
            resource.nickname,
            resource.username,
            resource.email,
            resource.phrase,
            resource.avatarUrl,
            resource.planType,
            resource.createdAt ? new Date(resource.createdAt) : null,
            resource.isActive,
            resource.clients || []
        );
    }

    static toEntitiesFromResponse(response) {
        // El backend devuelve { success: true, data: [...] }
        const users = response.data.data || response.data;
        if (Array.isArray(users)) {
            return users.map(this.toEntityFromResource);
        }
        return [this.toEntityFromResource(users)];
    }

    static toEntityFromSingleResponse(response) {
        // Para respuestas de un solo usuario
        const userData = response.data.data || response.data;
        return this.toEntityFromResource(userData);
    }

    static toResource(user) {
        return {
            nickname: user.nickname,
            username: user.username,
            email: user.email,
            phrase: user.phrase,
            avatarUrl: user.avatarUrl,
            planType: user.planType
        };
    }

    static toUpdateResource(user) {
        return {
            nickname: user.nickname,
            username: user.username,
            email: user.email,
            phrase: user.phrase,
            avatarUrl: user.avatarUrl,
            planType: user.planType
        };
    }

    static toRegisterResource(userData) {
        return {
            nickname: userData.nickname,
            username: userData.username,
            email: userData.email,
            password: userData.password,
            phrase: userData.phrase || null,
            avatarUrl: userData.avatarUrl || null,
            planType: userData.planType || 'basic'
        };
    }
}