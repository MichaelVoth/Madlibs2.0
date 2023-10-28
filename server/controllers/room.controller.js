class RoomController {

    // Create a new room
    static createRoom(RoomManagerInstance, userID, username, avatar) {
        const roomID = RoomManagerInstance.createRoom();
        RoomManagerInstance.joinRoom(roomID, userID, username, avatar);
        const updatedUsers = RoomManagerInstance.getUsersInRoom(roomID);
        return { roomID, updatedUsers };
    }
    // Join a room
    static joinRoom(RoomManagerInstance, roomID, userID, username, avatar) {
        RoomManagerInstance.joinRoom(roomID, userID, username, avatar);
        const updatedUsers = RoomManagerInstance.getUsersInRoom(roomID);
        return { roomID, updatedUsers };
    }
    // Randomly join a room
    static randomRoom(RoomManagerInstance, userID, username, avatar) {
        const roomID = RoomManagerInstance.randomRoom();
        RoomManagerInstance.joinRoom(roomID, userID, username, avatar);
        const updatedUsers = RoomManagerInstance.getUsersInRoom(roomID);
        return { roomID, updatedUsers };
    }
    // Leave a room
    static leaveRoom(RoomManagerInstance, roomID, userID) {
        RoomManagerInstance.leaveRoom(roomID, userID);
        console.log("Room Left: ", roomID);
        console.log("Room Expected Players: ", RoomManagerInstance.rooms[roomID].expectedPlayers);
        return { roomID };
    }
    // Get users in a room
    static updateUsersInRoom(roomID, RoomManagerInstance) {
        const updatedUsers = RoomManagerInstance.getUsersInRoom(roomID);
        return updatedUsers;
    }
    // Get rooms
    static getRooms(RoomManagerInstance) {
        const rooms = RoomManagerInstance.getRooms();
        return rooms;
    }
}

export default RoomController;
