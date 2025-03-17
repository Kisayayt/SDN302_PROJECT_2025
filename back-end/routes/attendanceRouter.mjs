import express from "express";
import { getAttendance, getOneAtten } from "../controller/attendanceController.mjs";

const attendanceRouter = express.Router();

attendanceRouter.get("/getAttendance", getAttendance);
attendanceRouter.get("/getOneAttendance/:id", getOneAtten);

export default attendanceRouter;