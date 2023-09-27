import { Router } from "express";
import authMiddleware from '../middleware/auth.js';
import {
    registerUser,
    getAllUsers,
    getUserById,
    updateUserById,
    deleteUserById,
    loginUser,
    logoutUser,
} from "../controllers/user.controller.js";
const userRouter = Router(); // create a new router

userRouter.get("/all", authMiddleware, getAllUsers);
userRouter.get("/:userId", authMiddleware, getUserById);
userRouter.post("/register", registerUser);
userRouter.put("/:userId", authMiddleware, updateUserById);
userRouter.delete("/:userId", authMiddleware, deleteUserById);
userRouter.post("/login", loginUser);
userRouter.post("/logout", logoutUser);


export default userRouter;
