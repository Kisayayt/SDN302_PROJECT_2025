import mongoose from "mongoose";

const SalaryLevelSchema = new mongoose.Schema(
  {
    level_name: {
      type: String,
      required: true,
    },
    salary_coefficient: {
      type: Number,
      required: true,
    },
    monthly_salary: {
      type: Number,
      required: true,
    },
    daily_salary: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const SalaryLevelModel = mongoose.model(
  "SalaryLevel",
  SalaryLevelSchema,
  "Salary_levels"
);

export default SalaryLevelModel;
