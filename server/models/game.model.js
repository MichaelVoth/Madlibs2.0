import mongoose from "mongoose";

const GameSchema = new mongoose.Schema({

    template: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Template",
        required: true
    },
    players: [
        {userID: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        playerStatus: {
            type: String,
            enum: ["active", "inactive", "completed"],
            default: "active",
            required: true
        },
        promptsAssigned: [{
            prompt: String,
            response: String || null
        }],
        timeTaken: {
            type: Number,
            default: 0,
            required: true
        },
        finishTime: {
            type: Date,
        },
    }],
    Duration: {
        type: Number,
        default: 0,
    },
    completed: {
        type: Boolean,
        required: true,
        default: false
    },
    solution: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Solution"
    },
    gameStatus: {
        type: String,
        enum: [ "notStarted","inProgress", "completed", "abandoned"],
        required: true,
        default: "notStarted"
    },
    gamesInSuccession: {
        type: Number,
        required: true,
        default: 0
    },
    reports: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Report"
    }]
}, { timestamps: true });

const Game = mongoose.model("Game", GameSchema);
export default Game;