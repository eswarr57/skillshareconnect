// /backend/routes/taskRoutes.js

const express = require('express');
const { 
    getTasks, 
    createTask, 
    getTaskById, 
    acceptTask 
} = require('../controllers/taskController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

// @route GET /api/tasks | Public
// @route POST /api/tasks | Private (Requester)
router.route('/')
    .get(getTasks) 
    .post(protect, createTask);

// @route GET /api/tasks/:id | Public
router.get('/:id', getTaskById);

// @route PUT /api/tasks/:id/accept | Private (Helper)
router.put('/:id/accept', protect, acceptTask); 


module.exports = router;