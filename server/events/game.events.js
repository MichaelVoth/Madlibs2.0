import Game from "../models/game.model.js";
import GameClass from "../classes/game.class.js";

const beginGame = (io, socket) => {
    socket.on("START_GAME", ({ gameID, roomID, username }) => {
        try{
            io.to(roomID).emit("NEW_MESSAGE_RECEIVED", {
                content: `${username} has started the game.`,
                username: 'System',
                roomID: roomID,
                systemMessage: true
            });
            io.to(roomID).emit("GAME_STARTED", gameID,
            );
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

    }
}

export {
    beginGame,
    userFinished
}
