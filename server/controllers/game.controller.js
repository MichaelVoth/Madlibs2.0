import Game from "../models/game.model.js";
import GameClass from "../classes/game.class.js";
import Template from "../models/template.model.js";
import SolutionClass from "../classes/solution.class.js";

class GameController {

    //Game Logic
    static async createGame(req, res) {
        try {
            const template = await GameController.getRandomTemplate();
            const roomManagerInstance = req.app.get('roomManagerInstance')
            const roomID = req.params.roomID;
            const gameInstance = new GameClass(template, roomID);
            gameInstance.createGame();
            roomManagerInstance.addGameToRoom(roomID, gameInstance, gameInstance.gameID);
            console.log("gamecontroller createGame():", gameInstance);
            console.log("RoomManagerInstance.rooms[roomID]:", roomManagerInstance.rooms[roomID]);
            res.status(201).json(gameInstance);
        } catch (err) {
            console.log("gamecontroller createGame():", err);
        }
    }

    static async getRandomTemplate() {
        try {
            const templates = await Template.find();
            const randomIndex = Math.floor(Math.random() * templates.length);
            return templates[randomIndex];
        } catch (error) {
            console.log("game.controler getRandomTemplate():", error);
            throw new Error('Error fetching random template');
        }
    }

    static async recordResponse(req, res) {
        try {
            const roomManagerInstance = req.app.get('roomManagerInstance');
            const gameInstance = await roomManagerInstance.getGame(req.params.roomID, req.params.gameID);
            gameInstance.recordResponse(req.params.userID, req.body.originalIndex, req.body.response);
            await roomManagerInstance.updateGame(req.params.roomID, req.params.gameID, gameInstance);
            res.status(200).json({ message: "Response recorded." });
        }
        catch (err) {
            console.log("game.controller recordResponse():", err);
            res.status(500).json(err);
        }
    }

    static async getUserPrompts(req, res) {
        try {
            const roomManagerInstance = req.app.get('roomManagerInstance');
            const gameInstance = await roomManagerInstance.getGame(req.params.roomID, req.params.gameID);
            const userPrompts = gameInstance.getUserPrompts(req.params.userID);
            res.status(200).json(userPrompts);
        }
        catch (err) {
            console.log("game.controller getUserPrompts():", err);
            res.status(500).json(err);
        }
    }

    static async inactiveUser(req, res) {
        try {
            const roomManagerInstance = req.app.get('roomManagerInstance');
            const gameInstance = await roomManagerInstance.getGame(req.params.roomID, req.params.gameID);
            gameInstance.markPlayerInactive(req.params.userID);
            if (gameInstance.allUsersInactive()) {
                gameInstance.abandonGame(req.params.gameID);
                await roomManagerInstance.updateGame(req.params.roomID, req.params.gameID, gameInstance);
                return res.status(200).json({ message: "All users inactive. Game abandoned." });
            } else {
                gameInstance.reassignIncompletePrompts();
                await roomManagerInstance.updateGame(req.params.roomID, req.params.gameID, gameInstance);
                res.status(200).json({ message: "User marked inactive." });
            }
        }
        catch (err) {
            console.log("game.controller inactiveUser()", err);
            res.status(500).json(err);
        }
    }

    static async completeGame(req, res) {
        try {
            const roomManagerInstance = req.app.get('roomManagerInstance');
            const gameInstance = roomManagerInstance.getGame(req.params.roomID, req.params.gameID);
            const players = gameInstance.players.map(player => player.userID);
            const solution = new SolutionClass(gameInstance.template._id, gameInstance.template.title, players, gameInstance.filledPrompts);
            await solution.createSolution();
            res.status(200).json(solution);
        }
        catch (err) {
            console.log("game.controller completeGame():", err);
            res.status(500).json(err);
        }
    }

    //CRUD
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