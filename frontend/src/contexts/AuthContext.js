// /frontend/src/contexts/AuthContext.js

import React, { createContext, useState, useContext, useEffect } from 'react';
import apiClient from '../api/apiClient';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    // Check localStorage for user on initial load
    const [user, setUser] = useState(() => {
        const storedUser = localStorage.getItem('user');
        return storedUser ? JSON.parse(storedUser) : null;
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // --- Authentication Functions ---

    const login = async (email, password) => {
        setLoading(true);
        setError(null);
        try {
            const res = await apiClient.post('/auth/login', { email, password });
            
            // Store user and token
            localStorage.setItem('user', JSON.stringify(res.data));
            setUser(res.data);
            
            setLoading(false);
            return res.data;
        } catch (err) {
            setLoading(false);
            const errorMessage = err.response?.data?.message || 'Login failed';
            setError(errorMessage);
            throw new Error(errorMessage);
        }
    };

    const register = async (userData) => {
        setLoading(true);
        setError(null);
        try {
            const res = await apiClient.post('/auth/register', userData);
            
            // Store user and token immediately upon successful registration
            localStorage.setItem('user', JSON.stringify(res.data));
            setUser(res.data);
            
            setLoading(false);
            return res.data;
        } catch (err) {
            setLoading(false);
            const errorMessage = err.response?.data?.message || 'Registration failed';
            setError(errorMessage);
            throw new Error(errorMessage);
        }
    };

    const logout = () => {
        localStorage.removeItem('user');
        setUser(null);
    };

    // --- Context Value ---
    const value = {
        user,
        loading,
        error,
        login,
        register,
        logout,
        isAuthenticated: !!user,
        isHelper: user ? user.role.includes('helper') : false,
        isRequester: user ? user.role.includes('requester') : false,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};