// /backend/server.js

const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const taskRoutes = require('./routes/taskRoutes');
const { errorHandler } = require('./middleware/errorMiddleware');
const cors = require('cors'); // <-- NEW IMPORT

// Load environment variables
dotenv.config();

// Connect to database
connectDB();

const app = express();

// --- NEW CORS MIDDLEWARE ---
// Allows requests from your frontend port (e.g., 3000 or 3001)
// Replace 3000 with whatever port your React app is running on.
const allowedOrigins = ['http://localhost:3000', 'http://localhost:3001']; 

app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl)
        if (!origin) return callback(null, true); 
        if (allowedOrigins.indexOf(origin) === -1) {
            const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
            return callback(new Error(msg), false);
        }
        return callback(null, true);
    },
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
}));
// --- END CORS MIDDLEWARE ---

// Body parser middleware: allows us to accept JSON data in the body
app.use(express.json());

// Basic route for testing server status
app.get('/', (req, res) => {
    res.send('API is running...');
});

// Mount Routers
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

// Error Middleware (Must be last middleware added)
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => 
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
);