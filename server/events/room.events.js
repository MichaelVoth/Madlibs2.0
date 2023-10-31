
const joinRoomRequest = (io, socket, roomManagerInstance) => {
    socket.on("JOIN_ROOM_REQUEST", (roomID, username, callback) => {
        try {
            socket.join(roomID);
            const updatedUsers = roomManagerInstance.getUsersInRoom(roomID);
            socket.to(roomID).emit("UPDATE_USERS_IN_ROOM", updatedUsers);
            io.to(roomID).emit("NEW_MESSAGE_RECEIVED", {
                content: `${username} has joined the room.`,
                username: 'System',
                roomID: roomID,
                messageType: "system"
            });
            callback({ status: 'success', message: 'Joined room successfully!' });
        } catch (error) {
            console.log(error);
            callback({ status: 'error', message: 'Failed to join room.' });
        }
    });
}

const leaveRoomRequest = (io, socket, roomManagerInstance) => {
    socket.on("LEAVE_ROOM_REQUEST", (roomID, username, callback) => {
        try {
            socket.leave(roomID);
            const updatedUsers = roomManagerInstance.getUsersInRoom(roomID);
            socket.to(roomID).emit("UPDATE_USERS_IN_ROOM", updatedUsers);
            io.to(roomID).emit("NEW_MESSAGE_RECEIVED", {
                content: `${username} has left the room.`,
                username: 'System',
                roomID: roomID,
                messageType: "system"
            });
            roomManagerInstance.removeRoomCheck(roomID);
            callback({ status: 'success', message: 'Left room successfully!' });
        } catch (error) {
            console.log(error);
            callback({ status: 'error', message: 'Failed to leave room.' });
        }
    });
}


const userDisconnect = (io, socket, roomManagerInstance) => {
    socket.on("disconnect", () => {
        const rooms = roomManagerInstance.getRooms();
        for (const roomID in rooms) {
            if (rooms.hasOwnProperty(roomID)) {
                // Check if the user exists in the room's users object
                if (rooms[roomID].users[socket.id]) {
                    // Remove the user from the room's users object
                    delete rooms[roomID].users[socket.id];
                    socket.leave(roomID);
                    const updatedUsers = roomManagerInstance.getUsersInRoom(roomID);
                    socket.to(roomID).emit("UPDATE_USERS_IN_ROOM", updatedUsers);
                    // Check if the room is empty and delete it if so
                    if (Object.keys(rooms[roomID].users).length === 0) {
                        delete rooms[roomID];
                    }
                }
            }
        }
    });
}

export {
    joinRoomRequest,
    leaveRoomRequest,
    userDisconnect
};
