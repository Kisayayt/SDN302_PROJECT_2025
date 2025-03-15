import express from "express";
import authRouter from "./authRouter.mjs";
import userRouter from "./userRouter.mjs";

const rootRouter = express.Router();

rootRouter.use("/auth", authRouter);
rootRouter.use("/users", userRouter);

export default rootRouter;
