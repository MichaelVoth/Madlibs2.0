import TemplateClass from '../classes/template.class.js';
import TemplateModel from '../models/template.model.js';

class TemplateController {

  // Create a new template
  static async createTemplate(req, res) {
    try {
      const { title, body, summary, authorID, tags } = req.body;
      const prompts = TemplateClass.extractPromptsFromBody(body);
      const template = new TemplateClass(title, body, summary, prompts, authorID, tags);
      const savedTemplate = await TemplateModel.create(template);
      res.status(201).json(savedTemplate);
    } catch (error) {
      res.status(500).json({ message: 'Error creating template', error });
    }
  }

  // Get all templates
  static async getAllTemplates(req, res) {
    try {
      const templates = await TemplateModel.find();
      res.status(200).json(templates);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching templates', error });
    }
  }

  // Get a template by ID
  static async getTemplateById(req, res) {
    try {
      const template = await TemplateModel.findById(req.params.id);
      if (!template) {
        return res.status(404).json({ message: 'Template not found' });
      }
      res.status(200).json(template);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching template', error });
    }
  }

  // Get all templates by author
  static async getTemplatesByAuthor(req, res) {
    try {
      const templates = await TemplateModel.find({ authorID: req.params.authorID });
      res.status(200).json(templates);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching templates', error });
    }
  }

  // Get all templates by tag
  static async getTemplatesByTag(req, res) {
    try {
      const templates = await TemplateModel.find({ tags: req.params.tag });
      res.status(200).json(templates);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching templates', error });
    }
  }

  // Get all templates by rating
  static async getTemplatesByRating(req, res) {
    try {
      const templates = await TemplateModel.find({ rating: { $gte: req.params.rating } });
      res.status(200).json(templates);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching templates', error });
    }
  }

  // Get all templates by views
  static async getTemplatesByViews(req, res) {
    try {
      const templates = await TemplateModel.find({ views: { $gte: req.params.views } });
      res.status(200).json(templates);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching templates', error });
    }
  }

  // Get a random template
  static async getRandomTemplate(req, res) {
    try {
      const templates = await TemplateModel.find();
      const randomIndex = Math.floor(Math.random() * templates.length);
      res.status(200).json(templates[randomIndex]);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching template', error });
    }
  }

  // Update a template
  static async updateTemplate(req, res) {
    try {
      const { title, body, summary, tags } = req.body;
      let template = await TemplateModel.findById(req.params.id);
      if (!template) {
        return res.status(404).json({ message: 'Template not found' });
      }
      template.updateTemplate(title, body, summary, tags);
      const updatedTemplate = await template.save();
      res.status(200).json(updatedTemplate);
    } catch (error) {
      res.status(500).json({ message: 'Error updating template', error });
    }
  }

  // Delete a template
  static async deleteTemplate(req, res) {
    try {
      const template = await TemplateModel.findByIdAndDelete(req.params.id);
      if (!template) {
        return res.status(404).json({ message: 'Template not found' });
      }
      res.status(200).json({ message: 'Template deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error deleting template', error });
    }
  }

  //Delete all templates by authorID
  static async deleteTemplatesByAuthor(req, res) {
    try {
      const templates = await TemplateModel.deleteMany({ authorID: req.params.authorID });
      res.status(200).json({ message: 'Templates deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error deleting templates', error });
    }
  }

}

export default TemplateController;
