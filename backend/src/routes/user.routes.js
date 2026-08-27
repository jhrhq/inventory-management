import express from "express";
import { createUser } from "../controller/user.controller.js";

const userRouter = express.Router();

userRouter.route("/").post(createUser);

export { userRouter };
