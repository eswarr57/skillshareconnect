// /frontend/src/pages/ProfilePage.js

import React, { useState, useEffect } from 'react';
import apiClient from '../api/apiClient';
import { useAuth } from '../contexts/AuthContext';
import './ProfilePage.css';

const ProfilePage = () => {
    const { user, isAuthenticated } = useAuth();
    const [profileData, setProfileData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!isAuthenticated) {
            setLoading(false);
            return;
        }

        const fetchProfile = async () => {
            try {
                // This calls the protected route GET /api/auth/profile
                const res = await apiClient.get('/auth/profile');
                setProfileData(res.data);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching profile:', err);
                // Updated message to prompt checking the network status
                setError('Failed to load profile data. Check your browser\'s Network tab (F12) for the API status code (should be 200).');
                setLoading(false);
            }
        };
        fetchProfile();
    }, [isAuthenticated]);

    if (loading) return <div className="container">Loading profile...</div>;
    if (error) return <div className="container alert-error">{error}</div>;
    if (!profileData) return <div className="container alert-error">Profile data not found.</div>;

    // Destructure profileData safely.
    // Use an empty object for location if it is null/undefined to prevent crashes.
    const { 
        username, 
        email, 
        role, 
        location = {}, // <-- DEFAULT TO EMPTY OBJECT
        skills, 
        rating, 
        bio 
    } = profileData;

    return (
        <div className="container profile-page">
            <h2>{username}'s Community Profile</h2>
            <div className="profile-details card">
                
                <section className="profile-section">
                    <h3>Basic Information</h3>
                    <p><strong>Email:</strong> {email}</p>
                    {/* Access location safely using the destructured default or optional chaining */}
                    <p><strong>Location:</strong> {location.city || 'Not specified'}</p> 
                    <p><strong>Member Since:</strong> {new Date(profileData.createdAt).toLocaleDateString()}</p>
                </section>

                <section className="profile-section">
                    <h3>Roles & Status</h3>
                    <p>
                        <strong>Active Roles:</strong> 
                        <span className="roles-list">
                            {/* Ensure role is an array before mapping */}
                            {Array.isArray(role) && role.map(r => <span key={r} className={`role-badge role-${r}`}>{r}</span>)}
                        </span>
                    </p>
                    <p><strong>Average Rating:</strong> {rating !== undefined ? `${rating}/5` : 'No ratings yet'}</p>
                </section>

                {bio && (
                    <section className="profile-section">
                        <h3>About Me</h3>
                        <p>{bio}</p>
                    </section>
                )}

                {/* Ensure skills is an array and has content before rendering */}
                {Array.isArray(skills) && skills.length > 0 && (
                    <section className="profile-section">
                        <h3>Skills Offered (Helper)</h3>
                        <div className="skills-list">
                            {skills.map(s => <span key={s} className="skill-tag">{s}</span>)}
                        </div>
                    </section>
                )}
            </div>
        </div>
    );
};

export default ProfilePage;