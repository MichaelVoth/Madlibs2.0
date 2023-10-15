import mongoose from "mongoose";

const TemplateSchema = new mongoose.Schema({

  title: { 
    type: String, 
    required: [true, "Title is required"],
    maxlength: [30, "Limit title to 30 characters"]
  },
  body: {
    type: String,
    required: [true, "Body text is required"],
    minLength: [100, "Body text must be at least 100 characters"],
    maxLength: [1500, "Limit body text to 1500 characters"],
    validate: {
      validator: function (value) {
        return /\{[^}]+\}/.test(value);
      },
      message: 'The string must include words surrounded by { and }',
    },
  },
  summary: {
    type: String,
    required: [true, "Summary is required"],
    maxLength: [150, "Limit summary to 150 characters"]
  },
  prompts: [{
    type: String,
    required: true
  }],
  authorID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Author",
    required: true
  },
  rating: {
    average: { // average rating
      type: Number,
      default: 0
    },
    count: { // number of ratings
      type: Number,
      default: 0
    }
  },
  tags: [{
    type: String
  }],
  views: { // number of times this template has been viewed
    type: Number,
    default: 0
  },
  isFeatured: {
    type: Boolean,
    default: false
  }

}, { timestamps: true });

const TemplateModel = mongoose.model("Template", TemplateSchema);
export default TemplateModel;
