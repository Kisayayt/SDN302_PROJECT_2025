import express from "express";
import {
  checkIn,
  checkOut,
  getAttendanceByUser,
  getAttendanceStatus,
  getHistoryAttendance,
  reportAttendance,
} from "../controller/attendanceController.mjs";
import authMiddleware from "../middleware/authMiddleware.mjs";
import { userProfile } from "../controller/userController.mjs";

const userAttendanceRouter = express.Router();

userAttendanceRouter.post("/check-in", authMiddleware, checkIn);

userAttendanceRouter.post("/check-out", authMiddleware, checkOut);
userAttendanceRouter.get("/status", authMiddleware, getAttendanceStatus);

userAttendanceRouter.get("/user/:user_id", authMiddleware, getAttendanceByUser);

userAttendanceRouter.get("/report", authMiddleware, reportAttendance);

userAttendanceRouter.get("/get-profile", authMiddleware, userProfile);
userAttendanceRouter.get("/history", authMiddleware, getHistoryAttendance);
export default userAttendanceRouter;
