
const newMessageSent = (io, socket) => {
    socket.on("NEW_MESSAGE_SENT", (message) => {
        try {
            io.to(message.roomID).emit("NEW_MESSAGE_RECEIVED", {
            content: message.content,
            username: message.username,
            roomID: message.roomID,
            messageType: message.messageType
            });
        } catch (error) {
            console.log(error);
        }
    });
}

export {
    newMessageSent
};