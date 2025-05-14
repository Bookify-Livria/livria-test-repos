import axios from 'axios';
import { BookAssembler } from './book.assembler.js';

export class BookApiService {
    getBooks() {
        return axios.get('http://localhost:3000/books')
            .then(response => BookAssembler.toEntitiesFromResponse(response))
            .catch(error => {
                console.error('Error fetching books:', error);
                throw error;
            });
    }

    updateBook(book) {
        return axios.put(`http://localhost:3000/books/${book.id}`, book)
            .catch(error => {
                console.error('Error updating book:', error);
                throw error;
            });
    }

}