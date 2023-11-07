import EventEmitter from 'events'; // Import events module
const voteEvents = new EventEmitter();

const playAgainVotes = {};

const playAgainVote = (io, socket, roomManagerInstance) => {
    socket.on("VOTE_SUBMIT playAgain", (data) => {
        try {
            console.log("VOTE_SUBMIT HIT!")
            if (!playAgainVotes[data.roomID]) { // If room doesn't exist in votes object, create it
                playAgainVotes[data.roomID] = { "yes": [], "no": [], "noResponse": [] };
            }
            
            // Check if the user has already voted
            const hasVoted = ["yes", "no", "noResponse"].some(voteType => {
                return playAgainVotes[data.roomID][voteType].some(voter => voter.id === data.user.id);
            });

            // If the user has already voted, return early and do not process the vote again
            if (hasVoted) {
                return;
            }

            if (data.vote === true) {
                playAgainVotes[data.roomID].yes.push(data.user); // Add user to yes votes
            } else if (data.vote === false) {
                playAgainVotes[data.roomID].no.push(data.user); // Add user to no votes
            } else {
                playAgainVotes[data.roomID].noResponse.push(data.user); // Add user to no response votes
            }
            const playerCount = roomManagerInstance.getUsersInRoom(data.roomID).length;
            const totalVotes = playAgainVotes[data.roomID].yes.length + playAgainVotes[data.roomID].no.length + playAgainVotes[data.roomID].noResponse.length;

            if (playerCount === totalVotes) {
                voteEvents.emit('PLAY_AGAIN_VOTE_COMPLETE', playAgainVotes[data.roomID], data.roomID, data.gameID); // Emit custom event
                delete playAgainVotes[data.roomID];
            }
        }
        catch (err) {
            console.log("vote.events playAgainVote():", err);
        }
    });
};


const kickVote = (io, socket) => {
    socket.on("VOTE_SUBMIT kick", (data) => {
        const kickVotes = {};
        const playerCount = roomManagerInstance.getUsersInRoom(data.roomID).length;
        if (!kickVotes[data.roomID]) { // If room doesn't exist in votes object, create it
            kickVotes[data.roomID] = {};
        }
        if (!kickVotes[data.roomID][data.topic]) { // If topic doesn't exist in votes object, create it
            kickVotes[data.roomID][data.topic] = { "yes": [], "no": [], "noResponse": [] };
        }
        ['yes', 'no', 'noResponse'].forEach((vote) => {
            const index = kickVotes[data.roomID][data.topic][data.vote].indexOf(data.user);
            if (index !== -1) { // If user is in other votes
                kickVotes[data.roomID][data.topic][data.vote].splice(index, 1); // Remove user from other votes
            }
        });
        if (data.vote === true) {
            kickVotes[data.roomID][data.topic].yes.push(data.user);
        } else if (data.vote === false) {
            kickVotes[data.roomID][data.topic].no.push(data.user);
        } else {
            kickVotes[data.roomID][data.topic].noResponse.push(data.user);
        }
        const yesCount = kickVotes[data.roomID][data.topic].yes.length;
        const noCount = kickVotes[data.roomID][data.topic].no.length;
        const noResponseCount = kickVotes[data.roomID][data.topic].noResponse.length;
        const totalCount = yesCount + noCount + noResponseCount;
        if (totalCount === playerCount) {
            if (yesCount > noCount && yesCount > noResponseCount) {
                io.to(data.roomID).emit("VOTE_RESULT kick", { topic: data.topic, result: true });
            } else {
                io.to(data.roomID).emit("VOTE_RESULT kick", { topic: data.topic, result: false });
            }
            delete kickVotes[data.roomID][data.topic];
        }
    });
};

export {
    voteEvents,
    playAgainVote,
    kickVote
}