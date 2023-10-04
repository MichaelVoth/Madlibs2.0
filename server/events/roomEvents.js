import { isObjectIdOrHexString } from "mongoose";


const createRoomRequest = (socket, RoomManager) => {
    socket.on("CREATE_ROOM_REQUEST", (userID) => {
        try {
            const roomCode = RoomManager.createRoom();
            socket.emit("CREATE_ROOM_SUCCESS", roomCode);
            RoomManager.joinRoom(roomCode, userID);
            socket.join(roomCode);
        } catch (error) {
            socket.emit("CREATE_ROOM_FAILURE", error.message);
        }
    });
}

const joinRoomRequest = (socket, RoomManager) => {
    socket.on("JOIN_ROOM_REQUEST", (roomCode, userID) => {
        try {
            RoomManager.joinRoom(roomCode, userID);
            socket.emit("JOIN_ROOM_SUCCESS", roomCode);
            socket.join(roomCode);
            socket.to(roomCode).emit("USER_JOINED_ROOM", userID);
        } catch (error) {
            socket.emit("JOIN_ROOM_FAILURE", error.message);
        }
    });
}

const randomRoomRequest = (socket, RoomManager) => {
    socket.on("RANDOM_ROOM_REQUEST", (userID) => {
        try {
            const roomCode = RoomManager.randomRoom();
            socket.emit("RANDOM_ROOM_SUCCESS", roomCode);
            RoomManager.joinRoom(roomCode, userID);
            socket.join(roomCode);
        } catch (error) {
            socket.emit("RANDOM_ROOM_FAILURE", error.message);
        }
    });
}

const leaveRoomRequest = (socket, RoomManager) => {
    socket.on("LEAVE_ROOM_REQUEST", (roomCode, userID) => {
        try {
            RoomManager.leaveRoom(roomCode, userID);
            socket.emit("LEAVE_ROOM_SUCCESS", roomCode);
            socket.leave(roomCode);
            socket.to(roomCode).emit("USER_LEFT_ROOM", userID);
        } catch (error) {
            socket.emit("LEAVE_ROOM_FAILURE", error.message);
        }
    });
}

const userDisconnect = (socket, RoomManager) => {
    socket.on("disconnect", () => {
        const rooms = RoomManager.getRooms();
        for (const roomCode in rooms) {
            if (rooms.hasOwnProperty(roomCode)) {
                const index = rooms[roomCode].indexOf(socket.id);
                if (index !== -1) {
                    rooms[roomCode].splice(index, 1);
                    socket.to(roomCode).emit("USER_LEFT_ROOM", socket.id);
                    if (rooms[roomCode].length === 0) {
                        delete rooms[roomCode];
                    }
                }
            }
        }
    });
}

export {
    createRoomRequest,
    joinRoomRequest,
    randomRoomRequest,
    leaveRoomRequest,
    userDisconnect
};
