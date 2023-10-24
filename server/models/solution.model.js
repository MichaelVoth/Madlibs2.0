import mongoose from "mongoose";

const SolutionSchema = new mongoose.Schema({
    templateID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Template",
        required: [true, "Reference to the Madlib template is required"]
    },

    title: {
        type: String,
        required: [true, "Title for the completed Madlib is required"],
        maxlength: [50, "Limit title to 50 characters"]
    },

    contributors: [{ // Array of users who have contributed to the solution and whether they have favorited it
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: [true, "Reference to the user is required"],
            isSaved: {
                type: Boolean,
                default: false
            },
            isFavorited: {
                type: Boolean,
                default: false
            }
        }
    }],

    filledPrompts: [{
        prompt: {
            type: String,
            required: [true, "Prompt text is required"]
        },
        response: {
            type: String,
            required: [true, "Response text is required"]
        },
    }],

    completedText: { // The completed Madlib text with responses replacing prompts
        type: String,
        required: [true, "Completed Madlib text is required"]
    },

    comments: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: [true, "Reference to the user is required"]
        },
        text: {
            type: String,
            required: [true, "Comment text is required"]
        },
        createdAt: {
            type: Date,
            default: Date.now
        }
    }],

    likes: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: [true, "Reference to the user is required"]
        }
    }],
    dislikes: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: [true, "Reference to the user is required"]
        }
    }]

}, { timestamps: true });

const Solution = mongoose.model("Solution", SolutionSchema);
export default Solution;
