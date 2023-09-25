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
  prompts: [{
    type: String,
    required: true
  }],
  solutions: {
    type: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Solution"
    }]
  },
  authorID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  rating: {
    average: {
      type: Number,
      default: 0
    },
    count: {
      type: Number,
      default: 0
    }
  },
  tags: [{
    type: String
  }],
  views: {
    type: Number,
    default: 0
  },
  isFeatured: {
    type: Boolean,
    default: false
  }

}, { timestamps: true });

const Template = mongoose.model("Template", TemplateSchema);
export default Template;
