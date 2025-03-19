// authMiddleware.js - đã sửa
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer")) {
      return res.status(401).json({ message: "Unauthorized" }); // Thêm return ở đây
    }

    const token = authHeader.split(" ")[1];
    console.log(token);
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return res
          .status(403)
          .json({ message: "Token không hợp lệ hoặc đã hết hạn" });
      }

      // Đảm bảo decoded.id là một ObjectId hợp lệ

      req.user = decoded;
      next();
    });
  } catch (error) {
    return res.status(500).json({ message: "Lỗi xử lý xác thực" });
  }
};

export default authMiddleware;
