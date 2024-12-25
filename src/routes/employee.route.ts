import { Router } from "express";
import { EmployeeController } from "../controllers/employee.controller";
import { upload } from "../middleware/uploadFiles";
import { validateData } from "../middleware/validationMiddleware";
import { addEmpolyeeValidator } from "../utils/validators/EmployeeValidator";

const empolyeeRouter = Router();

empolyeeRouter.post(
  "/",
  upload.single("image"),
  validateData(addEmpolyeeValidator),
  EmployeeController.addEmployee
);
empolyeeRouter.get("/", EmployeeController.getEmployees);
empolyeeRouter.delete("/:id", EmployeeController.deleteEmployee);
export default empolyeeRouter;
