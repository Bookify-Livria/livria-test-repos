import { Post } from '../model/post.entity.js';
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

        const posts = Array.isArray(item.posts)
            ? item.posts.map(post => new Post(post.id, post.username, post.content, post.img))
            : [];

        return new Community(
            item.id,
            item.name,
            item.description,
            item.type,
            item.image,
            item.banner,
            posts
        );
    }

}