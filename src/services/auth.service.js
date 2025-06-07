import { httpClient } from './http-client.service.js';
import { API_CONFIG } from '../config/api.config.js';
import { UserAssembler } from '../subscription/service/user.assembler.js';

export class AuthService {

    // Login
    async login(usernameOrEmail, password) {
        try {
            const response = await httpClient.post(API_CONFIG.ENDPOINTS.LOGIN, {
                usernameOrEmail,
                password
            });

            if (response.data.success) {
                // Guardar token y usuario en localStorage
                localStorage.setItem('authToken', response.data.token);
                localStorage.setItem('currentUser', JSON.stringify(response.data.user));

                return {
                    success: true,
                    token: response.data.token,
                    user: UserAssembler.toEntityFromResource(response.data.user),
                    message: response.data.message
                };
            }

            return {
                success: false,
                message: response.data.message,
                errors: response.data.errors || []
            };

        } catch (error) {
            console.error('Error during login:', error);

            if (error.response?.data) {
                return {
                    success: false,
                    message: error.response.data.message || 'Error de autenticación',
                    errors: error.response.data.errors || []
                };
            }

            return {
                success: false,
                message: 'Error de conexión',
                errors: ['No se pudo conectar con el servidor']
            };
        }
    }

    // Registro
    async register(userData) {
        try {
            const adapted = UserAssembler.toRegisterResource(userData);
            const response = await httpClient.post(API_CONFIG.ENDPOINTS.REGISTER, adapted);

            if (response.data.success) {
                // Guardar token y usuario en localStorage
                localStorage.setItem('authToken', response.data.token);
                localStorage.setItem('currentUser', JSON.stringify(response.data.user));

                return {
                    success: true,
                    token: response.data.token,
                    user: UserAssembler.toEntityFromResource(response.data.user),
                    message: response.data.message
                };
            }

            return {
                success: false,
                message: response.data.message,
                errors: response.data.errors || []
            };

        } catch (error) {
            console.error('Error during registration:', error);

            if (error.response?.data) {
                return {
                    success: false,
                    message: error.response.data.message || 'Error de registro',
                    errors: error.response.data.errors || []
                };
            }

            return {
                success: false,
                message: 'Error de conexión',
                errors: ['No se pudo conectar con el servidor']
            };
        }
    }

    // Validar token
    async validateToken(token) {
        try {
            const response = await httpClient.post(API_CONFIG.ENDPOINTS.VALIDATE_TOKEN, { token });
            return response.data.isValid;
        } catch (error) {
            console.error('Error validating token:', error);
            return false;
        }
    }

    // Logout
    logout() {
        localStorage.removeItem('authToken');
        localStorage.removeItem('currentUser');
    }

    // Verificar si está autenticado
    isAuthenticated() {
        const token = localStorage.getItem('authToken');
        return !!token;
    }

    // Obtener token actual
    getToken() {
        return localStorage.getItem('authToken');
    }

    // Obtener usuario actual
    getCurrentUser() {
        const userStr = localStorage.getItem('currentUser');
        if (userStr) {
            try {
                const userData = JSON.parse(userStr);
                return UserAssembler.toEntityFromResource(userData);
            } catch (error) {
                console.error('Error parsing current user:', error);
                return null;
            }
        }
        return null;
    }
}