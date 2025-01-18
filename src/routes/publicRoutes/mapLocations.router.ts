import { Router } from "express";
import { PublicMapLocations } from "../../controllers/public/mapLocations.controller";
import expressAsyncHandler from "express-async-handler";

const router = Router();

router.get("/", expressAsyncHandler(PublicMapLocations.getMapLocations));

export default router;
