require('dotenv').config();
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dbConnect from "./mongo/dbConnect.js";
import userRoutes from './routes/user.routes.js';
import templateRouter from './routes/template.routes.js'; // Assuming you have a file named template.routes.js
import authMiddleware from './middleware/auth.js';

const app = express();

app.use(cors());
app.use(express.json()); // for parsing application/json

app.use('/api/users', userRoutes);
app.use("/api/templates", templateRouter);

// Error Handling Middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

async function serverStart() {
    try {
        await dbConnect();
        const PORT = process.env.PORT || 8000; // It's good to have a fallback to environment variable
        const server = app.listen(PORT, () =>
            console.log(`Server is running on port ${PORT}`)
        );
    } catch (error) {
        console.log(error);
    }
}

serverStart(); // Invoke the function to start the server
