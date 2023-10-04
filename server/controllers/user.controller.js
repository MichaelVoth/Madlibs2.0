import User from "../models/user.model.js";
import { UserClass } from "../../client/src/classes/user.class.js";
import { hashPassword, checkPassword, generateJWT } from "../utils/login-functions.js";


const registerUser = async (req, res) => {
    try {
        const newUser = new User({...req.body, isActive: true}); // req.body is the user object from the client
        const validationError = newUser.validateSync(); // validateSync() is a mongoose method that validates the data in the newUser object against the UserSchema

        if (validationError) { // if there is a validation error, return a 400 response with the errors
            const errors = {};
            for (const field in validationError.errors) { // loop through the errors object and add each error to the errors object we will send back to the client
                errors[field] = validationError.errors[field].message; // the error message is nested in the errors object
            }
            return res.status(400).json({ errors });
        }

        const hashedPassword = await hashPassword(req.body.password); // hash the password
        newUser.password = hashedPassword; // set the newUser's password to the hashed password
        const user = await User.create(newUser); // create the user in the database and set the isActive property to true
        const token = generateJWT({ id: user._id, username: user.username });
        res.cookie('token', token, { httpOnly: true, maxAge: 3600000 }); // 1 hour expiration
        const userInstance = new UserClass(user._id, user.username, user.avatar, token);
        return res.json({ user: userInstance, token });

    } catch (err) {
        console.error("Detailed Error:", err); // Log the error in detail
        return res.status(500).json({ message: "Server error", error: err.message || "Unknown error" });
    }
}

const loginUser = async (req, res) => {
    try {
        const user = await User.findOne({ username: req.body.username }); // find the user by username
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const isPasswordValid = await checkPassword(req.body.password, user.password); // check if the password is valid
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid password" });
        }
        const token = generateJWT({ id: user._id, username: user.username });
        await User.findOneAndUpdate({ username: req.body.username }, { isActive: true }); // set the user's isActive property to true

        // Instantiate the UserClass object with the retrieved attributes
        const userInstance = new UserClass(
            user._id,
            user.username,
            user.avatar,
            user.email,
            user.isActive,
            user.notifications || [],
            user.friends || [],
            user.activeFriends || [],
            user.accountStatus || 'active'
        );
        console.log("User Instance:", userInstance);
        res.cookie('token', token, { httpOnly: true, maxAge: 3600000 }); // 1 hour expiration
        return res.json({ user: userInstance, token }) // send the UserClass object and token back to the client

    } catch (err) {
        console.error("Detailed Error:", err); // Log the error in detail
        return res.status(500).json({ message: "Server error", error: err.message || "Unknown error" });
    }
};

const logoutUser = async (req, res) => {
    await User.findOneAndUpdate({ username: req.body.username }, { isActive: false }); // set the user's isActive property to false
    res.cookie('token', '', { expires: new Date(0) });
    return res.json({ message: "Logged out successfully" });
};


const getAllUsers = async (req, res) => {
    try {
        const allUsers = await User.find(); // find all users in the database
        return res.json(allUsers);
    } catch (err) {
        return res.status(500).json({ message: "Server error", error: err });
    }
}

const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.userId); // find the user by id
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        return res.json(user);
    } catch (error) {
        return res.status(500).json({ message: "Server error", error });
    }
}

const updateUserById = async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate( // find the user by id and update it
            req.params.userId,
            req.body,
            { new: true, runValidators: true }
        );
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        return res.json(user); // send the updated user back to the client
    } catch (error) {
        return res.status(500).json({ message: "Server error", error });
    }
}

const deleteUserById = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.userId); // find the user by id and delete it
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        return res.json(user);
    } catch (error) {
        return res.status(500).json({ message: "Server error", error });
    }
}

const deleteAllUsers = async (req, res) => {
    try {
        const users = await User.deleteMany(); // delete all users in the database
        return res.json(users); 
    } catch (error) {
        return res.status(500).json({ message: "Server error", error });
    }
}

export {
    registerUser,
    loginUser,
    logoutUser,
    getAllUsers,
    getUserById,
    updateUserById,
    deleteUserById,
    deleteAllUsers
};

