import { request } from "express";
import SalaryLevelModel from "../models/SalaryLevelSchema.mjs";

export const getSalary = async (req, res) => {
    try {
        const salary = await SalaryLevelModel.find(); 
        res.json({
            message: "successful",
            
            salary,
          });
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
}

export const getOneSalary = async (req, res) => {
    try {
        const onesalary = await SalaryLevelModel.findById(req.params.id);
        res.json({
            message: "successful",
            onesalary, 
        });
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
}