import Game from "../models/game.model.js";
import GameClass from "../classes/game.class.js";
import TemplateClass from "../classes/template.class.js";
import TemplateController from "./template.controller.js";
import TemplateModel from "../models/template.model.js";
import RoomController from "./room.controller.js";

class GameController {

    static async createGame(req, res) {
        try {
            const template = await GameController.getRandomTemplate();
            const roomManagerInstance = req.app.get('roomManagerInstance')
            const roomID = req.body.roomID;
            const players = await roomManagerInstance.getUsersInRoom(roomID);
            const gameInstance = new GameClass(template, players, roomID);
            gameInstance.startGame();
            const game = new Game(gameInstance);
            await game.save();
            const gameID = game._id;
            roomManagerInstance.addGameToRoom(roomID, gameInstance, gameID);
            res.status(201).json(game); // Return the game
        } catch (err) {
            console.log(err);
        }
    }

    // Get a random template
    static async getRandomTemplate() {
        try {
            const templates = await TemplateModel.find();
            const randomIndex = Math.floor(Math.random() * templates.length);
            return templates[randomIndex];
        } catch (error) {
            console.log("Error:", error);
            throw new Error('Error fetching random template');
        }
    }

    static async recordResponse(req, res) {
        try {
            const roomManagerInstance = req.app.get('roomManagerInstance');
            const game = await roomManagerInstance.getGame(req.params.roomID, req.params.gameID);
            game.recordResponse(req.body.userID, req.body.originalIndex, req.body.response);
            await roomManagerInstance.updateGame(game);
            res.status(200).json(game);
        }
        catch (err) {
            console.log(err);
            res.status(500).json(err);
        }
    }

    static async getUserPrompts(req, res) {
        try {
            const roomManagerInstance = req.app.get('roomManagerInstance');
            const game = await roomManagerInstance.getGame( req.params.roomID, req.params.gameID);
            const userPrompts = game.getUserPrompts(req.params.userID);
            res.status(200).json(userPrompts);
        }
        catch (err) {
            console.log(err);
            res.status(500).json(err);
        }
    }

    static async completeGame(req, res) {
        try {
            const game = await Game.findOne({ _id: req.params.gameID });
            game.gameInstance.completeGame();
            await game.save();
            const completedMadlib = TemplateClass.renderMadlib(game.gameInstance.template, game.gameInstance.responses);
            res.status(200).json(completedMadlib);
        }
        catch (err) {
            console.log(err);
            res.status(500).json(err);
        }
    }

    static async abandonGame(req, res) {
        try {
            const game = await Game.findOne({ _id: req.params.gameID });
            game.gameInstance.abandonGame();
            await game.save();
            res.status(200).json(game);
        }
        catch (err) {
            res.status(500).json(err);
        }
    }

    static async getGameByID(req, res) {
        try {
            const game = await Game.findOne({ _id: req.params.gameID });
            console.log("Game Found: ", game);
            res.status(200).json(game);
        }
        catch (err) {
            res.status(500).json(err);
        }
    }

    static async getAllGames(req, res) {
        try {
            const games = await Game.find();
            res.status(200).json(games);
        }
        catch (err) {
            res.status(500).json(err);
        }
    }

    static async getGamesByRoom(req, res) {
        try {
            const games = await Game.find({ roomID: req.params.roomID });
            res.status(200).json(games);
        }
        catch (err) {
            res.status(500).json(err);
        }
    }

    static async getGamesByTemplate(req, res) {
        try {
            const games = await Game.find({ templateID: req.params.templateID });
            res.status(200).json(games);
        }
        catch (err) {
            res.status(500).json(err);
        }
    }

    static async deleteGame(req, res) {
        try {
            const game = await Game.findOne({ _id: req.params.gameID });
            await game.delete();
            res.status(200).json(game);
        }
        catch (err) {
            res.status(500).json(err);
        }
    }

};
export default GameController;