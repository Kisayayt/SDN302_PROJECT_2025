import express from "express";
import { getOneSalary, getSalary, updateSalary } from "../controller/salaryController.mjs";

const SalaryRouter = express.Router();

SalaryRouter.get("/getSalary", getSalary);
SalaryRouter.get("/getOneSalary/:id", getOneSalary);
SalaryRouter.get("/updateSalary/:id", updateSalary);

export default SalaryRouter;