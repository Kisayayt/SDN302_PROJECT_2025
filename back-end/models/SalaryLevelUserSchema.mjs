import mongoose from "mongoose";

const SalaryLevelUserSchema = new mongoose.Schema(
  {
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    salary_level_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SalaryLevel",
    },
    start_date: { type: Date, required: true },
    end_date: { type: Date, required: true },
  },
  {
    timestamps: true,
  }
);

const SalaryLevelUserModel = mongoose.model(
  "SalaryLevelUser",
  SalaryLevelUserSchema,
  "Salary_level_user"
);
