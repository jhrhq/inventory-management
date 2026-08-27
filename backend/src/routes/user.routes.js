import express from "express";
import { createAvatar, createUser } from "../controller/user.controller.js";
import { upload } from "../middleware/multer.middleware.js";

const userRouter = express.Router();

userRouter.route("/").post(createUser);

// upload only avatar image
userRouter.route("/").patch(upload.single("avatar"), createAvatar);

export { userRouter };
