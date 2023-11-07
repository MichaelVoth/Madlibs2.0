import { voteEvents } from "./vote.events.js";

const beginGame = (io, socket, roomManagerInstance) => {
    socket.on("CREATE_GAME", ({ gameID, roomID, username }) => {
        try {
            io.to(roomID).emit("NEW_MESSAGE_RECEIVED", {
                content: `${username} has started the game.`,
                username: 'System',
                roomID: roomID,
                messageType: "system"
            });
            io.to(roomID).emit("GAME_CREATED", gameID); //Send gameID to everyone in room so they can join the game socket room.
        }
        catch (error) {
            console.log("game.events beginGame()", error);
        }
    });
}

const updateGameID = (io, socket, roomManagerInstance) => {
    socket.on("UPDATE_GAME_ID", ({ roomID, gameID }) => {
        io.to(roomID).emit("GAME_ID_UPDATED", gameID);
    });
}

const joinGame = (io, socket, roomManagerInstance) => {
    socket.on("JOIN_GAME", ({ gameID, roomID, userID }) => {
        try {
            console.log("Adding user:", userID);
            socket.join(gameID);
            const gameInstance = roomManagerInstance.getGame(roomID, gameID);
            gameInstance.addPlayer(userID);
            console.log("game.events joinGame() gameInstance.players:", gameInstance.players);
            roomManagerInstance.playerJoinedGame(roomID);
            if (roomManagerInstance.playerCheck(roomID)) { //If all players have joined, start the game
                gameInstance.startGame();
                const gameState = "inProgress"
                io.to(gameID).emit("GAMESTATE_CHANGE", gameState);
            }
        }
        catch (error) {
            console.log("game.events joinGame()", error);
        }
    });
}

const proposeNewGame = (io, socket, roomManagerInstance) => {
    socket.on('PROPOSE_NEW_GAME', (roomID, gameID) => {
        io.to(roomID).emit('SHOW_VOTE_MODAL', gameID);
    });
}

const playAgainGame = (io, socket, roomManagerInstance) => {
    voteEvents.on('PLAY_AGAIN_VOTE_COMPLETE', (voteResults, roomID, gameID) => {
        try {
            roomManagerInstance.setExpectedPlayers(roomID, voteResults.yes.length); //Set expected players to the number of yes votes
            const gameInstance = roomManagerInstance.getGame(roomID, gameID);
            const yesVoterSocketIDs = voteResults.yes.map(voter => voter.socketID);
            yesVoterSocketIDs.forEach(socketID => {
                const voterSocket = io.sockets.sockets.get(socketID);
                voterSocket.join(gameID);
            });
            io.to(gameID).emit("GAME_CREATED", gameID); //Send gameID to everyone in room so they can join the game socket room.


        }
        catch (error) {
            console.log("game.events playAgainGame()", error);
        }
    });
}

const inactivePlayer = (io, socket, roomManagerInstance) => {
    socket.on("USER_INACTIVE", ({ gameID, roomID, userID, username }) => {
        try {
            const gameInstance = roomManagerInstance.getGame(roomID, gameID);
            let gameState = "waiting"
            socket.emit("GAMESTATE_CHANGE", gameState)
            io.to(roomID).emit("NEW_MESSAGE_RECEIVED", {
                content: `${username} has been marked inactive.`,
                username: 'System',
                roomID: roomID,
                messageType: "system"
            });
            socket.leave(gameID);
            roomManagerInstance.playerLeftGame(roomID);
            socket.to(gameID).emit("GET_NEW_PROMPTS"); //Send to all other users in game to update their prompts

            //Check if all users are inactive. If so, run abandonGame()
            if (gameInstance.allUsersInactive()) {
                io.to(roomID).emit("NEW_MESSAGE_RECEIVED", {
                    content: 'Game Abandoned.',
                    username: 'System',
                    roomID: roomID,
                    messageType: "system"
                });
                let gameState = "abandoned"
                io.to(roomID).emit("GAMESTATE_CHANGE", gameState); //Send the gameID to the client for api call for solution
            }
        }
        catch (error) {
            console.log(error);
        }
    });
}

const userFinished = (io, socket, roomManagerInstance) => {
    socket.on("USER_FINISHED", ({ gameID, roomID, userID, username }) => {
        try {
            const gameInstance = roomManagerInstance.getGame(roomID, gameID);
            gameInstance.userFinished(userID, gameID);
            io.to(roomID).emit("NEW_MESSAGE_RECEIVED", {
                content: `${username} has finished their prompts.`,
                username: 'System',
                roomID: roomID,
                messageType: "system"
            });
            //Check if all users are finished. If so, run completeGame()
            if (gameInstance.allUsersFinished()) {
                gameInstance.completeGame(gameID);
                roomManagerInstance.gameComplete(roomID, gameID);
                io.to(roomID).emit("NEW_MESSAGE_RECEIVED", {
                    content: 'Everyone has finished',
                    username: 'System',
                    roomID: roomID,
                    messageType: "system"
                });
                socket.leave(gameID); //Leave the game socket room
                const gameState = "complete"
                io.to(roomID).emit("GAMESTATE_CHANGE", gameState);
            }
        }
        catch (error) {
            console.log(error);
        }
    });
}


export {
    beginGame,
    updateGameID,
    proposeNewGame,
    joinGame,
    playAgainGame,
    userFinished,
    inactivePlayer
}
