// /frontend/src/App.js

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';

// Components and Pages
import Header from './components/Header';
import HomePage from './pages/HomePage';
import TaskListPage from './pages/TaskListPage';
import TaskDetailPage from './pages/TaskDetailPage';
import PostTaskPage from './pages/PostTaskPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage'; // <-- 1. ADD THIS IMPORT

// You will need a global stylesheet: /frontend/src/App.css (not provided here)
import './App.css'; 

// Private Route Component (Example)
const PrivateRoute = ({ children }) => {
    const { isAuthenticated } = useAuth();
    return isAuthenticated ? children : <Navigate to="/login" />;
};

const AppContent = () => {
    return (
        <Router>
            <Header />
            <main>
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/tasks" element={<TaskListPage />} />
                    <Route path="/tasks/:id" element={<TaskDetailPage />} /> 
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    
                    {/* Protected Routes */}
                    <Route 
                        path="/post" 
                        element={
                            <PrivateRoute>
                                <PostTaskPage />
                            </PrivateRoute>
                        } 
                    />
                    
                    {/* 2. ADD THE MISSING PROFILE ROUTE HERE */}
                    <Route 
                        path="/profile" 
                        element={
                            <PrivateRoute>
                                <ProfilePage />
                            </PrivateRoute>
                        } 
                    />
                    
                </Routes>
            </main>
        </Router>
    );
};

const App = () => (
    <AuthProvider>
        <AppContent />
    </AuthProvider>
);

export default App;