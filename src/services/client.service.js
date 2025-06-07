import { httpClient } from './http-client.service.js';
import { API_CONFIG } from '../config/api.config.js';

export class ClientService {

    // Obtener todos los clientes
    async getAllClients() {
        try {
            const response = await httpClient.get(API_CONFIG.ENDPOINTS.CLIENTS);
            return response.data.data;
        } catch (error) {
            console.error('Error fetching clients:', error);
            throw error;
        }
    }

    // Obtener cliente por ID
    async getClientById(id) {
        try {
            const response = await httpClient.get(API_CONFIG.ENDPOINTS.CLIENT_BY_ID(id));
            return response.data.data;
        } catch (error) {
            console.error('Error getting client:', error);
            throw error;
        }
    }

    // Obtener clientes por usuario
    async getClientsByUser(userId) {
        try {
            const response = await httpClient.get(API_CONFIG.ENDPOINTS.CLIENTS_BY_USER(userId));
            return response.data.data;
        } catch (error) {
            console.error('Error getting user clients:', error);
            throw error;
        }
    }

    // Crear cliente
    async createClient(clientData) {
        try {
            const response = await httpClient.post(API_CONFIG.ENDPOINTS.CLIENTS, clientData);
            return response.data.data;
        } catch (error) {
            console.error('Error creating client:', error);
            throw error;
        }
    }

    // Actualizar cliente
    async updateClient(id, clientData) {
        try {
            const response = await httpClient.put(API_CONFIG.ENDPOINTS.CLIENT_BY_ID(id), clientData);
            return response.data.data;
        } catch (error) {
            console.error('Error updating client:', error);
            throw error;
        }
    }

    // Eliminar cliente
    async deleteClient(id) {
        try {
            const response = await httpClient.delete(API_CONFIG.ENDPOINTS.CLIENT_BY_ID(id));
            return response.data;
        } catch (error) {
            console.error('Error deleting client:', error);
            throw error;
        }
    }
}