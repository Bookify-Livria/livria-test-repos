import axios from 'axios';
import { UserAdminAssembler } from "./user-admin.assembler.js";
import { UserClientAssembler } from "./user-client.assembler.js";

export class UserApiService {
    //for UserClient
    getUsers() {
        return axios.get('https://livria-6efh.onrender.com/clientUsers')
            .then(response => UserClientAssembler.toEntitiesFromResponse(response))
            .catch(error => {
                console.error('Error fetching users:', error);
                throw error;
            });
    }
    getUserById(id) {
        return axios.get(`https://livria-6efh.onrender.com/clientUsers/${id}`)
            .then(response => response.data)
            .catch(error => {
                console.error('Error getting user:', error);
                throw error;
            });
    }
    createUser(rawResource) {
        const adapted = UserClientAssembler.toResource(rawResource);
        return axios.post('https://livria-6efh.onrender.com/clientUsers', adapted)
            .catch(error => {
                console.error('Error creating order:', error);
                throw error;
            });
    }
    updateUser(user) {
        return axios.put(`https://livria-6efh.onrender.com/clientUsers/${user.id}`, user)
            .catch(error => {
                console.error('Error updating users:', error);
                throw error;
            });
    }
    deleteUser(id) {
        return axios.delete(`https://livria-6efh.onrender.com/clientUsers/${id}`)
            .catch(error => {
                console.error('Error deleting user:', error);
                throw error;
            });
    }


    //for UserAdmin
    getAdminUser() {
        return axios.get('https://livria-6efh.onrender.com/adminUser')
            .then(response => {
                const adminData = response.data[0]; // toma el primer (y único) admin
                return UserAdminAssembler.toEntityFromResource(adminData);
            })
            .catch(error => {
                console.error('Error fetching admin user:', error);
                throw error;
            });
    }
    updateAdminUser(user) {
        return axios.put(`https://livria-6efh.onrender.com/adminUser/${user.id}`, user)
            .catch(error => {
                console.error('Error updating users:', error);
                throw error;
            });
    }

    //logged-in user
    getLoggedInUser() {
        return axios.get('https://livria-6efh.onrender.com/userLogin')
            .then(response => response.data)
            .catch(error => {
                console.error('Error fetching logged-in users:', error);
                throw error;
            });
    }
    createLoggedInUser(userData) {
        return axios.post('https://livria-6efh.onrender.com/userLogin', userData)
            .then(response => response.data)
            .catch(error => {
                console.error('Error creating logged-in user:', error);
                throw error;
            });
    }
    deleteLoggedInUser(id) {
        return axios.delete(`https://livria-6efh.onrender.com/userLogin/${id}`)
            .catch(error => {
                console.error('Error deleting logged-in user:', error);
                throw error;
            });
    }

}
