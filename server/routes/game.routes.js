import { Router } from "express";
import GameController from "../controllers/game.controller";
import authMiddleware from "../middleware/auth";

const gameRouter = Router();

gameRouter.post("/create", authMiddleware, GameController.createGame);
gameRouter.post("/response/:gameID", authMiddleware, GameController.recordResponse);
gameRouter.post('/complete/:gameID', authMiddleware, GameController.completeGame);
gameRouter.get("/all", authMiddleware, GameController.getAllGames);
gameRouter.get("/:gameID", authMiddleware, GameController.getGameByID);
gameRouter.delete("/delete/:gameID", authMiddleware, GameController.deleteGame);

export default gameRouter;