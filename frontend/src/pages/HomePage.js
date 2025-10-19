// /frontend/src/pages/HomePage.js

import React from 'react';
import { Link } from 'react-router-dom';
import './HomePage.css';

const HomePage = () => {
    return (
        <div className="container home-page">
            <header className="hero-section">
                <h1>Community Skill-Share & Task Assistance</h1>
                <p>Connecting neighbors who need a hand with neighbors who are ready to help.</p>
                <div className="cta-buttons">
                    <Link to="/tasks" className="btn-primary btn-large">
                        Browse Open Tasks
                    </Link>
                    <Link to="/post" className="btn-secondary btn-large">
                        Post a Task (Need Help)
                    </Link>
                </div>
            </header>
            
            <section className="features">
                <h2>How It Works</h2>
                <div className="feature-grid">
                    <div className="feature-item">
                        <h3>1. Post</h3>
                        <p>Need help moving furniture, tutoring, or yard work? Post your task details.</p>
                    </div>
                    <div className="feature-item">
                        <h3>2. Match</h3>
                        <p>Skilled volunteers in your neighborhood see your task and offer their assistance.</p>
                    </div>
                    <div className="feature-item">
                        <h3>3. Connect</h3>
                        <p>Accept an offer and coordinate directly with your helper to get the job done!</p>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default HomePage;