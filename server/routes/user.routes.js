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
    deleteAllUsers
} from "../controllers/user.controller.js";

const userRouter = Router(); // create a new router

userRouter.get("/verify-token", authMiddleware, (req, res) => {
    res.status(200).send({ valid: true });
});
userRouter.get("/all", getAllUsers);
userRouter.get("/:userId", authMiddleware, getUserById);
userRouter.post("/register", registerUser);
userRouter.put("/:userId", authMiddleware, updateUserById);
userRouter.delete("/:userId", authMiddleware, deleteUserById);
userRouter.post("/login", loginUser);
userRouter.post("/logout", logoutUser);

userRouter.delete("/delete/all", deleteAllUsers);

export default userRouter;
