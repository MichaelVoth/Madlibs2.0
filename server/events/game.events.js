import Game from "../models/game.model.js";
import GameClass from "../classes/game.class.js";

const beginGame = (io, socket, roomManagerInstance) => {
    socket.on("CREATE_GAME", ({ gameID, roomID, username }) => {
        try{
            io.to(roomID).emit("NEW_MESSAGE_RECEIVED", {
                content: `${username} has started the game.`,
                username: 'System',
                roomID: roomID,
                systemMessage: true
            });
            roomManagerInstance.playerJoinedGame(roomID);
            io.to(roomID).emit("GAME_CREATED", gameID); //Send gameID to everyone in room so they can join the game socket room.
        }
        catch (error) {
            console.log(error);
        }
    });
}

const joinGame = (io, socket, roomManagerInstance) => {
    socket.on("JOIN_GAME", async ({ gameID, roomID, userID }) => {
        try{
            socket.join(gameID);
            const gameInstance = roomManagerInstance.getGame(gameID);
            gameInstance.addPlayer(userID);
            roomManagerInstance.playerJoinedGame();
            console.log("joinGame()gameInstance", gameInstance);
            socket.emit("GAME_JOINED", gameID);
            if (roomManagerInstance.playerCheck(roomID)) { //If all players have joined, start the game
                gameInstance.startGame();
                socket.to(gameID).emit("GAME_STARTED");
            }
        }
        catch (error) {
            console.log("joinGame()",error);
        }
    });
}


const inactivePlayer = (io, socket, roomManagerInstance) => {
    socket.on("USER_INACTIVE", async ({ gameID, roomID, userID, username }) => {
        try{
            const gameInstance = roomManagerInstance.getGame(roomID, gameID);
            io.to(roomID).emit("NEW_MESSAGE_RECEIVED", {
                content: `${username} has been marked inactive.`,
                username: 'System',
                roomID: roomID,
                systemMessage: true
            });
            socket.leave(gameID);
            roomManagerInstance.playerLeftGame(roomID);
            socket.to(gameID).emit("GET_NEW_PROMPTS"); //Send to all other users in room to update their prompts
            //Check if all users are inactive. If so, run abandonGame()
            if (gameInstance.allUsersInactive()) {
                gameInstance.abandonGame(gameID);
                await Game.findByIdAndUpdate(gameID, { gameInstance }); //This should also update inactive prompts, I think.
                io.to(roomID).emit("NEW_MESSAGE_RECEIVED", {
                    content: 'Everyone has been marked inactive',
                    username: 'System',
                    roomID: roomID,
                    systemMessage: true
                });
                io.to(roomID).emit("GAME_ABANDONED", gameID); //Send the gameID to the client for api call for solution
            }
        }
        catch (error) {
            console.log(error);
        }
    });
}

const userFinished = (io, socket, roomManagerInstance) => {
    socket.on("USER_FINISHED", async ({ gameID, roomID, userID, username }) => {
        try{
            const gameInstance = roomManagerInstance.getGame(roomID, gameID);
            gameInstance.userFinished(userID);
            await Game.findByIdAndUpdate(gameID, { gameInstance });
            io.to(roomID).emit("NEW_MESSAGE_RECEIVED", {
                content: `${username} has finished their prompts.`,
                username: 'System',
                roomID: roomID,
                systemMessage: true
            });
            //Check if all users are finished. If so, run completeGame()
            if (gameInstance.allUsersFinished()) {
                gameInstance.completeGame();
                await Game.findByIdAndUpdate(gameID, { gameInstance });
                io.to(roomID).emit("NEW_MESSAGE_RECEIVED", {
                    content: 'Everyone has finished',
                    username: 'System',
                    roomID: roomID,
                    systemMessage: true
                });
                io.to(roomID).emit("GAME_COMPLETE", gameID); //Send the gameID to the client for api call for solution
            }
        }
        catch (error) {
            console.log(error);
        }
    });
}

const playAgain = (io, socket, roomManagerInstance) => {
    socket.on("PLAY_AGAIN"), ({roomID, username}) => {
        //Begin voting process for playing again
    }
}

export {
    beginGame,
    joinGame,
    userFinished,
    inactivePlayer,
    playAgain
}
