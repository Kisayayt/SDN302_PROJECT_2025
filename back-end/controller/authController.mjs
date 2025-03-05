import UserModel from "../models/UserSchema.mjs";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
  const {
    username,
    password,
    role,
    name,
    email,
    phone_number,
    gender,
    employee_role,
    department_id,
    salary_level_id,
  } = req.body;
  let user = await UserModel.findOne({ email });
  let usernameExist = await UserModel.findOne({ username });
  if (usernameExist) {
    return res.status(400).json({ message: "Username already exists" });
  }

  if (user) {
    return res.status(400).json({ message: "Email user already exists" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  user = new UserModel({
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

  await user.save();
  res.status(201).json({ message: "User created successfully", user: user });
  try {
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

export const Login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await UserModel.findOne({ username }).populate(
      "department_id salary_level_id"
    );
    // console.log(user);
    if (!user) {
      return res.status(400).json({ message: "Username not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Password is incorrect" });
    }
    console.log(process.env.JWT_SECRET);

    const token = jwt.sign(
      { id: user._id, role: user.role, name: user.name },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );
    console.log(token);
    res.cookie("token", token, {
      httpOnly: true, // Chặn truy cập từ JavaScript
      secure: true, // Chỉ dùng HTTPS
      sameSite: "Strict", // Chống CSRF
      maxAge: 3600000, // Hết hạn sau 1h
    });

    res.json({
      message: "Login successful",
      user: { id: user._id, role: user.role },
    });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

export const checkAuth = async (req, res) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    res.json({ id: decoded.id, role: decoded.role });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};
