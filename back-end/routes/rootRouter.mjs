import express from "express";
import authRouter from "./authRouter.mjs";

const rootRouter = express.Router();

rootRouter.use("/auth", authRouter);

export default rootRouter;
