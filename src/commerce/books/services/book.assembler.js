import { Book } from '../model/book.entity.js';
import { Review } from '../model/review.entity.js';

export class BookAssembler {
    static toEntityFromResource(resource) {

        const reviews = Array.isArray(resource.reviews)
            ? resource.reviews.map(review => new Review(review.id, review.username, review.content))
            : [];

        return new Book(
            resource.id,
            resource.title,
            resource.description,
            resource.author,
            resource.price,
            resource.stock,
            resource.cover,
            resource.genre,
            resource.language,
            reviews
        );
    }

    static toEntitiesFromResponse(response) {
        return response.data.map(this.toEntityFromResource);
    }

}
