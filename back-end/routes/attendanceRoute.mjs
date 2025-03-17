import express from "express";
import {
  checkIn,
  checkOut,
  getAttendanceByUser,
  reportAttendance,
} from "../controller/attendanceController.mjs";
import authMiddleware from "../middleware/authMiddleware.mjs"; 

const attendanceRouter = express.Router();

attendanceRouter.post("/check-in", authMiddleware, checkIn);

attendanceRouter.post("/check-out", authMiddleware, checkOut);

attendanceRouter.get("/user/:user_id", authMiddleware, getAttendanceByUser);

attendanceRouter.get("/report", authMiddleware, reportAttendance);

export default attendanceRouter;