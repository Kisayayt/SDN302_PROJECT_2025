import UserModel from "../models/UserSchema.mjs";
import bcrypt from "bcryptjs";

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

export const getUsersById = async (req, res) => {
  try {
    const user = await UserModel.findById(req.params.id).populate("department_id").populate("salary_level_id");
    if (!user) return res.status(404).json({ message: "Cannot find employee!" });

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Error", error });
  }
};

export const addUsers = async (req, res) => {
  try {
    const { username, password, role, name, email, phone_number, gender, employee_role, department_id, salary_level_id } = req.body;

    const existingUser = await UserModel.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res.status(400).json({ message: "Username hoặc Email đã tồn tại!" });
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    
    const newUser = new UserModel({
      username,
      password: hashedPassword, 
      role,
      name,
      email,
      phone_number,
      gender,
      employee_role,
      department_id,
      salary_level_id,
    });

    await newUser.save();

    res.status(201).json({ message: "Thêm nhân viên thành công!", employee: newEmployee });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server!", error: error.message });
  }
};

export const updateUser = async (req, res) => {
  try {
      const { id } = req.params; // Lấy ID user từ params
      const { username, password, role, name, email, phone_number, gender, employee_role, department_id, salary_level_id } = req.body;

      console.log(req.body)
      // Kiểm tra quyền admin


      // Tìm user theo ID
      const user = await UserModel.findById(id);
      if (!user) {
          return res.status(404).json({ message: "Người dùng không tồn tại." });
      }

      // Nếu có mật khẩu mới thì hash lại
      let hashedPassword = user.password;
      if (password) {
          const salt = await bcrypt.genSalt(10);
          hashedPassword = await bcrypt.hash(password, salt);
      }

      // Cập nhật thông tin user
      const updatedUser = await UserModel.findByIdAndUpdate(
          id,
          {
              username,
              password: hashedPassword,
              role,
              name,
              email,
              phone_number,
              gender,
              employee_role,
              department_id,
              salary_level_id,
          },
          { new: true } // Trả về bản ghi sau khi cập nhật
      );

      res.status(200).json({ message: "Cập nhật thành công", user: updatedUser });
  } catch (error) {
      res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    await UserModel.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error", error });
  }
};