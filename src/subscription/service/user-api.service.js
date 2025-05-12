import axios from 'axios';
import { UserAssembler } from './user.assembler.js';

export class UserApiService {
    getUsers() {
        return axios.get('http://localhost:3000/users')
            .then(response => UserAssembler.toEntitiesFromResponse(response))
            .catch(error => {
                console.error('Error fetching users:', error);
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

    updateMember(user) {
        return axios.put('http://localhost:3000/users/${user.id}', user)
            .catch(error => {
                console.error('Error updating users:', error);
                throw error;
            });
    }

    deleteUser(user) {
        return axios.delete('http://localhost:3000/users/${user.id}')
            .catch(error => {
                console.error('Error deleting user:', error);
                throw error;
            });
    }
}