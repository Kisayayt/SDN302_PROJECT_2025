import multer from "multer";
import SalaryLevelModel from "../models/SalaryLevelSchema.mjs";
import UserModel from "../models/UserSchema.mjs";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import bcrypt from "bcryptjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadDir = path.join(__dirname, "../uploads");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

export const uploadAvatar = upload.single("avatar");

export const createUser = async (req, res) => {
  try {
    const {
      name,
      username,
      password,
      email,
      phone_number,
      role,
      department_id,
      salary_level_id,
      employee_role,
      gender,
    } = req.body;

    const avatar = req.file ? `/uploads/${req.file.filename}` : null;

    const newUser = new UserModel({
      name,
      username,
      password,
      email,
      phone_number,
      role,
      department_id,
      salary_level_id,
      employee_role,
      gender,
      avatar,
    });

    await newUser.save();
    res.json({ message: "User created successfully", user: newUser });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getOneUser = async (req, res) => {
  try {
    const user = await UserModel.findById(req.params.id).populate(
      "department_id salary_level_id"
    );
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ user });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

export const deleteUserByAdmin = async (req, res) => {
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

export const getUserDetailsByAdmin = async (req, res) => {
  try {
    const user = await UserModel.findById(req.params.id).populate(
      "department_id salary_level_id"
    );
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ user });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

export const updateUserfromAdmin = async (req, res) => {
  try {
    const {
      name,
      username,
      password,
      email,
      phone_number,
      role,
      department_id,
      salary_level_id,
      employee_role,
      gender,
    } = req.body;

    // Tạo object cập nhật dữ liệu
    let updatedData = {
      name,
      username,
      email,
      phone_number,
      role,
      department_id,
      salary_level_id,
      employee_role,
      gender,
    };

    // Kiểm tra nếu có mật khẩu mới thì mã hóa trước khi lưu
    if (password) {
      const salt = await bcrypt.genSalt(10);
      updatedData.password = await bcrypt.hash(password, salt);
    }

    // Nếu có file avatar mới thì cập nhật
    if (req.file) {
      updatedData.avatar = `/uploads/${req.file.filename}`;
    }

    // Cập nhật user trong database
    const user = await UserModel.findByIdAndUpdate(req.params.id, updatedData, {
      new: true,
      runValidators: true,
    }).populate("department_id salary_level_id");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "User updated successfully", user });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    let { page = 1, limit = 10, search = "" } = req.query;
    page = parseInt(page);
    limit = parseInt(limit);

    const searchFilter = search
      ? { name: { $regex: search, $options: "i" } }
      : {};

    const users = await UserModel.find(searchFilter)
      .populate("department_id salary_level_id")
      .skip((page - 1) * limit)
      .limit(limit);

    const totalUsers = await UserModel.countDocuments(searchFilter);
    const totalPages = Math.ceil(totalUsers / limit);

    res.json({ users, totalUsers, totalPages, currentPage: page });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

export const getUserById = async (req, res) => {
  try {
    const user = await UserModel.findById(req.params.id).populate(
      "department_id salary_level_id"
    );
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const salaryHistory = await SalaryLevelModel.find({
      user_id: user._id,
    }).populate("salary_level_id");
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

export const userProfile = async (req, res) => {
  try {
    console.log(req.user);

    // Kiểm tra xem req.user và req.user.id có tồn tại không
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "Thiếu thông tin người dùng" });
    }

    // Đảm bảo id hợp lệ trước khi query
    const user = await UserModel.findById(req.user.id).populate(
      "department_id salary_level_id"
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ user });
  } catch (e) {
    console.error("Lỗi khi lấy thông tin người dùng:", e);
    res.status(500).json({ message: "Lỗi server" });
  }
};
