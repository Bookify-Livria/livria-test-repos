import axios from 'axios';
import { BookAssembler } from './book.assembler.js';

export class BookApiService {
    getBooks() {
        return axios.get('https://livria.onrender.com/books')
            .then(response => BookAssembler.toEntitiesFromResponse(response))
            .catch(error => {
                console.error('Error fetching books:', error);
                throw error;
            });
    }

    updateBook(book) {
        return axios.put(`https://livria.onrender.com/books/${book.id}`, book)
            .catch(error => {
                console.error('Error updating book:', error);
                throw error;
            });
    }

}