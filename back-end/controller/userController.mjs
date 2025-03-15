import UserModel from "../models/UserSchema.mjs";

export const getAllUsers = async (req, res) => {
  try {
    let { page = 1, limit = 10 } = req.query;
    page = parseInt(page);
    limit = parseInt(limit);

    const users = await UserModel.find()
      .populate("department_id salary_level_id")
      .skip((page - 1) * limit)
      .limit(limit);

    const totalUsers = await UserModel.countDocuments();
    const totalPages = Math.ceil(totalUsers / limit);

    res.json({ users, totalUsers, totalPages, currentPage: page });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};
