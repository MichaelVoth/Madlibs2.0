import User from "../models/user.model.js";
import { UserClass } from "../classes/user.class.js";
import { hashPassword, checkPassword, generateJWT } from "../utils/loginFunctions.js";

class UserController {
    // Register a new user
    static async registerUser(req, res) {
        try {
            const newUser = new User({...req.body, isActive: true});
            const validationError = newUser.validateSync();

            if (validationError) {
                const errors = {};
                for (const field in validationError.errors) {
                    errors[field] = validationError.errors[field].message;
                }
                return res.status(400).json({ errors });
            }

            const hashedPassword = await hashPassword(req.body.password);
            newUser.password = hashedPassword;
            const user = await User.create(newUser);
            const socketID = req.body.socketID;
            const token = generateJWT({ id: user._id, username: user.username });
            res.cookie('token', token, { httpOnly: true, maxAge: 3600000 });

            const userInstance = new UserClass(
                user._id,
                socketID,
                user.username,
                user.avatar,
                user.isActive,
                user.email,
                user.notifications || [],
                user.friends || [],
                user.activeFriends || [],
                user.accountStatus || 'active'
            );
            return res.json({ user: userInstance, token });

        } catch (err) {
            console.error("Detailed Error:", err);
            return res.status(500).json({ message: "Server error", error: err.message || "Unknown error" });
        }
    }
    // Login an existing user
    static async loginUser(req, res) {
        try {
            const user = await User.findOne({ username: req.body.username });
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }

            const isPasswordValid = await checkPassword(req.body.password, user.password);
            if (!isPasswordValid) {
                return res.status(401).json({ message: "Invalid password" });
            }
            const token = generateJWT({ id: user._id, username: user.username });
            await User.findOneAndUpdate({ username: req.body.username }, { isActive: true });

            const socketID = req.body.socketID;

            const userInstance = new UserClass(
                user._id,
                socketID,
                user.username,
                user.avatar,
                user.isActive,
                user.email,
                user.notifications || [],
                user.friends || [],
                user.activeFriends || [],
                user.accountStatus || 'active'
            );
            res.cookie('token', token, { httpOnly: true, maxAge: 3600000 });
            return res.json({ user: userInstance, token });

        } catch (err) {
            console.error("Detailed Error:", err);
            return res.status(500).json({ message: "Server error", error: err.message || "Unknown error" });
        }
    }
    // Logout a user
    static async logoutUser(req, res) {
        await User.findOneAndUpdate({ username: req.body.username }, { isActive: false }); 
        res.cookie('token', '', { expires: new Date(0) });
        return res.json({ message: "Logged out successfully" });
    }
    // Get all users
    static async getAllUsers(req, res) {
        try {
            const allUsers = await User.find();
            return res.json(allUsers);
        } catch (err) {
            return res.status(500).json({ message: "Server error", error: err });
        }
    }
    // Get a user by id
    static async getUserById(req, res) {
        try {
            const user = await User.findById(req.params.userId);
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }
            return res.json(user);
        } catch (error) {
            return res.status(500).json({ message: "Server error", error });
        }
    }
    // Update a user by id
    static async updateUserById(req, res) {
        try {
            const user = await User.findByIdAndUpdate(
                req.params.userId,
                req.body,
                { new: true, runValidators: true }
            );
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }
            return res.json(user);
        } catch (error) {
            return res.status(500).json({ message: "Server error", error });
        }
    }
    // Delete a user by id
    static async deleteUserById(req, res) {
        try {
            const user = await User.findByIdAndDelete(req.params.userId);
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }
            return res.json(user);
        } catch (error) {
            return res.status(500).json({ message: "Server error", error });
        }
    }
    // Delete all users
    static async deleteAllUsers(req, res) {
        try {
            const users = await User.deleteMany();
            return res.json(users); 
        } catch (error) {
            return res.status(500).json({ message: "Server error", error });
        }
    }

}

export default UserController;
