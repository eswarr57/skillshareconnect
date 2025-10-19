// /backend/models/Task.js

const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please add a title for the task'],
        trim: true,
        maxlength: [100, 'Title cannot be more than 100 characters']
    },
    description: {
        type: String,
        required: [true, 'Please add a detailed description']
    },
    category: {
        type: String,
        required: true,
        enum: ['Moving', 'Elderly Assistance', 'Tutoring', 'Yard Work', 'Pet Care', 'Other']
    },
    requester: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    helper: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        default: null
    },
    status: {
        type: String,
        enum: ['open', 'assigned', 'in-progress', 'completed', 'cancelled'],
        default: 'open'
    },
    location: {
        city: { type: String, required: true },
        lat: { type: Number, required: true },
        lon: { type: Number, required: true }
    },
    dueDate: {
        type: Date,
        required: true
    },
    estimatedTime: {
        type: Number, // Expected hours to complete
        required: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Task', TaskSchema);