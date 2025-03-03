import mongoose from "mongoose";
import UserModel from "./UserSchema.mjs";

const PayrollSchema = new mongoose.Schema(
  {
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    salary_received: { type: Number, required: true },
    valid_days: { type: Number, required: true },
    invalid_days: { type: Number, required: true },
    salary_coefficient: { type: Number, required: true },
  },
  {
    timestamps: true,
  }
);

const PayrollModel = mongoose.model("Payroll", PayrollSchema, "Payrolls");

export default PayrollModel;
