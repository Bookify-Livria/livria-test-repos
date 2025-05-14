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
    createUser(rawResource) {
        const adapted = UserAssembler.toResource(rawResource);
        return axios.post('http://localhost:3000/users', adapted)
            .catch(error => {
                console.error('Error creating order:', error);
                throw error;
            });
    }


    updateUser(user) {
        return axios.put(`http://localhost:3000/users/${user.id}`, user)
            .catch(error => {
                console.error('Error updating users:', error);
                throw error;
            });
    }


    getUserById(id) {
        return axios.get(`http://localhost:3000/users/${id}`)
            .then(response => response.data)
            .catch(error => {
                console.error('Error getting user:', error);
                throw error;
            });
    }

    deleteUser(id) {
        return axios.delete(`http://localhost:3000/users/${id}`)
            .catch(error => {
                console.error('Error deleting user:', error);
                throw error;
            });
    }
}
