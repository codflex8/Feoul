import { Router } from "express";
import { FinancialController } from "../../controllers/dashboard/financial.controller";
import expressAsyncHandler from "express-async-handler";

const router = Router();

router.get("/", expressAsyncHandler(FinancialController.getFinancial));

export default router;
