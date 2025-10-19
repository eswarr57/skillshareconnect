// /frontend/src/App.js

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';

// Components and Pages
import Header from './components/Header';
import HomePage from './pages/HomePage'; // Simple placeholder
import TaskListPage from './pages/TaskListPage';
import TaskDetailPage from './pages/TaskDetailPage'; // To be created next
import PostTaskPage from './pages/PostTaskPage'; // To be created next
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

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
                    {/* Add other protected routes like /profile */}
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