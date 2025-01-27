import { Router } from "express";
import { UploadData } from "../../controllers/dashboard/uploadData.controller";
import multer from "multer";
import { AuthController } from "../../controllers/dashboard/auth.controller";
import { UsersRoles } from "../../utils/types/enums";

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });
router.post(
  "/",
  AuthController.allowedto([UsersRoles.Admin]),
  upload.single("file"),
  UploadData.uploadData
);

export default router;
