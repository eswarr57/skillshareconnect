// /backend/models/User.js

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Please add a username'],
        unique: true,
        trim: true,
    },
    email: {
        type: String,
        required: [true, 'Please add an email'],
        unique: true,
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            'Please add a valid email'
        ]
    },
    password: {
        type: String,
        required: [true, 'Please add a password'],
        minlength: 6,
        select: false // Do not return password field by default
    },
    role: {
        type: [String], // Array to allow for both 'helper' and 'requester'
        enum: ['helper', 'requester'],
        default: ['requester']
    },
    location: {
        city: String,
        lat: Number,
        lon: Number
    },
    skills: {
        type: [String], // Skills the user offers
        default: []
    },
    rating: {
        type: Number,
        default: 5.0,
        min: 1.0,
        max: 5.0
    },
    bio: String,
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Mongoose Pre-save hook: Hash password before saving
UserSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// Mongoose Method: Check if entered password matches the stored hash
UserSchema.methods.matchPassword = async function (enteredPassword) {
    // This explicitly fetches the user document *with* the password hash 
    // to guarantee the hash is available for bcrypt.compare.
    const user = await mongoose.model('User').findById(this._id).select('+password');
    if (!user) return false;
    
    // Check if the entered password matches the stored HASH
    return await bcrypt.compare(enteredPassword, user.password);
};

module.exports = mongoose.model('User', UserSchema);