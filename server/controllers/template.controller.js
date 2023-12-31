import TemplateClass from '../classes/template.class.js';
import Template from '../models/template.model.js';

class TemplateController {

  // Create a new template
  static async createTemplate(req, res) {
    try {
      const { title, body, summary, authorID, tags } = req.body;
      const template = new TemplateClass(title, body, summary, authorID, tags);
      template.extractPromptsFromBody(template.body);
      const savedTemplate = await Template.create(template);
      res.status(201).json(savedTemplate);
    } catch (error) {
      console.log("Error:",error);
      res.status(500).json({ message: 'Error creating template', error });
    }
  }

  // Get all templates
  static async getAllTemplates(req, res) {
    try {
      const templates = await Template.find();
      res.status(200).json(templates);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching templates', error });
    }
  }

  // Get a template by ID
  static async getTemplateById(req, res) {
    try {
      const template = await Template.findById(req.params.id);
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
      const templates = await Template.find({ authorID: req.params.authorID });
      res.status(200).json(templates);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching templates', error });
    }
  }

  // Get all templates by tag
  static async getTemplatesByTag(req, res) {
    try {
      const templates = await Template.find({ tags: req.params.tag });
      res.status(200).json(templates);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching templates', error });
    }
  }

  // Get all templates by rating
  static async getTemplatesByRating(req, res) {
    try {
      const templates = await Template.find({ rating: { $gte: req.params.rating } });
      res.status(200).json(templates);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching templates', error });
    }
  }

  // Get all templates by views
  static async getTemplatesByViews(req, res) {
    try {
      const templates = await Template.find({ views: { $gte: req.params.views } });
      res.status(200).json(templates);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching templates', error });
    }
  }

  // Get a random template
  static async getRandomTemplate(req, res) {
    try {
      const templates = await Template.find();
      const randomIndex = Math.floor(Math.random() * templates.length);
      res.status(200).json(templates[randomIndex]);
    } catch (error) {
      console.log("Error:",error);
      res.status(500).json({ message: 'Error fetching template', error });
    }
  }

  // Update a template
  static async updateTemplate(req, res) {
    try {
      const { title, body, summary, tags } = req.body;
      let template = await Template.findById(req.params.id);
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
      const template = await Template.findByIdAndDelete(req.params.id);
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
      const templates = await Template.deleteMany({ authorID: req.params.authorID });
      res.status(200).json({ message: 'Templates deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error deleting templates', error });
    }
  }

}

export default TemplateController;
