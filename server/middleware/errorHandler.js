

const errorHandlerMiddleware = (err, req, res, next) => { // middleware function to handle errors
    const statusCode = err.statusCode || 500; // set the status code to the error status code or 500
    console.error(err.message, err.stack);
    res.status(statusCode).json({ // return the status code and a json object with the error message and stack trace
        message: err.message, // message: err.message,
        stack: process.env.NODE_ENV === 'production' ? null : err.stack, // stack: process.env.NODE_ENV === 'production' ? null : err.stack
    });
};

export default errorHandlerMiddleware;
