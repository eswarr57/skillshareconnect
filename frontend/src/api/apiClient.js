// /frontend/src/api/apiClient.js

import axios from 'axios';

// Create a custom Axios instance
const apiClient = axios.create({
    // IMPORTANT: Set this to your backend server URL
    baseURL: 'http://localhost:5000/api', 
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to attach the JWT token
apiClient.interceptors.request.use(
    (config) => {
        const user = JSON.parse(localStorage.getItem('user'));
        
        // If the user object exists and has a token, attach it
        if (user && user.token) {
            config.headers.Authorization = `Bearer ${user.token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default apiClient;