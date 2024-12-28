import { Router } from "express";
import { EmployeeController } from "../controllers/employee.controller";
import { upload } from "../middleware/uploadFiles";
import { validateData } from "../middleware/validationMiddleware";
import { addEmpolyeeValidator } from "../utils/validators/EmployeeValidator";
import expressAsyncHandler from "express-async-handler";

const empolyeeRouter = Router();

empolyeeRouter.post(
  "/",
  upload.single("image"),
  validateData(addEmpolyeeValidator),
  expressAsyncHandler(EmployeeController.addEmployee)
);
empolyeeRouter.get("/", expressAsyncHandler(EmployeeController.getEmployees));
empolyeeRouter.delete(
  "/:id",
  expressAsyncHandler(EmployeeController.deleteEmployee)
);
export default empolyeeRouter;
