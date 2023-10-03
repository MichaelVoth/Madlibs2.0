import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { Server } from "socket.io";
import dbConnect from "./mongo/dbConnect.js";
import userRouter from './routes/user.routes.js';
import templateRouter from './routes/template.routes.js'; // Assuming you have a file named template.routes.js
import authMiddleware from './middleware/auth.js';

const app = express();

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));

app.use(express.json()); // for parsing application/json


app.use(cookieParser());
app.use('/api/users', userRouter); // Mount the userRouter on the /api/users route
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
        // Set up socket.io server with CORS configuration
        const io = new Server(server, {
            cors: {
                origin: ["http://localhost:5173"],
                methods: ["GET", "POST"],
                allowedHeaders: ["*"],
                credentials: true,
            },
        });

        io.on("connection", (socket) => {
            console.log(`User connected with socket id: ${socket.id}`);

            const clientSocketId = socket.handshake.query.socketId; // Get the socketId from the client
            if (clientSocketId) {
                console.log(`Client provided socketId: ${clientSocketId}`);
            };
            
            socket.on("disconnect", () => {
                console.log(`User disconnected with socket id: ${socket.id}`);
            });
        });

    } catch (error) {
        console.log(error);
    }
}



serverStart(); // Invoke the function to start the server
