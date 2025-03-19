import express from "express";
import {
  createUser,
  deleteUser,
  deleteUserByAdmin,
  getAllUsers,
  getOneUser,
  getUserById,
  getUserDetailsByAdmin,
  updateUser,
  updateUserfromAdmin,
  uploadAvatar,
  userProfile,
} from "../controller/userController.mjs";
import authMiddleware from "../middleware/authMiddleware.mjs";
const userRouter = express.Router();

userRouter.get("/get-all-users", getAllUsers);
userRouter.post("/create-user", uploadAvatar, createUser);
userRouter.put("/update-user/:id", uploadAvatar, updateUserfromAdmin);
userRouter.get("/get-one-user/:id", getOneUser);
userRouter.delete("/delete-user/:id", deleteUserByAdmin);

userRouter.get("/:id", authMiddleware, getUserById);

userRouter.put("/:id", authMiddleware, updateUser);

userRouter.delete("/:id", authMiddleware, deleteUser);

export default userRouter;
