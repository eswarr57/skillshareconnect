// /frontend/src/components/TaskCard.js

import React from 'react';
import { Link } from 'react-router-dom';
import './TaskCard.css'; // You'll need to create this CSS file

const TaskCard = ({ task }) => {
    const { _id, title, category, dueDate, location, requester } = task;

    return (
        <div className="card task-card">
            <div className="card-header">
                <h3>{title}</h3>
                <span className={`task-status status-${task.status}`}>{task.status.toUpperCase()}</span>
            </div>
            <p className="task-meta">
                <strong>Category:</strong> {category}
            </p>
            <p className="task-meta">
                <strong>Due By:</strong> {new Date(dueDate).toLocaleDateString()}
            </p>
            <p className="task-meta">
                <strong>Location:</strong> 📍 {location.city}
            </p>
            <p className="task-meta">
                <strong>Posted By:</strong> {requester.username} (Rating: {requester.rating}/5)
            </p>
            <Link to={`/tasks/${_id}`} className="btn-details">
                View Details & Offer Help
            </Link>
        </div>
    );
};

export default TaskCard;