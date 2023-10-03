import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, "Username is required"],
        unique: true,
        trim: true,
        minlength: [2, "Username must be at least 2 characters long"],
        maxlength: [30, "Username can't exceed 30 characters"]
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        minlength: [8, "Password must be at least 8 characters long"]
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        trim: true,
        lowercase: true,
        match: [/\S+@\S+\.\S+/, "Please provide a valid email address"]
    },
    avatar: {
        type: String,
        default: "yellow"
    },
    isActive: {
        type: Boolean,
        default: false
    },
    createdMadlibs: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Template"
    }],
    savedMadlibs: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Template"
    }],
    gamesPlayed: [{
        type: Number,
        default: 0
    }],
    friends: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],
    friendRequests: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],
    sentFriendRequests: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],
    notifications: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Notification"
    }],
    isAdmin: {
        type: Boolean,
        default: false
    },
    lastLogin: {
        type: Date,
        default: Date.now
    },
    accountStatus: {
        type: String,
        enum: ["Active", "Suspended", "Deactivated"],
        default: "Active"
    },
    bio: {
        type: String,
        maxlength: [200, "Bio can't exceed 200 characters"]
    }
}, { timestamps: true });

const User = mongoose.model("User", UserSchema);

export default User;
