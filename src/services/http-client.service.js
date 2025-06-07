import axios from 'axios';
import { API_CONFIG } from '../config/api.config.js';

class HttpClientService {
    constructor() {
        this.client = axios.create({
            baseURL: API_CONFIG.BASE_URL,
            headers: {
                'Content-Type': 'application/json'
            }
        });

        // Interceptor para añadir token automáticamente
        this.client.interceptors.request.use(
            (config) => {
                const token = localStorage.getItem('authToken');
                if (token) {
                    config.headers.Authorization = `Bearer ${token}`;
                }
                return config;
            },
            (error) => {
                return Promise.reject(error);
            }
        );

        // Interceptor para manejar respuestas y errores
        this.client.interceptors.response.use(
            (response) => {
                return response;
            },
            (error) => {
                if (error.response?.status === 401) {
                    // Token expirado o inválido
                    localStorage.removeItem('authToken');
                    localStorage.removeItem('currentUser');
                    window.location.href = '/login';
                }
                return Promise.reject(error);
            }
        );
    }

    get(url, config = {}) {
        return this.client.get(url, config);
    }

    post(url, data = {}, config = {}) {
        return this.client.post(url, data, config);
    }

    put(url, data = {}, config = {}) {
        return this.client.put(url, data, config);
    }

    delete(url, config = {}) {
        return this.client.delete(url, config);
    }
}

export const httpClient = new HttpClientService();