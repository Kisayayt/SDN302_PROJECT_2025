import express from "express";
import {
    deleteUser,
    getAllUsers,
    getUserById,
    updateUser,
} from "../controller/userController.mjs";
import authMiddleware from "../middleware/authMiddleware.mjs";
const userRouter = express.Router();

userRouter.get("/get-all-users", getAllUsers);

userRouter.get("/:id", authMiddleware, getUserById);

userRouter.put("/:id", authMiddleware, updateUser);

userRouter.delete("/:id", authMiddleware, deleteUser);
export default userRouter;
