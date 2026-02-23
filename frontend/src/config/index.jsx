const { default: axios } = require('axios');

// Central axios instance for backend API
// Override with NEXT_PUBLIC_API_BASE_URL in .env.local when needed
export const baseURL =  'https://proconnect-zmc9.onrender.com';

export const clientServer = axios.create({
    baseURL,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true,
});

