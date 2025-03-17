import express from "express";
import authRouter from "./authRouter.mjs";
import userRouter from "./userRouter.mjs";
import SalaryRouter from "./salaryRouter.mjs";
import attendanceRouter from "./attendanceRouter.mjs"

const rootRouter = express.Router();

rootRouter.use("/auth", authRouter);
rootRouter.use("/users", userRouter);
rootRouter.use("/salary", SalaryRouter);
rootRouter.use("/attendance", attendanceRouter);

export default rootRouter;
