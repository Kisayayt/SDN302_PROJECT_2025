import express from "express";
import authRouter from "./authRouter.mjs";
import userRouter from "./userRouter.mjs";
import SalaryRouter from "./salaryRouter.mjs";

const rootRouter = express.Router();

rootRouter.use("/auth", authRouter);
rootRouter.use("/users", userRouter);
rootRouter.use("/salary", SalaryRouter);


export default rootRouter;
