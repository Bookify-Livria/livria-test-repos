import { Book } from '../model/book.entity.js';

export class BookAssembler {
    static toEntityFromResource(resource) {
        return new Book(
            resource.id,
            resource.title,
            resource.description,
            resource.author,
            resource.price,
            resource.cover
        );
    }

    static toEntitiesFromResponse(response) {
        return response.data.map(this.toEntityFromResource);
    }
}
