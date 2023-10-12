const userDisconnect = (socket, RoomManagerInstance) => {
    socket.on("disconnect", () => {
        const rooms = RoomManagerInstance.getRooms();
        for (const roomID in rooms) {
            if (rooms.hasOwnProperty(roomID)) {
                // Check if the user exists in the room's users object
                if (rooms[roomID].users[socket.id]) {
                    // Remove the user from the room's users object
                    delete rooms[roomID].users[socket.id];
                    socket.leave(roomID);
                    const updatedUsers = RoomManagerInstance.getUsersInRoom(roomID);
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
    userDisconnect
};
