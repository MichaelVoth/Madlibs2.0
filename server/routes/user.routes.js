import { Router } from "express";
import {
    createUser,
    getAllUsers,
    getUserById,
    updateUserById,
    deleteUserById,
    loginUser,
    logoutUser,
} from "../controllers/user.controller.js";
const userRouter = Router(); // create a new router

userRouter.get("/api/users", getAllUsers);                  // Get all users
userRouter.get("/api/users/:userId", getUserById);          // Get a specific user by ID
userRouter.post("/api/users", createUser);                  // Create a new user
userRouter.put("/api/users/:userId", updateUserById);       // Update a user by ID
userRouter.delete("/api/users/:userId", deleteUserById);    // Delete a user by ID
userRouter.post("/api/users/login", loginUser);             // User login
userRouter.post("/api/users/logout", logoutUser);           // User logout


export default userRouter;
