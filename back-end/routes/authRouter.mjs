import express from "express";
import { Login, register } from "../controller/authController.mjs";
import authMiddleware from "../middleware/authMiddleware.mjs";

const authRouter = express.Router();

authRouter.post("/register", register);
authRouter.post("/login", Login);

export default authRouter;
