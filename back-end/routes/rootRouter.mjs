import express from "express";
import authRouter from "./authRouter.mjs";
import userRouter from "./userRouter.mjs";
import SalaryRouter from "./salaryRouter.mjs";
import attendanceRouter from "./attendanceRouter.mjs";
import departmentRouter from "./departmentRouter.mjs";
import userAttendanceRouter from "./userAttendanceRouter.mjs";

const rootRouter = express.Router();

rootRouter.use("/auth", authRouter);
rootRouter.use("/users", userRouter);
rootRouter.use("/salary", SalaryRouter);
rootRouter.use("/attendance", attendanceRouter);
rootRouter.use("/attendance-by-user", userAttendanceRouter);
rootRouter.use("/departments", departmentRouter);

export default rootRouter;
