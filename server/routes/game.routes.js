import { Router } from "express";
import GameController from "../controllers/game.controller.js";
import authMiddleware from "../middleware/auth.js";

const gameRouter = Router();

gameRouter.post("/create", authMiddleware, GameController.createGame);
gameRouter.post("/response/:gameID", authMiddleware, GameController.recordResponse);
gameRouter.post('/complete/:gameID', authMiddleware, GameController.completeGame);
gameRouter.get("/all", authMiddleware, GameController.getAllGames);
gameRouter.get("/:gameID/room/:roomID/user/:userID", authMiddleware, GameController.getUserPrompts);
gameRouter.get("/:gameID", authMiddleware, GameController.getGameByID);
gameRouter.delete("/delete/:gameID", authMiddleware, GameController.deleteGame);

export default gameRouter;