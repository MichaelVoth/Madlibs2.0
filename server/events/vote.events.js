import EventEmitter from 'events'; // Import events module
const voteEvents = new EventEmitter();

const playAgainVote = (io, socket, roomManagerInstance) => {
    const playAgainVotes = {};
    socket.on("VOTE_SUBMIT playAgain", (data) => {
        console.log("vote.events playAgainVote() data:", data); 
        console.log("User:", data.user);
        try {
        if (!playAgainVotes[data.roomID]) { // If room doesn't exist in votes object, create it
            playAgainVotes[data.roomID] = { "yes": [], "no": [], "noResponse": [] };
        }
        // ['yes', 'no', 'noResponse'].forEach((vote) => { // For each vote type
        //     const index = playAgainVotes[data.roomID][data.vote].indexOf(data.user); // Check if user is in other votes
        //     if (index !== -1) { // If user is in other votes
        //         playAgainVotes[data.roomID][data.vote].splice(index, 1); // Remove user from other votes
        //     }
        // });
        if (data.vote === true) {
            playAgainVotes[data.roomID].yes.push(data.user);
        } else if (data.vote === false) {
            playAgainVotes[data.roomID].no.push(data.user);
        } else {
            playAgainVotes[data.roomID].noResponse.push(data.user);
        }

        const playerCount = roomManagerInstance.getUsersInRoom(data.roomID).length;
        const totalVotes = playAgainVotes[data.roomID].yes.length + playAgainVotes[data.roomID].no.length + playAgainVotes[data.roomID].noResponse.length;
    
        console.log(playAgainVotes[data.roomID])

        if (playerCount === totalVotes) {
            voteEvents.emit('PLAY_AGAIN_VOTE_COMPLETE', playAgainVotes[data.roomID]); // Emit custom event
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