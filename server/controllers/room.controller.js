


export const createRoom = (io, socketID, RoomManagerInstance, userID, username, avatar) => {
    try {
        const roomID = RoomManagerInstance.createRoom();
        RoomManagerInstance.joinRoom(roomID, userID, username, avatar);
        const updatedUsers = RoomManagerInstance.getUsersInRoom(roomID);
        io.to(socketID).emit('UPDATE_USERS_IN_ROOM', { updatedUsers });
        return { roomID, updatedUsers };
    } catch (error) {
        throw error;
    }
}

export const joinRoom = (io, socketID, RoomManagerInstance, roomID, userID, username, avatar) => {
    try {
        RoomManagerInstance.joinRoom(roomID, userID, username, avatar);
        const updatedUsers = RoomManagerInstance.getUsersInRoom(roomID);
        io.to(socketID).emit('UPDATE_USERS_IN_ROOM', { roomID, updatedUsers });
        io.to(roomID).emit('UPDATE_USERS_IN_ROOM', { updatedUsers });
        return { roomID, updatedUsers };
    } catch (error) {
        throw error;
    }
}

export const randomRoom = (io, socketID, RoomManagerInstance, userID, username, avatar) => {
    try {
        const roomID = RoomManagerInstance.randomRoom();
        RoomManagerInstance.joinRoom(roomID, userID, username, avatar);
        const updatedUsers = RoomManagerInstance.getUsersInRoom(roomID);
        io.to(socketID).emit('UPDATE_USERS_IN_ROOM', { updatedUsers });
        return { roomID, updatedUsers };
    } catch (error) {
        throw error;
    }
}

export const leaveRoom = (io, RoomManagerInstance, roomID, userID) => {
    try {
        RoomManagerInstance.leaveRoom(roomID, userID);
        const updatedUsers = RoomManagerInstance.getUsersInRoom(roomID);
        io.to(roomID).emit('UPDATE_USERS_IN_ROOM', { updatedUsers });
        return { roomID, updatedUsers };
    } catch (error) {
        throw error;
    }
}

export const updateUsersInRoom = (io, socketID, roomID, RoomManagerInstance) => {
    try {
        const updatedUsers = RoomManagerInstance.getUsersInRoom(roomID);
        io.to(socketID).emit('UPDATE_USERS_IN_ROOM', { updatedUsers });
        return updatedUsers;
    } catch (error) {
        console.log("It is breaking in room.controller.js")
        throw error;
    }
}

export const getRooms = (RoomManagerInstance) => {
    try {
        const rooms = RoomManagerInstance.getRooms();
        return rooms;
    } catch (error) {
        throw error;
    }
}