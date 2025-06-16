import { UserAdmin } from '../model/user-admin.entity.js';

export class UserAdminAssembler {
    static toEntityFromResource(resource) {
        return new UserAdmin(
            resource.id,
            resource.display,
            resource.username,
            resource.email,
            resource.password,
            resource.adminAccess,
            resource.securityPin
        );
    }

    static toResource(user) {
        return {
            id: user.id,
            display: user.display,
            username: user.username,
            email: user.email,
            password: user.password,
            adminAccess: user.adminAccess,
            securityPin: user.securityPin
        };
    }
}