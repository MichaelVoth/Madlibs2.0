

export const createRoom = ( RoomManagerInstance, userID, username, avatar) => {
    const roomID = RoomManagerInstance.createRoom();
    RoomManagerInstance.joinRoom(roomID, userID, username, avatar);
    const updatedUsers = RoomManagerInstance.getUsersInRoom(roomID);
    return { roomID, updatedUsers };
}

export const joinRoom = ( RoomManagerInstance, roomID, userID, username, avatar) => {
    RoomManagerInstance.joinRoom(roomID, userID, username, avatar);
    const updatedUsers = RoomManagerInstance.getUsersInRoom(roomID);
    console.log("updatedUsers from API call: ", updatedUsers);
    return { roomID, updatedUsers };
}

export const randomRoom = ( RoomManagerInstance, userID, username, avatar) => {
    const roomID = RoomManagerInstance.randomRoom();
    RoomManagerInstance.joinRoom(roomID, userID, username, avatar);
    const updatedUsers = RoomManagerInstance.getUsersInRoom(roomID);
    return { roomID, updatedUsers };
}

export const leaveRoom = ( RoomManagerInstance, roomID, userID) => {
    RoomManagerInstance.leaveRoom(roomID, userID);
    return { roomID };
}

export const updateUsersInRoom = ( roomID, RoomManagerInstance) => {
    const updatedUsers = RoomManagerInstance.getUsersInRoom(roomID);
    return updatedUsers;
}

export const getRooms = (RoomManagerInstance) => {
    const rooms = RoomManagerInstance.getRooms();
    return rooms;
}
