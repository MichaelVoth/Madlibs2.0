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

userRouter.get("/api/users", authMiddleware, getAllUsers);                  // Get all users
userRouter.get("/api/users/:userId", authMiddleware, getUserById);          // Get a specific user by ID
userRouter.post("/api/register", registerUser);                                 // Create a new user
userRouter.put("/api/users/:userId", authMiddleware, updateUserById);       // Update a user by ID
userRouter.delete("/api/users/:userId", authMiddleware, deleteUserById);    // Delete a user by ID
userRouter.post("/api/users/login", loginUser);                            // User login
userRouter.post("/api/users/logout", logoutUser);                            // User logout


export default userRouter;
