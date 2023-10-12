
const newMessageSent = (socket) => {
    socket.on("NEW_MESSAGE_SENT", (message) => {
        try {
            socket.to(message.roomID).emit("NEW_MESSAGE_RECEIVED", {
            content: message.content,
            username: message.username,
            roomID: message.roomID
            });
        } catch (error) {
            console.log(error);
        }
    });
}

export {
    newMessageSent
};