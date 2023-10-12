

class RoomManager {
    constructor() {
        this.rooms = {}; // { roomID: { users: { userID: { userID, username, avatar } } } }
        this.maxUsersPerRoom = 6;
    }

    // Generate a unique room code for a new room
    generateRoomCode(rooms) {
        const makeKey = () => {
            return Math.random().toString(36).substring(2, 8).toUpperCase();
        };
        let newKey;
        let attempts = 0;
        const maxAttempts = 100; // arbitrary number to prevent infinite loops
        do {
            newKey = makeKey();
            attempts++;
        } while (rooms[newKey] && attempts < maxAttempts);
        if (attempts === maxAttempts) {
            throw new Error("Failed to generate a unique room code.");
        }
        return newKey;
    }

    createRoom() { // Returns a room code
        const roomID = this.generateRoomCode(Object.keys(this.rooms));
        this.rooms[roomID] = { users: {} };
        return roomID;
    }
    

    joinRoom(roomID, userID, username, avatar) {
        if (this.rooms.hasOwnProperty(roomID)) { // If room exists
            if (!this.rooms[roomID].users[userID]) { // If user is not already in room
                if (Object.keys(this.rooms[roomID].users).length < this.maxUsersPerRoom) { // If room is not full
                    this.rooms[roomID].users[userID] = { userID, username, avatar }; // Add user to room
                } else {
                    throw new Error("Room is full.");
                }
            } else {
                throw new Error("User is already in room.");
            }
        } else {
            throw new Error("Room does not exist.");
        }
    }
    

    leaveRoom(roomID, userID) {
        if (this.rooms.hasOwnProperty(roomID) && this.rooms[roomID].users[userID]) {
            delete this.rooms[roomID].users[userID];
            if (Object.keys(this.rooms[roomID].users).length === 0) {
                delete this.rooms[roomID];
            }
        }
    }
    

    randomRoom() {
        const roomIDs = Object.keys(this.rooms); // Get all room IDs
        let randomRoomPick = roomIDs[Math.floor(Math.random() * roomIDs.length)];
        while (this.rooms[randomRoomPick].length > this.maxUsersPerRoom) { 
            // If randomly picked room is full, pick another room
            randomRoomPick = roomIDs[Math.floor(Math.random() * roomIDs.length)];
        }
        return randomRoomPick;
    }

    removeRoom(roomID) {
        if (this.rooms.hasOwnProperty(roomID)) {
            delete this.rooms[roomID];
        }
    }

    getRooms() {
        return this.rooms;
    }

    getRoomCount() {
        return Object.keys(this.rooms).length;
    }

    getRoom(roomID) {
        return this.rooms[roomID] || null;
    }


    getUsersInRoom(roomID) {
        if (this.rooms[roomID]) {
            return Object.values(this.rooms[roomID].users); // Return an array of user objects
        } else {
            throw new Error(`Room with ID ${roomID} does not exist.`);
        }
    }
    
    

    isUserInAnyRoom(userID) {
        for (let room in this.rooms) {
            if (this.rooms[room][userID]) {
                return true;
            }
        }
        return false;
    }
}

export default RoomManager;
