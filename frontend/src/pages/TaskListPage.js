// /frontend/src/pages/TaskListPage.js

import React, { useState, useEffect } from 'react';
import apiClient from '../api/apiClient';
import TaskCard from '../components/TaskCard';

const TaskListPage = () => {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                // Ensure your backend is running on port 5000 for this to work
                const res = await apiClient.get('/tasks'); 
                setTasks(res.data);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching tasks:', err);
                setError('Failed to load tasks. Please check server connection.');
                setLoading(false);
            }
        };
        fetchTasks();
    }, []);

    if (loading) {
        return <div className="container">Loading tasks...</div>;
    }

    if (error) {
        return <div className="container error-message">Error: {error}</div>;
    }

    return (
        <div className="container task-list-page">
            <h2>Available Community Tasks</h2>
            <p>Find a task and volunteer your skills!</p>
            <div className="task-cards-grid">
                {tasks.length > 0 ? (
                    tasks.map(task => (
                        <TaskCard key={task._id} task={task} />
                    ))
                ) : (
                    <p className="no-tasks">No open tasks available right now. Time to relax!</p>
                )}
            </div>
        </div>
    );
};

export default TaskListPage;