// /backend/controllers/authController.js

const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Helper function to generate JWT
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE,
    });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
exports.registerUser = asyncHandler(async (req, res) => {
    const { username, email, password, role, location, skills } = req.body;

    // 1. Basic validation
    if (!username || !email || !password) {
        res.status(400);
        throw new Error('Please enter all required fields.');
    }

    // 2. Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
        res.status(400);
        throw new Error('User already exists');
    }

    // 3. Create user
    const user = await User.create({
        username,
        email,
        password, // Hashing happens in the User model pre-save hook
        role: role || ['requester'], 
        location,
        skills
    });

    if (user) {
        res.status(201).json({
            _id: user._id,
            username: user.username,
            email: user.email,
            role: user.role,
            token: generateToken(user._id),
        });
    } else {
        res.status(400);
        throw new Error('Invalid user data');
    }
});


// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
exports.loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    // 1. Find user by email
    const user = await User.findOne({ email }).select('+password'); // Explicitly select password

    if (user && await user.matchPassword(password)) {
        res.json({
            _id: user._id,
            username: user.username,
            email: user.email,
            role: user.role,
            token: generateToken(user._id),
        });
    } else {
        res.status(401);
        throw new Error('Invalid credentials');
    }
});

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private (protected by authMiddleware)
exports.getUserProfile = asyncHandler(async (req, res) => {
    // req.user is populated by the protect middleware
    const user = await User.findById(req.user.id).select('-password'); 

    if (user) {
        res.json(user);
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});