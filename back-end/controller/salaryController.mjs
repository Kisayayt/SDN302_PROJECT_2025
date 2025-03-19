import { request } from "express";
import SalaryLevelModel from "../models/SalaryLevelSchema.mjs";

export const getSalary = async (req, res) => {
  try {
    const { page = 1, limit = 5, search = "" } = req.query;
    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);

    // Tạo điều kiện tìm kiếm nếu có searchQuery
    const searchCondition = search
      ? { level_name: { $regex: search, $options: "i" } } // Tìm kiếm không phân biệt hoa thường
      : {};

    const totalCount = await SalaryLevelModel.countDocuments(searchCondition);
    const salaries = await SalaryLevelModel.find(searchCondition)
      .skip((pageNumber - 1) * limitNumber)
      .limit(limitNumber);

    res.json({
      message: "successful",
      totalCount,
      salaries,
    });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

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
};

export const updateSalary = async (req, res) => {
  try {
    const { id } = req.params;
    const { level_name, salary_coefficient, monthly_salary, daily_salary } =
      req.body;

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

    res
      .status(200)
      .json({ message: "Salary level updated successfully", updatedSalary });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

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
};

export const createSalary = async (req, res) => {
  try {
    console.log(req.body);

    const { level_name, salary_coefficient, monthly_salary, daily_salary } =
      req.body;

    let salary = new SalaryLevelModel({
      level_name,
      salary_coefficient,
      monthly_salary,
      daily_salary,
    });

    await salary.save();
    res.status(201).json({ message: "User created successfully", salary });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

export const getAllTheSalary = async (req, res) => {
  try {
    const allTheSalary = await SalaryLevelModel.find();
    res.json({ message: "successful", allTheSalary });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};
