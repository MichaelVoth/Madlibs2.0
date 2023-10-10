import  io from "../server.js";


const createRoomRequest = (socket, RoomManagerInstance) => {
    socket.on("CREATE_ROOM_REQUEST", (userID) => {
        try {
            const roomID = RoomManagerInstance.createRoom();
            RoomManagerInstance.joinRoom(roomID, userID);
            socket.join(roomID);
            socket.emit("CREATE_ROOM_SUCCESS", roomID);
            const updatedUsers = RoomManagerInstance.getUsersInRoom(roomID);
            socket.emit("UPDATE_USERS_IN_ROOM", updatedUsers);
            // console.log('roomID', roomID, 'userID', userID)
        } catch (error) {
            socket.emit("CREATE_ROOM_FAILURE", error.message);
        }
    });
}

const joinRoomRequest = (socket, RoomManagerInstance) => {
    socket.on("JOIN_ROOM_REQUEST", (roomID, userID) => {
        try {
            RoomManagerInstance.joinRoom(roomID, userID);
            socket.emit("JOIN_ROOM_SUCCESS", roomID);
            socket.join(roomID);
            const updatedUsers = RoomManagerInstance.getUsersInRoom(roomID);
            socket.to(roomID).emit("UPDATE_USERS_IN_ROOM", updatedUsers);
            socket.emit("UPDATE_USERS_IN_ROOM", updatedUsers);
            // console.log('roomID', roomID, 'userID', userID)
        } catch (error) {
            socket.emit("JOIN_ROOM_FAILURE", error.message);
        }
    });
}

const randomRoomRequest = (socket, RoomManagerInstance) => {
    socket.on("RANDOM_ROOM_REQUEST", (userID) => {
        try {
            const roomID = RoomManagerInstance.randomRoom();
            socket.emit("RANDOM_ROOM_SUCCESS", roomID);
            RoomManagerInstance.joinRoom(roomID, userID);
            socket.join(roomID);
            const updatedUsers = RoomManagerInstance.getUsersInRoom(roomID);
            socket.to(roomID).emit("UPDATE_USERS_IN_ROOM", updatedUsers);
        } catch (error) {
            socket.emit("RANDOM_ROOM_FAILURE", error.message);
        }
    });
}


const leaveRoomRequest = (socket, RoomManagerInstance) => {
    socket.on("LEAVE_ROOM_REQUEST", (roomID, userID) => {
        try {
            RoomManagerInstance.leaveRoom(roomID, userID);
            socket.emit("LEAVE_ROOM_SUCCESS", roomID);
            socket.leave(roomID);
            const updatedUsers = RoomManagerInstance.getUsersInRoom(roomID);
            socket.to(roomID).emit("UPDATE_USERS_IN_ROOM", updatedUsers);
        } catch (error) {
            socket.emit("LEAVE_ROOM_FAILURE", error.message);
        }
    });
}

const userDisconnect = (socket, RoomManagerInstance) => {
    socket.on("disconnect", () => {
        const rooms = RoomManagerInstance.getRooms();
        for (const roomID in rooms) {
            if (rooms.hasOwnProperty(roomID)) {
                const index = rooms[roomID].indexOf(socket.id);
                if (index !== -1) {
                    rooms[roomID].splice(index, 1);
                    socket.leave(roomID);
                    const updatedUsers = RoomManagerInstance.getUsersInRoom(roomID);
                    socket.to(roomID).emit("UPDATE_USERS_IN_ROOM", updatedUsers);
                    if (rooms[roomID].length === 0) {
                        delete rooms[roomID];
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
