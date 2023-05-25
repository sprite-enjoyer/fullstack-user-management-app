import { Router } from "express"
import { blockUser, deleteUser, login, register, sendJWT } from "./user.controller.js";

const userRouter = Router();

userRouter.post("/register", register, sendJWT);
userRouter.post("/login", login, sendJWT);
userRouter.delete("/delete", deleteUser);
userRouter.patch("/block", blockUser);


export default userRouter;