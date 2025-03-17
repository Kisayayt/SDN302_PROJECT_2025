import { request } from "express";
import UserAttendanceModel from "../models/UserAttendanceSchema.mjs"

export const getAttendance = async (req, res) => {
    try {
        const attendanceAll = await UserAttendanceModel.find();
        res.json({
            message: "findAll",
            attendanceAll,
        });
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
}

export const getOneAtten = async (req, res) => {
    try {
        const oneAtten = await UserAttendanceModel.findById(req.params.id);
        res.json({
            message: "successful",
            oneAtten, 
        });
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
}