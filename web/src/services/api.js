import axios from 'axios';

const api = axios.create({
    // baseURL: 'http://localhost:8000',
    baseURL: 'https://adriano-hair-design-production.up.railway.app',
});

export default api;