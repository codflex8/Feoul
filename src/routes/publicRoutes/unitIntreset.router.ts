import { Router } from "express";
import expressAsyncHandler from "express-async-handler";
import { PublicUnitIntresets } from "../../controllers/public/unitIntreset.controller";

const router = Router();

router.post("/", expressAsyncHandler(PublicUnitIntresets.createUnitIntresert));

export default router;
