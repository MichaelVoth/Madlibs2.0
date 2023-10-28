

class RoomManager {
    constructor() {
        this.rooms = {};
        // { roomID: 
        //      { users: { 
        //          userID: { 
        //              userID, 
        //              username, 
        //              avatar }}
        //      { games: { 
        //          gameID: { 
        //              gameID, 
        //              templateID, 
        //              players: { 
        //                  userID: { userID, username, avatar, playerStatus, promptsAssigned: [{ prompt, response }], timeTaken, finishTime }}, 
        //              duration, 
        //              completed, 
        //              solutionID, 
        //              gameStatus, 
        //              gamesInSuccession, 
        //              reports: [reportID] }}}
        //       { expectedPlayers: 0 }
        //       { joinedPlayers: 0 }
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
        this.rooms[roomID] = { users: {}, games: {}, expectedPlayers: 0, joinedPlayers: 0 };
        return roomID;
    }

    joinRoom(roomID, userID, username, avatar) {
        if (this.rooms.hasOwnProperty(roomID)) { // If room exists
            if (!this.rooms[roomID].users[userID]) { // If user is not already in room
                if (Object.keys(this.rooms[roomID].users).length < this.maxUsersPerRoom) { // If room is not full
                    this.rooms[roomID].users[userID] = { userID, username, avatar }; // Add user to room
                    this.playerJoinedRoom(roomID);
                } else {
                    throw new Error("Room is full.");
                }
            } else {
                throw new Error("User is already in room.");
            }
        } else {
            throw new Error("JoinRoom: Room does not exist.");
        }
    }

    leaveRoom(roomID, userID) {
        if (this.rooms.hasOwnProperty(roomID) && this.rooms[roomID].users[userID]) {
            this.playerLeftRoom(roomID);
            delete this.rooms[roomID].users[userID];
        }
    }

    playerJoinedRoom(roomID) {
        this.rooms[roomID].expectedPlayers++;
    }

    playerLeftRoom(roomID) {
        this.rooms[roomID].expectedPlayers--;
    }

    playerJoinedGame(roomID) {
        this.rooms[roomID].joinedPlayers++;
    }

    playerLeftGame(roomID) {
        this.rooms[roomID].joinedPlayers--;
    }

    playerCheck(roomID) {
        if(this.rooms[roomID].expectedPlayers === this.rooms[roomID].joinedPlayers) {
            return true;
        } else {
            return false;
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

    removeRoomCheck(roomID) {
        if (this.rooms.hasOwnProperty(roomID) && Object.keys(this.rooms[roomID].users).length === 0) {
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
            return Object.values(this.rooms[roomID].users); // Return an array of user objects( userID, username, avatar)
        } else {
            throw new Error(`getUsersInRoom: Room with ID ${roomID} does not exist.`);
        }
    }

    addGameToRoom(roomID, game, gameID) {
        if (!this.rooms[roomID].games) { // If room does not have a games object
            this.rooms[roomID].games = {}; // Create a games object
        }
        this.rooms[roomID].games[gameID] = game; // Add game to room
    }

    getGame(roomID, gameID) {
        if (this.rooms[roomID] && this.rooms[roomID].games[gameID]) { // If room and game exist
            return this.rooms[roomID].games[gameID]; // Return game
        } else {
            throw new Error("roomManager getGame(): Game or Room does not exist.");
        }
    }
    updateGame(roomID, gameID, game) {
        if (this.rooms[roomID] && this.rooms[roomID].games[gameID]) {
            this.rooms[roomID].games[gameID] = game;
        } else {
            throw new Error("roomManager updateGame(): Game or Room does not exist.");
        }
    }

    removeGameFromRoom(roomID, gameID) {
        if (this.rooms[roomID] && this.rooms[roomID].games[gameID]) {
            delete this.rooms[roomID].games[gameID];
        } else {
            throw new Error("roomManager removeGame(): Game or Room does not exist.");
        }
    }



}
export default RoomManager;
