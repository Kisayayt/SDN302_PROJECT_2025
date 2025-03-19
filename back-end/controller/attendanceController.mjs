import { request } from "express";
import UserAttendanceModel from "../models/UserAttendanceSchema.mjs";

export const getAttendance = async (req, res) => {
  try {
    let { page = 1, limit = 10 } = req.query;
    page = parseInt(page);
    limit = parseInt(limit);

    // 📌 Lấy danh sách chấm công với phân trang
    const attendanceAll = await UserAttendanceModel.find()
      .populate("user_id", "name email") // Lấy thông tin người dùng
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ time: -1 }); // Sắp xếp theo thời gian mới nhất

    const totalRecords = await UserAttendanceModel.countDocuments();
    const totalPages = Math.ceil(totalRecords / limit);

    res.json({
      message: "findAll",
      attendanceAll,
      totalRecords,
      totalPages,
      currentPage: page,
    });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

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
};

export const checkIn = async (req, res) => {
  try {
    const user_id = req.user.id;
    console.log(req.user); // Lấy userId từ token
    const attendance = new UserAttendanceModel({
      user_id,
      time: new Date(),
      type: "in",
      status: "Present",
    });
    await attendance.save();
    res.status(201).json({ message: "Check-in successful", attendance });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

export const checkOut = async (req, res) => {
  try {
    const user_id = req.user.id; // Lấy userId từ token
    const attendance = new UserAttendanceModel({
      user_id,
      time: new Date(),
      type: "out",
      status: "Present",
    });
    await attendance.save();
    res.status(201).json({ message: "Check-out successful", attendance });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

export const getAttendanceByUser = async (req, res) => {
  try {
    const { user_id } = req.params;
    const { month, year } = req.query;

    const startDate = month && year ? new Date(`${year}-${month}-01`) : null;
    const endDate =
      month && year
        ? new Date(new Date(startDate).setMonth(startDate.getMonth() + 1))
        : null;

    const query = { user_id };
    if (startDate && endDate) {
      query.time = { $gte: startDate, $lt: endDate };
    }

    const attendance = await UserAttendanceModel.find(query).sort({ time: 1 });
    res.json(attendance);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

export const reportAttendance = async (req, res) => {
  try {
    const { month, year } = req.query;
    const startDate = new Date(`${year}-${month}-01`);
    const endDate = new Date(
      new Date(startDate).setMonth(startDate.getMonth() + 1)
    );

    const attendance = await UserAttendanceModel.aggregate([
      { $match: { time: { $gte: startDate, $lt: endDate } } },
      {
        $group: {
          _id: "$user_id",
          valid_days: {
            $sum: { $cond: [{ $eq: ["$status", "Present"] }, 1, 0] },
          },
          overtime_hours: { $sum: "$overtimeHours" },
          leave_days: {
            $sum: { $cond: [{ $eq: ["$status", "Leave"] }, 1, 0] },
          },
        },
      },
      {
        $lookup: {
          from: "Users",
          localField: "_id",
          foreignField: "_id",
          as: "user",
        },
      },
      { $unwind: "$user" },
    ]);

    res.json(attendance);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

export const getAttendanceStatus = async (req, res) => {
  try {
    const userId = req.user.id; // Lấy userId từ token

    const latestAttendance = await UserAttendanceModel.findOne({
      user_id: userId,
    })
      .sort({ time: -1 })
      .exec();

    res.json({ isCheckedIn: latestAttendance?.type === "in" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Lỗi server khi kiểm tra trạng thái check-in" });
  }
};

export const getHistoryAttendance = async (req, res) => {
  try {
    const userId = req.user.id; // Lấy userId từ token
    const history = await UserAttendanceModel.find({ user_id: userId }).sort({
      time: -1,
    });
    res.json(history);
  } catch (error) {
    res.status(500).json({ message: "Lỗi server khi lấy lịch sử dụng" });
  }
};
