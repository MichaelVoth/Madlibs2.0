import { Router } from "express";
import GameController from "../controllers/game.controller.js";
import authMiddleware from "../middleware/auth.js";

const gameRouter = Router();

gameRouter.post("/create/:roomID", authMiddleware, GameController.createGame);
gameRouter.put("/response/:gameID/room/:roomID/user/:userID", authMiddleware, GameController.recordResponse);
gameRouter.put("/inactive/:gameID/room/:roomID/user/:userID", authMiddleware, GameController.inactiveUser);
gameRouter.get('/complete/:gameID/room/:roomID', authMiddleware, GameController.completeGame);
gameRouter.get("/all", authMiddleware, GameController.getAllGames);
gameRouter.get("/prompts/:gameID/room/:roomID/user/:userID", authMiddleware, GameController.getUserPrompts);
gameRouter.get("/:gameID", authMiddleware, GameController.getGameByID);
gameRouter.delete("/delete/:gameID", authMiddleware, GameController.deleteGame);

export default gameRouter;