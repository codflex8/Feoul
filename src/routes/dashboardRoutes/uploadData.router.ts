import { Router } from "express";
import { UploadData } from "../../controllers/dashboard/uploadData.controller";
import multer from "multer";

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });
router.post("/", upload.single("file"), UploadData.uploadData);

export default router;
