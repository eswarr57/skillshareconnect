// /frontend/src/pages/LoginPage.js

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './AuthForm.css'; // You'll need to create this CSS file

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login, loading, error } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await login(email, password);
            navigate('/tasks'); // Redirect to task list upon successful login
        } catch (err) {
            // Error is handled and set in AuthContext
            console.error(err);
        }
    };

    return (
        <div className="auth-container">
            <form onSubmit={handleSubmit} className="auth-form">
                <h2>Login to SkillShare</h2>
                {error && <div className="alert-error">{error}</div>}
                <div className="form-group">
                    <label>Email Address</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Password</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" disabled={loading} className="btn-primary btn-block">
                    {loading ? 'Logging In...' : 'Login'}
                </button>
                <p className="form-footer">
                    Don't have an account? <Link to="/register">Register Here</Link>
                </p>
            </form>
        </div>
    );
};

export default LoginPage;