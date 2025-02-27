import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
const connect = () => {
  mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => {
      console.log("Kết nối tới MongoDB thành công!");
    })
    .catch((err) => {
      console.error("Kết nối MongoDB thất bại:", err.message);
    });
};

export default connect;
