import axios from 'axios';
import { UserAssembler } from './user.assembler.js';

export class UserApiService {
    getUsers() {
        return axios.get('http://localhost:3000/users')
            .then(response => UserAssembler.toEntitiesFromResponse(response))
            .catch(error => {
                console.error('Error fetching subscription:', error);
                throw error;
            });
    }
    createUser(user) {
        return fetch('http://localhost:3000/users', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(user)
        }).then(res => res.json())
    }
}