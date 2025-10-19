// /frontend/src/pages/RegisterPage.js

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const RegisterPage = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        role: ['requester'], // Default role
        location: { city: '' },
    });
    const { register, loading, error } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        if (name === 'city') {
            setFormData({
                ...formData,
                location: { city: value },
            });
        } else if (type === 'checkbox') {
            // Handle role checkbox
            const updatedRoles = checked
                ? [...formData.role, name]
                : formData.role.filter((r) => r !== name);

            setFormData({
                ...formData,
                role: updatedRoles,
            });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // NOTE: Location coords (lat/lon) would be added via a geocoding service in a full app
            const dataToSubmit = { 
                ...formData,
                // Simple placeholder coords for backend validation
                location: { ...formData.location, lat: 0, lon: 0 } 
            }; 
            await register(dataToSubmit);
            navigate('/tasks'); 
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="auth-container">
            <form onSubmit={handleSubmit} className="auth-form">
                <h2>Join the Community</h2>
                {error && <div className="alert-error">{error}</div>}
                
                <div className="form-group">
                    <label>Username</label>
                    <input type="text" name="username" value={formData.username} onChange={handleChange} required />
                </div>

                <div className="form-group">
                    <label>Email</label>
                    <input type="email" name="email" value={formData.email} onChange={handleChange} required />
                </div>

                <div className="form-group">
                    <label>Password</label>
                    <input type="password" name="password" value={formData.password} onChange={handleChange} required />
                </div>
                
                <div className="form-group">
                    <label>City/Location</label>
                    <input type="text" name="city" value={formData.location.city} onChange={handleChange} required />
                </div>

                <div className="form-group role-selection">
                    <label>What are you here to do?</label>
                    <div>
                        <input type="checkbox" id="requester" name="requester" checked={formData.role.includes('requester')} onChange={handleChange} />
                        <label htmlFor="requester">Request Tasks (Need Help)</label>
                    </div>
                    <div>
                        <input type="checkbox" id="helper" name="helper" checked={formData.role.includes('helper')} onChange={handleChange} />
                        <label htmlFor="helper">Offer Skills (Volunteer)</label>
                    </div>
                </div>

                <button type="submit" disabled={loading} className="btn-primary btn-block">
                    {loading ? 'Registering...' : 'Register'}
                </button>
                <p className="form-footer">
                    Already have an account? <Link to="/login">Login</Link>
                </p>
            </form>
        </div>
    );
};

export default RegisterPage;