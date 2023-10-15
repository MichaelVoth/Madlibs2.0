

class GameClass {
    constructor(template, players) {
        this.template = template;
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
        const promptsWithIndex = prompts.map((prompt, index) => ({
            prompt: prompt,
            originalIndex: index
        }));
        const shuffledPrompts = this.shufflePrompts(promptsWithIndex);
        shuffledPrompts.forEach((promptObj, index) => {
            const player = this.players[index % this.players.length];
            if (!player.promptsAssigned) player.promptsAssigned = [];
            player.promptsAssigned.push({
                prompt: promptObj.prompt,
                response: null,
                originalIndex: promptObj.originalIndex,
            });
        });
    }

    // Record a player's response to a prompt
    recordResponse(playerID, prompt, response) {
        const player = this.players.find(player => player.user === playerID); // Find the player
        if (player) { 
            const promptObj = player.promptsAssigned.find(p => p.prompt === prompt); // Find the prompt
            if (promptObj) { 
                promptObj.response = response; // Record the response
            }
        }
    }

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
            // Optionally, you can also check if the game can be completed after reassigning
            this.completeGame();
        }
    }

    // Reassign incomplete prompts from inactive players to active players
    reassignIncompletePrompts() {
        const incompletePrompts = [];
        this.players.forEach(player => {
            if (player.playerStatus === "inactive" && !this.hasPlayerCompleted(player)) {
                const playerIncompletePrompts = player.promptsAssigned.filter(promptObj => promptObj.response === null);
                incompletePrompts.push(...playerIncompletePrompts);
            }
        });
        const activePlayers = this.players.filter(player => player.playerStatus === "active");
        incompletePrompts.forEach((promptObj, index) => {
            const player = activePlayers[index % activePlayers.length];
            player.promptsAssigned.push(promptObj);
        });
    }

    // Reassemble the prompts in their original order upon completion
    reassemblePrompts() {
        const allPrompts = this.players.flatMap(player => player.promptsAssigned);
        const sortedPrompts = allPrompts.sort((a, b) => a.originalIndex - b.originalIndex);
        const finalPrompts = sortedPrompts.map(p => ({ prompt: p.prompt, response: p.response }));
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
