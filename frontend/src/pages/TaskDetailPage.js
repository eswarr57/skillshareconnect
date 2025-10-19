// /frontend/src/pages/TaskDetailPage.js

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import apiClient from '../api/apiClient';
import { useAuth } from '../contexts/AuthContext';
import './TaskDetailPage.css'; // You will need to create this CSS file

const TaskDetailPage = () => {
    const [task, setTask] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [message, setMessage] = useState(null);
    const { id } = useParams();
    const { isAuthenticated, user, isHelper } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchTask = async () => {
            try {
                const res = await apiClient.get(`/tasks/${id}`);
                setTask(res.data);
                setLoading(false);
            } catch (err) {
                setError('Failed to fetch task details.');
                setLoading(false);
            }
        };
        fetchTask();
    }, [id]);

    const handleAcceptTask = async () => {
        if (!isAuthenticated) {
            alert('Please login to accept this task.');
            navigate('/login');
            return;
        }
        if (!isHelper) {
            alert('You must be registered as a Helper to accept tasks.');
            return;
        }

        setLoading(true);
        try {
            const res = await apiClient.put(`/tasks/${id}/accept`);
            setTask(res.data); // Update task status on success
            setMessage('Success! You have accepted the task. Please contact the requester.');
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'Failed to accept task.';
            setMessage(`Error: ${errorMessage}`);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="container">Loading task details...</div>;
    if (error) return <div className="container error-message">Error: {error}</div>;
    if (!task) return <div className="container error-message">Task not found.</div>;

    // Determine button state
    const isOwner = user && task.requester._id === user._id;
    const isAssigned = task.status !== 'open';
    const showAcceptButton = isHelper && task.status === 'open' && !isOwner;

    return (
        <div className="container task-detail-page">
            <div className="task-header">
                <h1>{task.title}</h1>
                <span className={`task-status status-${task.status}`}>{task.status.toUpperCase()}</span>
            </div>
            
            {message && <div className={`alert ${message.startsWith('Error') ? 'alert-error' : 'alert-success'}`}>{message}</div>}

            <div className="task-details-grid">
                <div className="task-main-content">
                    <h3>Description:</h3>
                    <p>{task.description}</p>

                    <h3>Timeline:</h3>
                    <ul>
                        <li><strong>Category:</strong> {task.category}</li>
                        <li><strong>Needed By:</strong> {new Date(task.dueDate).toLocaleDateString()}</li>
                        <li><strong>Estimated Time:</strong> {task.estimatedTime || 'N/A'} hours</li>
                    </ul>
                </div>
                
                <aside className="task-sidebar card">
                    <h3>Requester Details</h3>
                    <p><strong>Name:</strong> {task.requester.username}</p>
                    <p><strong>Rating:</strong> {task.requester.rating}/5</p>
                    <p><strong>Location:</strong> {task.location.city}</p>
                    
                    {/* Show contact only if assigned or is the requester */}
                    {isOwner || task.helper?._id === user?._id ? (
                        <p className="contact-info">
                            <strong>Contact Email:</strong> {task.requester.email}
                        </p>
                    ) : (
                        <p className="contact-info">Contact information available upon acceptance.</p>
                    )}

                    {showAcceptButton && (
                        <button 
                            onClick={handleAcceptTask} 
                            disabled={loading} 
                            className="btn-primary btn-block"
                        >
                            {loading ? 'Submitting...' : 'Accept Task & Help'}
                        </button>
                    )}
                    
                    {isAssigned && <p className="assigned-message">This task is already assigned.</p>}
                    {isOwner && <p className="owner-message">This is your task.</p>}
                </aside>
            </div>
        </div>
    );
};

export default TaskDetailPage;