
const votes = {};

const playAgainVote = (io, socket, roomManagerInstance) => {
    socket.on("VOTE_SUBMIT playAgain", (data) => {
        const playerCount = roomManagerInstance.getUsersInRoom(data.roomID).length;
        if (!votes[data.roomID]) { // If room doesn't exist in votes object, create it
            votes[data.roomID] = {};
        }
        if (!votes[data.roomID][data.topic]) { // If topic doesn't exist in votes object, create it
            votes[data.roomID][data.topic] = { "yes": [], "no": [], "noResponse": [] };
        }
        ['yes', 'no', 'noResponse'].forEach((vote) => {
            const index = votes[data.roomID][data.topic][data.vote].indexOf(data.user);
            if (index !== -1) { // If user is in other votes
                votes[data.roomID][data.topic][data.vote].splice(index, 1); // Remove user from other votes
            }
        });
        if (data.vote === true) {
            votes[data.roomID][data.topic].yes.push(data.user);
        } else if (data.vote === false) {
            votes[data.roomID][data.topic].no.push(data.user);
        } else {
            votes[data.roomID][data.topic].noResponse.push(data.user);
        }
        const yesCount = votes[data.roomID][data.topic].yes.length;
        const noCount = votes[data.roomID][data.topic].no.length;
        const noResponseCount = votes[data.roomID][data.topic].noResponse.length;
        const totalCount = yesCount + noCount + noResponseCount;
        if (totalCount === playerCount) {
            if (yesCount > noCount && yesCount > noResponseCount) {
                io.to(data.roomID).emit("VOTE_RESULT playAgain", { topic: data.topic, result: true });
            } else {
                io.to(data.roomID).emit("VOTE_RESULT playAgain", { topic: data.topic, result: false });
            }
            delete votes[data.roomID][data.topic];
        }
    });
};

const kickVote = (io, socket) => {
    socket.on("VOTE_SUBMIT kick", (data) => {


    });
};

export {
    playAgainVote,
    kickVote
}