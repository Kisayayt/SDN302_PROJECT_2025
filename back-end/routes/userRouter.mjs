import express from "express";
import { getAllUsers } from "../controller/userController.mjs";

const userRouter = express.Router();

userRouter.get("/get-all-users", getAllUsers);

export default userRouter;
