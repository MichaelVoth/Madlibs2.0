import Game from "../models/game.model.js";

class GameClass {
    constructor(template, players, roomID) {
        this.gameID = null;
        this.template = template;
        this.roomID = roomID
        this.players = players || []; 
        // {user: playerID, 
        //      playerStatus: "active",
        //      promptsAssigned: []
        //          prompt:
        //          response: null, 
        //      timeTaken: 0, 
        //      finishTime: null}
        this.duration = 0;
        this.completed = false;
        this.filledPrompts = null;
        this.gameStatus = "notStarted";
        this.gamesInSuccession = 0;
        this.reports = [];
    }

    // Start the game
    async startGame() {
        this.assignPrompts(this.template.prompts); // Assign prompts to players
        this.gameStatus = "inProgress";
        this.startTime = Date.now();
        const game = new Game({
            templateID: this.template._id,
            roomID: this.roomID,
            players: this.players,
        });
        this.gameID = game._id;
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

    //Get prompts for a specific user
    getUserPrompts(playerID) {
        const player = this.players.find(player => player.userID === playerID); // Find the player
        if (!player) {
            console.error("Player not found");
            return false;
        }
        const prompts = player.promptsAssigned; // Get the player's prompts
        return prompts;
    }

    // Record a player's response to a prompt
    recordResponse(playerID, originalIndex, response) {
        try {
            const player = this.players.find(player => player.userID === playerID); // Find the player
            const promptObj = player.promptsAssigned.find(promptObj => promptObj.originalIndex === originalIndex); // Find the prompt
            if (!promptObj) {
                console.error("Prompt not found for given originalIndex");
                return false;
            }
            promptObj.response = response; // Record the response
            promptObj.timeTaken = Date.now() - this.startTime; // Record the time taken to respond

            return this.hasPlayerCompleted(player); // Return true if the player has completed all their prompts
        } catch (err) {
            console.error(err);
            return false; // Return false in case of any error
        }
    }

    userFinished(playerID) {
        const player = this.players.find(player => player.userID === playerID); // Find the player
        if (!player) {
            console.error("Player not found");
            return false;
        }
        player.finishTime = (Date.now() - this.startTime) / 1000; // Record the time the player finished
        player.status = "completed"; // Mark the player as completed
        return this.hasPlayerCompleted(player); // Return true if the player has completed all their prompts
    }

    // Check if a player has completed all their prompts
    hasPlayerCompleted(player) {
        return player.promptsAssigned.every(promptObj => promptObj.response !== null); // returns true if all responses are not null
    }

    // Check if all players have completed all their prompts
    allUsersFinished() {
        return this.players.every(player => this.hasPlayerCompleted(player)); // returns true if all players have completed all their prompts
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
        this.filledPrompts = this.reassemblePrompts();
    }

    // Abandon the game
    static async abandonGame(gameID) {
        try {
            const game = await Game.findOne({ _id: gameID });
            game.gameStatus = "abandoned";
            await game.save();
            return game;
        }
        catch (err) {
            console.error(err);
            return false;
        }
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
