import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { Server } from "socket.io";
import dbConnect from "./mongo/dbConnect.js";
import userRouter from './routes/user.routes.js';
import templateRouter from './routes/template.routes.js';
import * as roomEvents from "./events/room.events.js"
import * as userEvents from "./events/user.events.js"
import * as gameEvents from "./events/game.events.js"
import * as chatEvents from "./events/chat.events.js"
import RoomManager from '../client/src/classes/roomManager.class.js';

const app = express();

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));

app.use(express.json());
app.use(cookieParser());
app.use('/api/users', userRouter);
app.use("/api/templates", templateRouter);

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

app.get('/test', (req, res) => {
    console.log('Test route hit');
    res.send('Test route');
});


async function serverStart() {
    try {
        await dbConnect();
        const PORT = process.env.PORT;
        const server = app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));

        const io = new Server(server, {
            cors: {
                origin: ["http://localhost:5173"],
                methods: ["GET", "POST"],
                allowedHeaders: ["*"],
                credentials: true,
            },
        });

        const roomManager = new RoomManager(); // Instantiate the RoomManager

        io.on("connection", (socket) => {
            // console.log(`User connected with socket id: ${socket.id}`);

            // Set up the socket listeners for room events
            roomEvents.createRoomRequest(socket, roomManager);
            roomEvents.joinRoomRequest(socket, roomManager);
            roomEvents.randomRoomRequest(socket, roomManager);
            roomEvents.leaveRoomRequest(socket, roomManager);
            roomEvents.userDisconnect(socket, roomManager);

            // You can also set up the socket listeners for user, game, and chat events here
            // Example:
            // userEvents.someUserEvent(socket, roomManager);
            // gameEvents.someGameEvent(socket, roomManager);
            // chatEvents.someChatEvent(socket, roomManager);

            socket.on("disconnect", () => {
                // console.log(`User disconnected with socket id: ${socket.id}`);
            });
        });

    } catch (error) {
        console.log(error);
    }
}

serverStart();
