import Template from "../models/template.model.js";
import { pullPromptsFromText } from "../utils/gameFunctions.js";

const createTemplate = async (req, res) => {
  try {
    const newTemplate = new Template(req.body); // req.body is the template object from the client
    const validationError = newTemplate.validateSync(); // validateSync() is a mongoose method that validates the data in the newTemplate object against the TemplateSchema

    if (validationError) { // if there is a validation error, return a 400 response with the errors
      const errors = {};
      for (const field in validationError.errors) {
        errors[field] = validationError.errors[field].message;
      }
      return res.status(400).json({ errors });
    }

    const prompts = pullPromptsFromText(req.body.body); // pull the prompts from the template body
    const postObj = { ...req.body, prompts }; // create a new object with the prompts array and the rest of the template object
    const newMadlib = await Template.create(postObj); // create the template in the database
    return res.json(newMadlib); // send the new template back to the client
  } catch (err) {
    return res.status(500).json({ message: "Server error", error: err }); // if there is an error, return a 500 response with the error
  }
};

const getAllTemplates = async (req, res) => {
  try {
    const allTemplates = await Template.find(); // find all templates in the database
    return res.json(allTemplates);
  } catch (err) {
    return res.status(500).json({ message: "Server error", error: err });
  }
};

const getTemplateById = async (req, res) => {
  try {
    const template = await Template.findById(req.params.templateId); // find the template by id
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
    const objectToUpdate = req.body; // req.body is the template object from the client
    const updatedPrompts = pullPromptsFromText(objectToUpdate.body); // pull the prompts from the template body
    objectToUpdate.prompts = updatedPrompts; // add the prompts array to the object to update

    const template = await Template.findByIdAndUpdate( // find the template by id and update it
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

const deleteAllTemplates = async (req, res) => {
  try {
    const deletedTemplates = await Template.deleteMany();
    return res.json({ message: "All templates deleted", data: deletedTemplates });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error });
  }
};

export {
  createTemplate,
  getAllTemplates,
  getTemplateById,
  deleteTemplateById,
  deleteAllTemplates,
  updateTemplateById,
};
