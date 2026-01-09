const { default: axios } = require('axios');

// Central axios instance for backend API
// Override with NEXT_PUBLIC_API_BASE_URL in .env.local when needed
export const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080';

export const clientServer = axios.create({
    baseURL,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true,
});

