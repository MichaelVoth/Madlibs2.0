import { Router } from "express";
import authMiddleware from '../middleware/auth.js';
import UserController from "../controllers/user.controller.js";

const userRouter = Router();

userRouter.get("/verify-token", authMiddleware, (req, res) => {
    res.status(200).send({ valid: true });
});
userRouter.get("/all", authMiddleware, UserController.getAllUsers);
userRouter.get("/:userId", authMiddleware, UserController.getUserById);

userRouter.post("/register", UserController.registerUser);

userRouter.put("/:userId", authMiddleware, UserController.updateUserById);

userRouter.delete("/:userId", authMiddleware, UserController.deleteUserById);
userRouter.delete("/delete/all", authMiddleware, UserController.deleteAllUsers);

userRouter.post("/login", UserController.loginUser);
userRouter.post("/logout", UserController.logoutUser);

export default userRouter;
