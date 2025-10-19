// /backend/middleware/errorMiddleware.js

const errorHandler = (err, req, res, next) => {
    // Determine the status code: use the one set in the controller/middleware, or 500
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode);

    res.json({
        message: err.message,
        // Only include the stack trace if in development mode
        stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
};

module.exports = { errorHandler };