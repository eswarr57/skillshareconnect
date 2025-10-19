// /backend/controllers/taskController.js

const asyncHandler = require('express-async-handler');
const Task = require('../models/Task');
const User = require('../models/User');

// @desc    Get all open tasks
// @route   GET /api/tasks
// @access  Public
exports.getTasks = asyncHandler(async (req, res) => {
    // Only show tasks with status 'open' or 'assigned' (maybe 'in-progress' too)
    const tasks = await Task.find({ status: { $in: ['open', 'assigned'] } })
        .populate('requester', 'username location rating'); // Get basic requester info

    res.json(tasks);
});

// @desc    Create a new task
// @route   POST /api/tasks
// @access  Private (Requester only)
exports.createTask = asyncHandler(async (req, res) => {
    const { title, description, category, location, dueDate, estimatedTime } = req.body;
    
    // Check if the authenticated user is a requester (or has the role)
    if (!req.user.role.includes('requester')) {
        res.status(403);
        throw new Error('User is not authorized to post tasks.');
    }

    const newTask = new Task({
        title,
        description,
        category,
        location,
        dueDate,
        estimatedTime,
        requester: req.user._id, // Set requester from authenticated user
    });

    const task = await newTask.save();
    res.status(201).json(task);
});

// @desc    Get a single task by ID
// @route   GET /api/tasks/:id
// @access  Public
exports.getTaskById = asyncHandler(async (req, res) => {
    const task = await Task.findById(req.params.id)
        .populate('requester', 'username email location rating')
        .populate('helper', 'username email rating');

    if (task) {
        res.json(task);
    } else {
        res.status(404);
        throw new Error('Task not found');
    }
});


// @desc    Helper accepts a task (sets helper field and status)
// @route   PUT /api/tasks/:id/accept
// @access  Private (Helper only)
exports.acceptTask = asyncHandler(async (req, res) => {
    const task = await Task.findById(req.params.id);

    // Check if the authenticated user is a helper (or has the role)
    if (!req.user.role.includes('helper')) {
        res.status(403);
        throw new Error('User is not authorized to accept tasks.');
    }

    if (task && task.status === 'open') {
        // Prevent a user from accepting their own task
        if (task.requester.toString() === req.user._id.toString()) {
             res.status(400);
             throw new Error('Cannot accept your own task.');
        }

        task.helper = req.user._id;
        task.status = 'assigned'; // Change status to assigned

        const updatedTask = await task.save();
        res.json(updatedTask);

    } else if (task && task.status !== 'open') {
        res.status(400);
        throw new Error('Task is not open or already assigned.');
    } else {
        res.status(404);
        throw new Error('Task not found');
    }
});