export class User {
    constructor(
        id = 0,
        nickname = '',
        username = '',
        email = '',
        phrase = '',
        avatarUrl = '',
        planType = 'basic',
        createdAt = null,
        isActive = true,
        clients = []
    ) {
        this.id = id;
        this.nickname = nickname;
        this.username = username;
        this.email = email;
        this.phrase = phrase;
        this.avatarUrl = avatarUrl;
        this.planType = planType;
        this.createdAt = createdAt;
        this.isActive = isActive;
        this.clients = clients || [];
    }

    // Métodos helper
    get displayName() {
        return this.nickname || this.username;
    }

    get isPremium() {
        return this.planType === 'premium';
    }

    get isBasic() {
        return this.planType === 'basic';
    }
}