class RoomController {

    // Create a new room
    static createRoom(RoomManagerInstance, userID, username, avatar, socketID) {
        const roomID = RoomManagerInstance.createRoom();
        RoomManagerInstance.joinRoom(roomID, userID, username, avatar, socketID);
        const updatedUsers = RoomManagerInstance.getUsersInRoom(roomID);
        return { roomID, updatedUsers };
    }
    // Join a room
    static joinRoom(RoomManagerInstance, roomID, userID, username, avatar, socketID) {
        RoomManagerInstance.joinRoom(roomID, userID, username, avatar, socketID);
        const updatedUsers = RoomManagerInstance.getUsersInRoom(roomID);
        return { roomID, updatedUsers };
    }
    // Randomly join a room
    static randomRoom(RoomManagerInstance, userID, username, avatar, socketID) {
        const roomID = RoomManagerInstance.randomRoom();
        RoomManagerInstance.joinRoom(roomID, userID, username, avatar, socketID);
        const updatedUsers = RoomManagerInstance.getUsersInRoom(roomID);
        return { roomID, updatedUsers };
    }
    // Leave a room
    static leaveRoom(RoomManagerInstance, roomID, userID) {
        RoomManagerInstance.leaveRoom(roomID, userID);
        return { roomID };
    }
    // Get users in a room
    static updateUsersInRoom(roomID, RoomManagerInstance) {
        const updatedUsers = RoomManagerInstance.getUsersInRoom(roomID);
        const gamesInRoom = RoomManagerInstance.getGamesInRoom(roomID);
        return {updatedUsers, gamesInRoom};
    }

        // Check game status
    static checkGameStatus(roomID, RoomManagerInstance) {
        const gamesInRoom = RoomManagerInstance.getGamesInRoom(roomID);
        const newGameID = gamesInRoom.findGameIdOfInProgressGame(roomID);
        return newGameID;
    }

    // Get rooms
    static getRooms(RoomManagerInstance) {
        const rooms = RoomManagerInstance.getRooms();
        return rooms;
    }
}

export default RoomController;
