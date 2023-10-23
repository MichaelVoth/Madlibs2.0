const beginGame = (io, socket) => {
    socket.on("START_GAME", ({ gameID, roomID, username }) => {
        try{
            io.to(roomID).emit("NEW_MESSAGE_RECEIVED", {
                content: `${username} has started the game.`,
                username: 'System',
                roomID: roomID,
                systemMessage: true
            });
            // console.log(`Game ${gameID} started in room ${roomID}`);
            io.to(roomID).emit("GAME_STARTED", gameID,
            );
        }
        catch (error) {
            console.log(error);
        }
    });
}

export {
    beginGame
}
