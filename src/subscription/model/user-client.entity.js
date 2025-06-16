import { User } from "./user.entity.js";

export class UserClient extends User {
    constructor(id, display, username, email, password, icon, phrase, order = [], subscription) {
        super(id, display, username, email, password);

        //own attributes
        this.icon = icon;
        this.phrase = phrase;
        this.order = order;
        this.subscription = subscription;
    }
}