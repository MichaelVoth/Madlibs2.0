import { Router } from 'express';
import authMiddleware from '../middleware/auth.js';
import {
    createRoom,
    joinRoom,
    randomRoom,
    leaveRoom,
    updateUsersInRoom,
    getRooms,
} from '../controllers/room.controller.js';

const roomRouter = Router();

roomRouter.get('/:roomID', authMiddleware, (req, res) => {
    const { socketID } = req.query;
    const { roomID } = req.params;
    const roomManagerInstance = req.app.get('roomManagerInstance')
    try {
        const result = updateUsersInRoom(req.io, socketID, roomID, roomManagerInstance);
        res.json(result);
    } catch (error) {
        console.log("It is breaking in room.routes.js")
        console.log(error);
        res.status(500).send(error.message);
    }
});

roomRouter.post('/create', authMiddleware, (req, res) => {
    const { socketID, userID, username, avatar } = req.body;
    const roomManagerInstance = req.app.get('roomManagerInstance')
    try {
        const result = createRoom(req.io, socketID, roomManagerInstance, userID, username, avatar);
        res.json(result);
    } catch (error) {
        console.log(error);
        res.status(500).send(error.message);
    }
});
roomRouter.post('/join', authMiddleware, (req, res) => {
    const { socket, roomID, userID, username, avatar } = req.body;
    const roomManagerInstance = req.app.get('roomManagerInstance')
    try {
        const result = joinRoom(req.io, socket, roomManagerInstance, roomID, userID, username, avatar);
        res.json(result);
    } catch (error) {
        res.status(500).send(error.message);
    }
});
roomRouter.post('/random', authMiddleware, (req, res) => {
    const { socket, userID, username, avatar } = req.body;
    const roomManagerInstance = req.app.get('roomManagerInstance')
    try {
        const result = randomRoom(req.io, socket, roomManagerInstance, userID, username, avatar);
        res.json(result);
    } catch (error) {
        res.status(500).send(error.message);
    }
});
roomRouter.post('/leave/:roomID', authMiddleware, (req, res) => {
    const { socket, roomID, userID } = req.body;
    const roomManagerInstance = req.app.get('roomManagerInstance')
    try {
        const result = leaveRoom(req.io, socket, roomManagerInstance, roomID, userID);
        res.json(result);
    } catch (error) {
        res.status(500).send(error.message);
    }
});
roomRouter.get('/all', authMiddleware, getRooms);

export default roomRouter;
