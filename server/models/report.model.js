import mongoose from "mongoose";

const ReportedSchema = new mongoose.Schema({
    templateID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Template",
        required: [true, "Reference to the reported Madlib template is required"]
    },
    reportingUserID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "Reference to the reporting user is required"]
    },
    reason: {
        type: String,
        required: [true, "Reason for the report is required"],
        maxlength: [500, "Limit reason to 500 characters"]
    },
    additionalComments: {
        type: String,
        maxlength: [1000, "Limit additional comments to 1000 characters"]
    },
    status: {
        type: String,
        enum: ["Pending", "Reviewed", "Resolved"],
        default: "Pending"
    },
    reviewedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    resolutionComments: {
        type: String,
        maxlength: [1000, "Limit resolution comments to 1000 characters"]
    }
}, { timestamps: true });

const Reported = mongoose.model("Reported", ReportedSchema);
export default Reported;
