import SalaryLevelModel from "../models/SalaryLevelSchema.mjs";
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
export const getUserById = async (req, res) => {
  try {
    const user = await UserModel.findById(req.params.id).populate("department_id salary_level_id");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const salaryHistory = await SalaryLevelModel.find({ user_id: user._id }).populate("salary_level_id");
    res.json({ user, salaryHistory });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

export const updateUser = async (req, res) => {
  try {
    const {
      name,
      dateOfBirth,
      gender,
      address,
      phone_number,
      department_id,
      employee_role,
      salary_level_id,
      avatar,
    } = req.body;

    const user = await UserModel.findByIdAndUpdate(
      req.params.id,
      {
        name,
        dateOfBirth,
        gender,
        address,
        phone_number,
        department_id,
        employee_role,
        salary_level_id,
        ...(avatar && { avatar }),
      },
      { new: true, runValidators: true }
    ).populate("department_id salary_level_id");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "User updated successfully", user });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const user = await UserModel.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ message: "User deleted successfully" });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};