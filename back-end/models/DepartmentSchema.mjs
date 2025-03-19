import mongoose from "mongoose";

const DepartmentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    parent_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Department",
    },
    status: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

DepartmentSchema.virtual("users", {
  ref: "User",
  localField: "_id",
  foreignField: "department_id",
});

DepartmentSchema.virtual("children", {
  ref: "Department",
  localField: "_id",
  foreignField: "parent_id",
});

DepartmentSchema.set("toObject", { virtuals: true });
DepartmentSchema.set("toJSON", { virtuals: true });

const DepartmentModel = mongoose.model(
  "Department",
  DepartmentSchema,
  "Departments"
);

export default DepartmentModel;
