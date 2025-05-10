import axios from 'axios';
import { BookAssembler } from './book.assembler.js';

export class BookApiService {
    getBooks() {
        return axios.get('http://localhost:3001/books')
            .then(response => BookAssembler.toEntitiesFromResponse(response))
            .catch(error => {
                console.error('Error fetching books:', error);
                throw error;
            });
    }
}