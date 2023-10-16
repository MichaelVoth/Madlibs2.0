import mongoose from "mongoose";

const GameSchema = new mongoose.Schema({

    templateID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Template",
        required: true
    },
    players: [
        {user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        playerStatus: {
            type: String,
            enum: ["active", "inactive", "completed"],
            required: true
        },
        promptsAssigned: [{
            prompt: String,
            response: String || null,
            required: true
        }],
        timeTaken: {
            type: Number,
            required: true
        },
        finishTime: {
            type: Date,
            required: true
        },
    }],
    Duration: {
        type: Number,
        required: true
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
        enum: [ "inProgress", "completed", "abandoned"],
        required: true,
        default: "inProgress"
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



