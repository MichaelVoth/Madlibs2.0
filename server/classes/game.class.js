

class GameClass {
    constructor(template, players, roomID) {
        this.template = template;
        this.roomID = roomID
        this.players = players || []; // {user: playerID, playerStatus: "active", promptsAssigned: [], timeTaken: 0, finishTime: null}
        this.duration = 0;
        this.completed = false;
        this.solution = null;
        this.gameStatus = "inProgress";
        this.gamesInSuccession = 0;
        this.reports = [];
    }

    // Add a player to the game
    addPlayer(player) {
        this.players.push(player);
    }

    // Remove a player from the game
    removePlayer(playerID) {
        this.players = this.players.filter(player => player.user !== playerID);
    }

    // Start the game
    startGame() {
        this.assignPrompts(template.prompts); // Assign prompts to players
        this.gameStatus = "inProgress";
        this.startTime = Date.now();
    }

    // Shuffle the prompts using the Fisher-Yates algorithm
    shufflePrompts(prompts) {
        for (let i = prompts.length - 1; i > 0; i--) { // i is the index of the prompt to be shuffled
            const j = Math.floor(Math.random() * (i + 1)); // j is the index of the prompt to be swapped with
            [prompts[i], prompts[j]] = [prompts[j], prompts[i]]; // Swap the prompts
        }
        return prompts;
    }

    // Distribute prompts among all players in the game
    assignPrompts(prompts) {
        // Assign originalIndex to each prompt before shuffling
        const promptsWithIndex = prompts.map((prompt, index) => ({ // {prompt: "prompt", originalIndex: 0}
            prompt: prompt,
            originalIndex: index
        }));
        const shuffledPrompts = this.shufflePrompts(promptsWithIndex); // Shuffle the prompts
        shuffledPrompts.forEach((promptObj, index) => { // Assign prompts to players
            const player = this.players[index % this.players.length]; // Assign prompts in a round-robin fashion
            if (!player.promptsAssigned) player.promptsAssigned = []; // Initialize promptsAssigned if it doesn't exist
            player.promptsAssigned.push({ // Add the prompt to the player's promptsAssigned array
                prompt: promptObj.prompt,
                response: null,
                originalIndex: promptObj.originalIndex,
            });
        });
    }

    // Record a player's response to a prompt
    recordResponse(playerID, prompt, response) {
        try {
        const player = this.players.find(player => player.user === playerID); // Find the player
            try {
                const promptObj = player.promptsAssigned.find(promptObj => promptObj.prompt === prompt); // Find the prompt
                promptObj.response = response; // Record the response
                promptObj.timeTaken = Date.now() - this.startTime; // Record the time taken
                if (this.hasPlayerCompleted(player)) { // Check if the player has completed all their prompts
                    player.playerStatus = "completed"; // Mark the player as completed
                    player.finishTime = Date.now(); // Record the finish time
                    const allPlayersCompleted = this.players.every(this.hasPlayerCompleted); // Check if all players have completed all their prompts
                    if (allPlayersCompleted) { // If all players have completed all their prompts
                        this.completeGame(); // Complete the game
                    }
                }
            } catch (err) {
                console.log(err);
            }
    } catch (err) {
        console.log(err);
    }}

    // Check if a player has completed all their prompts
    hasPlayerCompleted(player) {
        return player.promptsAssigned.every(promptObj => promptObj.response !== null); // returns true if all responses are not null
    }

    // Mark a player as inactive
    markPlayerInactive(playerID) {
        const player = this.players.find(player => player.user === playerID);
        if (player) {
            player.playerStatus = "inactive";
        }
    }

    // Check for inactive players periodically
    checkForInactivePlayers() {
        this.players.forEach(player => {
            if (player.timeTaken >= 30) {
                this.markPlayerInactive(player.user);
            }
        });
    }

    // This function can be called whenever a player's status changes to "inactive"
    handleInactivePlayer(player) {
        if (player.playerStatus === "inactive") {
            this.reassignIncompletePrompts();
        }
    }

    // Reassign incomplete prompts from inactive players to active players
    reassignIncompletePrompts() {
        const incompletePrompts = [];
        this.players.forEach(player => { // Find all incomplete prompts from inactive players
            if (player.playerStatus === "inactive" && !this.hasPlayerCompleted(player)) { // If the player is inactive and has not completed all their prompts
                const playerIncompletePrompts = player.promptsAssigned.filter(promptObj => promptObj.response === null); // Find all incomplete prompts from the player
                incompletePrompts.push(...playerIncompletePrompts); // Add the incomplete prompts to the incompletePrompts array
            }
        });
        const activePlayers = this.players.filter(player => player.playerStatus === "active"); // Find all active players
        incompletePrompts.forEach((promptObj, index) => { // Reassign the incomplete prompts to active players
            const player = activePlayers[index % activePlayers.length]; // Assign prompts in a round-robin fashion
            player.promptsAssigned.push(promptObj); // Add the prompt to the player's promptsAssigned array
        });
    }

    // Reassemble the prompts in their original order upon completion
    reassemblePrompts() {
        const allPrompts = this.players.flatMap(player => player.promptsAssigned); // Flatten the promptsAssigned arrays from all players
        const sortedPrompts = allPrompts.sort((a, b) => a.originalIndex - b.originalIndex); // Sort the prompts by their originalIndex
        const finalPrompts = sortedPrompts.map(p => ({ prompt: p.prompt, response: p.response })); // Remove the originalIndex property
        return finalPrompts;
    }

    // Complete the game
    completeGame() {
        const allPlayersCompleted = this.players.every(this.hasPlayerCompleted);
        if (!allPlayersCompleted) {
            this.reassignIncompletePrompts();
        }
        this.gameStatus = "completed";
        this.duration = (Date.now() - this.startTime) / 1000;
        this.completed = true;
        this.solution = this.reassemblePrompts();
    }

    // Abandon the game
    abandonGame() {
        this.gameStatus = "abandoned";
    }

    //Count how many games in succession a this group has played
    countGamesInSuccession() { //This might need to be reworked...
        if (this.completed) {
            this.gamesInSuccession++;
        } else {
            this.gamesInSuccession = 0;
        }
    }

    // Add a report to the game
    addReport(reportID) {
        this.reports.push(reportID);
    }
}

export default GameClass;
