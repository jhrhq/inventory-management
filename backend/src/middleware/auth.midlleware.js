import jwt from "jsonwebtoken";
import { User } from "../models/user.models.js";
import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const verifyJwt = asyncHandler(async (req, _res, next) => {
  try {
    /**
     * get the cookie from req || get the cookie from cookie header
     * throw error on no token found
     * verify cookie by decoding cookie
     * get the user from db using cookie user id
     * throw error on no user;
     * add user to req
     *
     */
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      throw new ApiError(401, "Unauthorized request");
    }

    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    const user = await User.findById(decodedToken._id).select(
      "-password -refreshToken",
    );

    if (!user) {
      throw new ApiError(401, "Invalid access token");
    }

    req.user = user;
    next();
  } catch (error) {
    throw new ApiError(401, error.message || "Unauthorized request");
  }
});

export { verifyJwt };
