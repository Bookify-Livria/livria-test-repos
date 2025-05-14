export class User {
    constructor(id, display, username, email, icon, password, phrase, order  = [], subscription) {
        this.id = id;
        this.display = display;
        this.username = username;
        this.email = email;
        this.icon = icon;
        this.password = password;
        this.phrase = phrase;
        this.order = order;
        this.subscription = subscription;
    }
}