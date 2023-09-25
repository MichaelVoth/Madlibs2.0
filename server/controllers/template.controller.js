import Template from "../models/template.model.js";
import { pullPromptsFromText } from "../utils/server-functions.js";

const createTemplate = async (req, res) => {
  try {
    const newTemplate = new Template(req.body);
    const validationError = newTemplate.validateSync();

    if (validationError) {
      const errors = {};
      for (const field in validationError.errors) {
        errors[field] = validationError.errors[field].message;
      }
      return res.status(400).json({ errors });
    }

    const prompts = pullPromptsFromText(req.body.body);
    const postObj = { ...req.body, prompts };
    const newMadlib = await Template.create(postObj);
    return res.json(newMadlib);
  } catch (err) {
    return res.status(500).json({ message: "Server error", error: err });
  }
};

const getAllTemplates = async (req, res) => {
  try {
    const allTemplates = await Template.find();
    return res.json(allTemplates);
  } catch (err) {
    return res.status(500).json({ message: "Server error", error: err });
  }
};

const getTemplateById = async (req, res) => {
  try {
    const template = await Template.findById(req.params.templateId);
    if (!template) {
      return res.status(404).json({ message: "Template not found" });
    }
    return res.json(template);
  } catch (error) {
    return res.status(500).json({ message: "Server error", error });
  }
};

const updateTemplateById = async (req, res) => {
  try {
    const objectToUpdate = req.body;
    const updatedPrompts = pullPromptsFromText(objectToUpdate.body);
    objectToUpdate.prompts = updatedPrompts;

    const template = await Template.findByIdAndUpdate(
      req.params.templateId,
      objectToUpdate,
      { new: true, runValidators: true }
    );

    if (!template) {
      return res.status(404).json({ message: "Template not found" });
    }

    return res.json(template);
  } catch (error) {
    return res.status(500).json({ message: "Server error", error });
  }
};

const deleteTemplateById = async (req, res) => {
  try {
    const deletedMadLib = await Template.findByIdAndDelete(req.params.templateId);
    if (!deletedMadLib) {
      return res.status(404).json({ message: "Template not found" });
    }
    return res.json(deletedMadLib);
  } catch (error) {
    return res.status(500).json({ message: "Server error", error });
  }
};

// const deleteAllTemplates = async (req, res) => {
//   try {
//     const deletedTemplates = await Template.deleteMany();
//     return res.json({ message: "All templates deleted", data: deletedTemplates });
//   } catch (error) {
//     return res.status(500).json({ message: "Server error", error });
//   }
// };

export {
  createTemplate,
  getAllTemplates,
  getTemplateById,
  deleteTemplateById,
  // deleteAllTemplates,
  updateTemplateById,
};
