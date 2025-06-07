import { httpClient } from '../../services/http-client.service.js';
import { API_CONFIG } from '../../config/api.config.js';
import { UserAssembler } from './user.assembler.js';

export class UserApiService {

    // Obtener todos los usuarios (requiere autenticación)
    async getUsers() {
        try {
            const response = await httpClient.get(API_CONFIG.ENDPOINTS.USERS);
            return UserAssembler.toEntitiesFromResponse(response);
        } catch (error) {
            console.error('Error fetching users:', error);
            throw error;
        }
    }

    // Obtener usuario por ID
    async getUserById(id) {
        try {
            const response = await httpClient.get(API_CONFIG.ENDPOINTS.USER_BY_ID(id));
            return UserAssembler.toEntityFromSingleResponse(response);
        } catch (error) {
            console.error('Error getting user:', error);
            throw error;
        }
    }

    // Obtener perfil del usuario actual
    async getCurrentUserProfile() {
        try {
            const response = await httpClient.get(API_CONFIG.ENDPOINTS.USER_PROFILE);
            return UserAssembler.toEntityFromSingleResponse(response);
        } catch (error) {
            console.error('Error getting current user profile:', error);
            throw error;
        }
    }

    // Actualizar usuario
    async updateUser(id, userData) {
        try {
            const adapted = UserAssembler.toUpdateResource(userData);
            const response = await httpClient.put(API_CONFIG.ENDPOINTS.USER_BY_ID(id), adapted);
            return UserAssembler.toEntityFromSingleResponse(response);
        } catch (error) {
            console.error('Error updating user:', error);
            throw error;
        }
    }

    // Eliminar usuario (soft delete)
    async deleteUser(id) {
        try {
            const response = await httpClient.delete(API_CONFIG.ENDPOINTS.USER_BY_ID(id));
            return response.data;
        } catch (error) {
            console.error('Error deleting user:', error);
            throw error;
        }
    }

    // Cambiar contraseña
    async changePassword(id, passwordData) {
        try {
            const response = await httpClient.post(
                API_CONFIG.ENDPOINTS.CHANGE_PASSWORD(id),
                {
                    currentPassword: passwordData.currentPassword,
                    newPassword: passwordData.newPassword
                }
            );
            return response.data;
        } catch (error) {
            console.error('Error changing password:', error);
            throw error;
        }
    }
}