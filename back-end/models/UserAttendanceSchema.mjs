import mongoose from "mongoose";

import UserModel from "./UserSchema.mjs";

const UserAttendanceSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    time: Date,
    type: { type: String, enum: ["in", "out"] },
    status: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const UserAttendanceModel = mongoose.model(
  "UserAttendance",
  UserAttendanceSchema,
  "User_attendances"
);

export default UserAttendanceModel;
