import mongoose from "mongoose";

import DepartmentModel from "./DepartmentSchema.mjs";
import SalaryLevelModel from "./SalaryLevelSchema.mjs";

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    phone_number: {
      type: String,
      required: true,
    },
    gender: {
      type: String,
      required: true,
    },
    employee_role: {
      type: String,
      required: true,
    },
    department_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Department",
    },
    salary_level_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SalaryLevel",
    },
  },
  {
    timestamps: true,
  }
);

const UserModel = mongoose.model("User", UserSchema, "Users");

export default UserModel;
