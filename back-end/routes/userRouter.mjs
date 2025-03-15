import express from "express";
import { getAllUsers, updateUser} from "../controller/userController.mjs";
import { getUsersById } from "../controller/userController.mjs";
import { addUsers } from "../controller/userController.mjs";
import { deleteUser } from "../controller/userController.mjs";

const userRouter = express.Router();

userRouter.get("/get-all-users", getAllUsers);
userRouter.get("/get-users-by-id/:id", getUsersById);
userRouter.post("/add-users", addUsers);
userRouter.put("/update-users/:id", updateUser);
userRouter.delete("/delete-users/:id", deleteUser);


export default userRouter;
