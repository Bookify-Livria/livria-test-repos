// Configuración centralizada de la API
export const API_CONFIG = {
    // URL por la de tu backend local o en Azure
    //BASE_URL: 'https://localhost:7001/api', // o 'http://localhost:5000/api'
    BASE_URL: 'https://livria-sv.mysql.database.azure.com/api',

    ENDPOINTS: {
        // Auth endpoints
        LOGIN: '/auth/login',
        REGISTER: '/auth/register',
        VALIDATE_TOKEN: '/auth/validate-token',

        // User endpoints
        USERS: '/users',
        USER_PROFILE: '/users/profile',
        USER_BY_ID: (id) => `/users/${id}`,
        CHANGE_PASSWORD: (id) => `/users/${id}/change-password`,

        // Client endpoints
        CLIENTS: '/clients',
        CLIENT_BY_ID: (id) => `/clients/${id}`,
        CLIENTS_BY_USER: (userId) => `/clients/user/${userId}`
    }
};