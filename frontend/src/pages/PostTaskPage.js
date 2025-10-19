// /frontend/src/pages/PostTaskPage.js

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../api/apiClient';
import { useAuth } from '../contexts/AuthContext';
import './PostTaskPage.css';

const initialFormState = {
    title: '',
    description: '',
    category: 'Yard Work', // Default category
    dueDate: '',
    estimatedTime: '',
    city: '', // City is part of location object for the API
};

const CATEGORIES = ['Moving', 'Elderly Assistance', 'Tutoring', 'Yard Work', 'Pet Care', 'Other'];

const PostTaskPage = () => {
    const [formData, setFormData] = useState(initialFormState);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const navigate = useNavigate();
    const { isRequester } = useAuth();

    if (!isRequester) {
        return <div className="container error-message">You must be registered as a Requester to post tasks.</div>;
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        try {
            // Prepare the data structure required by the backend
            const taskData = {
                title: formData.title,
                description: formData.description,
                category: formData.category,
                dueDate: formData.dueDate,
                estimatedTime: parseInt(formData.estimatedTime, 10),
                location: {
                    city: formData.city,
                    lat: 0, // In a real app, use a geocoding API to get these
                    lon: 0, 
                },
            };

            await apiClient.post('/tasks', taskData);
            setMessage('Task posted successfully!');
            setLoading(false);
            setFormData(initialFormState);
            
            // Redirect after a short delay
            setTimeout(() => navigate('/tasks'), 2000); 

        } catch (error) {
            setLoading(false);
            const errorMessage = error.response?.data?.message || 'Failed to post task. Please try again.';
            setMessage(`Error: ${errorMessage}`);
            console.error(error);
        }
    };

    return (
        <div className="container post-task-page">
            <h2>Post a New Task</h2>
            <form onSubmit={handleSubmit} className="task-form">
                {message && <div className={`alert ${message.startsWith('Error') ? 'alert-error' : 'alert-success'}`}>{message}</div>}

                <div className="form-group">
                    <label>Task Title</label>
                    <input type="text" name="title" value={formData.title} onChange={handleChange} required maxLength="100" />
                </div>
                
                <div className="form-group">
                    <label>Category</label>
                    <select name="category" value={formData.category} onChange={handleChange} required>
                        {CATEGORIES.map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                        ))}
                    </select>
                </div>

                <div className="form-group">
                    <label>Detailed Description</label>
                    <textarea name="description" value={formData.description} onChange={handleChange} required rows="5"></textarea>
                </div>
                
                <div className="form-group">
                    <label>Location (City)</label>
                    <input type="text" name="city" value={formData.city} onChange={handleChange} required />
                </div>

                <div className="form-group-inline">
                    <div className="form-group">
                        <label>Due Date</label>
                        <input type="date" name="dueDate" value={formData.dueDate} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label>Estimated Time (Hours)</label>
                        <input type="number" name="estimatedTime" value={formData.estimatedTime} onChange={handleChange} min="1" />
                    </div>
                </div>

                <button type="submit" disabled={loading} className="btn-primary btn-block">
                    {loading ? 'Posting...' : 'Post Task'}
                </button>
            </form>
        </div>
    );
};

export default PostTaskPage;