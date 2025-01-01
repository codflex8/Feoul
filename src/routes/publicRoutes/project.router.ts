import { Router } from "express";
import { PublicProjectController } from "../../controllers/public/project.controller";
import expressAsyncHandler from "express-async-handler";

const router = Router();

router.get("/", expressAsyncHandler(PublicProjectController.getProjects));
router.get("/:id", expressAsyncHandler(PublicProjectController.getProjectById));

export default router;
