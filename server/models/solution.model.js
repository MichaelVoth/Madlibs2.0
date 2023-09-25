import mongoose from "mongoose";

const SolutionSchema = new mongoose.Schema({
    templateID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Template",
        required: [true, "Reference to the Madlib template is required"]
    },
    userID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "Reference to the user is required"]
    },
    filledPrompts: [{
        type: String,
        required: [true, "Filled prompts are required"]
    }],
    completedText: {
        type: String,
        required: [true, "Completed Madlib text is required"]
    },
    title: {
        type: String,
        required: [true, "Title for the completed Madlib is required"],
        maxlength: [50, "Limit title to 50 characters"]
    },
    isFavorite: {
        type: Boolean,
        default: false
    },
    createdWith: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],
    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment"
    }]
}, { timestamps: true });

const Solution = mongoose.model("Solution", SolutionSchema);
export default Solution;
