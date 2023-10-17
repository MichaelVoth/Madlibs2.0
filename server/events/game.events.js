
const beginGame = (io, socket) => {
    socket.on("START_GAME", (gameID) => {
        try{
            io.to(roomID).emit("GAME_STARTED", {
                gameID: gameID,
            });
        }
        catch (error) {
            console.log(error);
        }
    });
}