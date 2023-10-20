const beginGame = (io, socket) => {
    socket.on("START_GAME", ({ gameID, roomID, username }) => {
        try{
            io.to(roomID).emit("NEW_MESSAGE_RECEIVED", {
                content: `${username} has started the game.`,
                username: 'System',
                roomID: roomID,
                systemMessage: true
            });
            io.to(roomID).emit("GAME_STARTED", {
                gameID: gameID,
            });
        }
        catch (error) {
            console.log(error);
        }
    });
}

export {
    beginGame
}
