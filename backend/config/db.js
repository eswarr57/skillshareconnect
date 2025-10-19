// /backend/config/db.js

const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI, {
            // These options are often recommended but may be deprecated in newer Mongoose versions
            // useNewUrlParser: true, 
            // useUnifiedTopology: true,
            // useCreateIndex: true, // not needed in Mongoose 6+
            // useFindAndModify: false, // not needed in Mongoose 6+
        });

        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (err) {
        console.error(`Error: ${err.message}`);
        // Exit process with failure
        process.exit(1); 
    }
};

module.exports = connectDB;