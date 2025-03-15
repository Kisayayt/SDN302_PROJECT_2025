import express from "express";
import { deleteSalary, getOneSalary, getSalary, updateSalary } from "../controller/salaryController.mjs";

const SalaryRouter = express.Router();

SalaryRouter.get("/getSalary", getSalary);
SalaryRouter.get("/getOneSalary/:id", getOneSalary);
SalaryRouter.put("/updateSalary/:id", updateSalary);
SalaryRouter.delete("/deleteSalary/:id", deleteSalary);

export default SalaryRouter;