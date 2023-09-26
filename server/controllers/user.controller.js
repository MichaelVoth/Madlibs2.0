import User from "../models/user.model";
import { hashPassword, checkPasswords, generateJWT, verifyJWT } from "../utils/server-functions";


const registerUser = async (req, res) => {
    try {
        const newUser = new User(req.body); // req.body is the user object from the client
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
        const user = await User.create(newUser); // create the user in the database
        const token = generateJWT(user); // generate a JWT for the user
        return res.json({ token }); // send the token back to the client
    } catch (err) {
        return res.status(500).json({ message: "Server error", error: err }); // if there is an error, return a 500 response with the error
    }
}

const loginUser = async (req, res) => {
    try {
        const user = await User.findOne({ username: req.body.username }); // find the user by username
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const isPasswordValid = await checkPasswords(req.body.password, user.password); // check if the password is valid
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid password" });
        }

        const token = generateJWT(user); // generate a JWT for the user
        return res.json({ token }); // send the token back to the client
    } catch (error) {
        return res.status(500).json({ message: "Server error", error });
    }
};


const logoutUser = async (req, res) => {

}

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
        return res.json(user);
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

export {
    registerUser,
    loginUser,
    logoutUser,
    getAllUsers,
    getUserById,
    updateUserById,
    deleteUserById
};

