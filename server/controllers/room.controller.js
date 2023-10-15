class RoomController {

    static createRoom(RoomManagerInstance, userID, username, avatar) {
        const roomID = RoomManagerInstance.createRoom();
        RoomManagerInstance.joinRoom(roomID, userID, username, avatar);
        const updatedUsers = RoomManagerInstance.getUsersInRoom(roomID);
        return { roomID, updatedUsers };
    }

    static joinRoom(RoomManagerInstance, roomID, userID, username, avatar) {
        RoomManagerInstance.joinRoom(roomID, userID, username, avatar);
        const updatedUsers = RoomManagerInstance.getUsersInRoom(roomID);
        return { roomID, updatedUsers };
    }

    static randomRoom(RoomManagerInstance, userID, username, avatar) {
        const roomID = RoomManagerInstance.randomRoom();
        RoomManagerInstance.joinRoom(roomID, userID, username, avatar);
        const updatedUsers = RoomManagerInstance.getUsersInRoom(roomID);
        return { roomID, updatedUsers };
    }

    static leaveRoom(RoomManagerInstance, roomID, userID) {
        RoomManagerInstance.leaveRoom(roomID, userID);
        return { roomID };
    }

    static updateUsersInRoom(roomID, RoomManagerInstance) {
        const updatedUsers = RoomManagerInstance.getUsersInRoom(roomID);
        return updatedUsers;
    }

    static getRooms(RoomManagerInstance) {
        const rooms = RoomManagerInstance.getRooms();
        return rooms;
    }
}

export default RoomController;
