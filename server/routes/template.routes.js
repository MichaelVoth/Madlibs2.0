import { Router } from "express";
import TemplateController from "../controllers/template.controller.js";
import authMiddleware from "../middleware/auth.js";

const templateRouter = Router();

templateRouter.post("/create", authMiddleware, TemplateController.createTemplate);
templateRouter.get("/all", authMiddleware, TemplateController.getAllTemplates);
templateRouter.get("/:id", authMiddleware, TemplateController.getTemplateById);
templateRouter.get("/author/:authorID", authMiddleware, TemplateController.getTemplatesByAuthor);
templateRouter.get("/tag/:tag", authMiddleware, TemplateController.getTemplatesByTag);
templateRouter.get("/rating/:rating", authMiddleware, TemplateController.getTemplatesByRating);
templateRouter.get("views/:views", authMiddleware, TemplateController.getTemplatesByViews);
templateRouter.get("/random", authMiddleware, TemplateController.getRandomTemplate);

templateRouter.put("/update/:id", authMiddleware, TemplateController.updateTemplate);

templateRouter.delete("/delete/:id", authMiddleware, TemplateController.deleteTemplate);
templateRouter.delete("delete/auth/:authorID", authMiddleware, TemplateController.deleteTemplatesByAuthor);


export default templateRouter;
