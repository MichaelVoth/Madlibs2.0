import { Router } from 'express';
import authMiddleware from '../middleware/auth.js';
import RoomController from '../controllers/room.controller.js';

const roomRouter = Router();

roomRouter.get('/:roomID', authMiddleware, (req, res) => {
    const { roomID } = req.params;
    const roomManagerInstance = req.app.get('roomManagerInstance')
    try {
        const result = RoomController.updateUsersInRoom(roomID, roomManagerInstance);
        res.json(result);
    } catch (error) {
        console.log("It is breaking in room.routes.js")
        console.log(error);
        res.status(500).send(error.message);
    }
});

roomRouter.post('/create', authMiddleware, (req, res) => {
    const { userID, username, avatar } = req.body;
    const roomManagerInstance = req.app.get('roomManagerInstance')
    try {
        const result = RoomController.createRoom(roomManagerInstance, userID, username, avatar);
        res.json(result);
    } catch (error) {
        console.log(error);
        res.status(500).send(error.message);
    }
});

roomRouter.post('/join', authMiddleware, (req, res) => {
    const { roomID, userID, username, avatar } = req.body;
    const roomManagerInstance = req.app.get('roomManagerInstance')
    try {
        const result = RoomController.joinRoom(roomManagerInstance, roomID, userID, username, avatar);
        res.json(result);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

roomRouter.post('/random', authMiddleware, (req, res) => {
    const { userID, username, avatar } = req.body;
    const roomManagerInstance = req.app.get('roomManagerInstance')
    try {
        const result = RoomController.randomRoom(roomManagerInstance, userID, username, avatar);
        res.json(result);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

roomRouter.post('/leave', authMiddleware, (req, res) => {
    const { roomID, userID } = req.body;
    const roomManagerInstance = req.app.get('roomManagerInstance')
    try {
        const result = RoomController.leaveRoom(roomManagerInstance, roomID, userID);
        res.json(result);
    } catch (error) {
        console.log(error);
        res.status(500).send(error.message);
    }
});

roomRouter.get('/all', authMiddleware, (req, res) => {
    const roomManagerInstance = req.app.get('roomManagerInstance')
    try {
        const result = RoomController.getRooms(roomManagerInstance);
        res.json(result);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

export default roomRouter;
