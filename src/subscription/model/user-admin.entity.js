import { User } from "./user.entity.js";

export class UserAdmin extends User
{
    constructor(id, display, username, email, password, adminAccess, securityPin) {
        super(id, display, username, email, password);

        //own attributes
        this.adminAccess = adminAccess;
        this.securityPin = securityPin;
    }
}