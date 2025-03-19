import express from "express";
import {
  createSalary,
  deleteSalary,
  getAllTheSalary,
  getOneSalary,
  getSalary,
  updateSalary,
} from "../controller/salaryController.mjs";

const SalaryRouter = express.Router();

SalaryRouter.get("/getSalary", getSalary);
SalaryRouter.get("/getOneSalary/:id", getOneSalary);
SalaryRouter.put("/updateSalary/:id", updateSalary);
SalaryRouter.delete("/deleteSalary/:id", deleteSalary);
SalaryRouter.post("/create", createSalary);

SalaryRouter.get("/get-all-salary", getAllTheSalary);

export default SalaryRouter;
