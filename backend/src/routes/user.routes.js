import express from "express";
import {
  createAvatar,
  createUser,
  loginUser,
  logoutUser,
} from "../controller/user.controller.js";
import { verifyJwt } from "../middleware/auth.midlleware.js";
import { upload } from "../middleware/multer.middleware.js";

const userRouter = express.Router();

userRouter.route("/").post(createUser);

// upload only avatar image
userRouter.route("/").patch(upload.single("avatar"), createAvatar);

userRouter.route("/login").post(loginUser);

userRouter.route("/logout").post(verifyJwt, logoutUser);

export { userRouter };
