import express from "express";
import {
  createOneDepartment,
  deleteOneDepartment,
  getAllDepartments,
  getOneDepartment,
  updateDepartment,
} from "../controller/departmentController.mjs";

const departmentRouter = express.Router();

departmentRouter.get("/get-all", getAllDepartments);
departmentRouter.post("/create", createOneDepartment);
departmentRouter.delete("/delete/:id", deleteOneDepartment);
departmentRouter.get("/get-one/:id", getOneDepartment);
departmentRouter.put("/update/:id", updateDepartment);
export default departmentRouter;
