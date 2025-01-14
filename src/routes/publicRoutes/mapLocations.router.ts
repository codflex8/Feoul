import { Router } from "express";
import { PublicMapLocations } from "../../controllers/public/mapLocations.controller";

const router = Router();

router.get("/", PublicMapLocations.getMapLocations);

export default router;
