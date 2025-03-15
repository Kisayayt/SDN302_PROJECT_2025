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

export const updateSalary = async (req, res) => {
    try {
        const { id } = req.params;
        const { level_name, salary_coefficient, monthly_salary, daily_salary } = req.body;

        // Kiểm tra xem bản ghi có tồn tại không
        const salaryLevel = await SalaryLevelModel.findById(id);
        if (!salaryLevel) {
            return res.status(404).json({ message: "Salary level not found" });
        }

        // Cập nhật thông tin mới
        const updatedSalary = await SalaryLevelModel.findByIdAndUpdate(
            id,
            { level_name, salary_coefficient, monthly_salary, daily_salary },
            { new: true } // Trả về bản ghi sau khi cập nhật
        );

        res.status(200).json({ message: "Salary level updated successfully", updatedSalary });
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
}

export const deleteSalary = async (req, res) => {
    try {
        const { id } = req.params;
        const salaryLevel = await SalaryLevelModel.findByIdAndDelete(id);
        if (!salaryLevel) {
            return res.status(404).json({ message: "Salary level not found" });
        }
        res.json({
            message: "delete successful",
            salaryLevel, 
        });
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
}