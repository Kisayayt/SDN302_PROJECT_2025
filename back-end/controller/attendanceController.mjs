import UserAttendanceModel from "../models/UserAttendanceSchema.mjs";

export const checkIn = async (req, res) => {
  try {
    const { user_id } = req.body;
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
    const { user_id } = req.body;
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
    const endDate = month && year ? new Date(new Date(startDate).setMonth(startDate.getMonth() + 1)) : null;

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
    const endDate = new Date(new Date(startDate).setMonth(startDate.getMonth() + 1));

    const attendance = await UserAttendanceModel.aggregate([
      { $match: { time: { $gte: startDate, $lt: endDate } } },
      {
        $group: {
          _id: "$user_id",
          valid_days: { $sum: { $cond: [{ $eq: ["$status", "Present"] }, 1, 0] } },
          overtime_hours: { $sum: "$overtimeHours" },
          leave_days: { $sum: { $cond: [{ $eq: ["$status", "Leave"] }, 1, 0] } },
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