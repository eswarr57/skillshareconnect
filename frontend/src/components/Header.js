// /frontend/src/components/Header.js (Final Corrected Version)

import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './Header.css';

const Header = () => {
    const { user, isAuthenticated, logout } = useAuth();

    return (
        <header className="header">
            <div className="logo">
                {/* The logo already serves as a Home link */}
                <Link to="/">SkillShare Connect</Link>
            </div>
            <nav className="nav-links">
                
                {/* ADDED EXPLICIT HOME LINK */}
                <Link to="/">Home</Link>
                
                <Link to="/tasks">Browse Tasks</Link>
                {isAuthenticated && user.role.includes('requester') && (
                    <Link to="/post">Post a Task</Link>
                )}
                
                {isAuthenticated ? (
                    <>
                        <Link to="/profile">Welcome, {user.username}</Link>
                        <button onClick={logout} className="btn-logout">
                            Logout
                        </button>
                    </>
                ) : (
                    <>
                        <Link to="/login">Login</Link>
                        <Link to="/register" className="btn-primary">Register</Link>
                    </>
                )}
            </nav>
        </header>
    );
};

export default Header;