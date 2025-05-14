import { Post } from './post.entity.js'

export class Community {
    constructor(id, name, description, type, image, banner, posts = []) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.type = type;
        this.image = image;
        this.banner = banner;
        this.posts = posts;
    }
}