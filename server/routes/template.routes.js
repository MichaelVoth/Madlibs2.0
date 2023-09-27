import { Router } from "express";
import {
  createTemplate,
  getAllTemplates,
  // deleteAllTemplates,
  getTemplateById,
  deleteTemplateById,
  updateTemplateById,
} from "../controllers/template.controller.js";
const templateRouter = Router(); // create a new router

templateRouter.get("api/template/all", getAllTemplates);
templateRouter.get("api/template/:templateId/view", getTemplateById)
templateRouter.post("api/template/new", createTemplate);
templateRouter.put("api/template/:templateId/edit", updateTemplateById);
templateRouter.delete("api/template/:templateId/delete", deleteTemplateById)
// templateRouter.delete("/delete/all", deleteAllTemplates);

export default templateRouter;
