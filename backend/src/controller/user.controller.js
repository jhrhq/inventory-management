import { User } from "../models/user.models.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

/**
 * TODO
 * upload avatar , cover image to cloudinary
 * From the user settings page
 */

export const createUser = asyncHandler(async (req, res) => {
  /**
   * get user details
   * validate detials
   * check if user already exists: user, email
   * create user object in db
   * remove password, refreshToken field from response
   * check for user creation
   * return response
   */
  const { username, email, fullname, password } = req.body;

  if (
    [username, email, fullname, password].some(
      (item) => !item || item.trim() === "",
    )
  ) {
    throw new ApiError(400, "Missing input fields");
  }

  const userExisted = await User.findOne({
    $or: [{ email }, { username }],
  });

  if (userExisted) {
    throw new ApiError(409, "User with email or username already exists");
  }

  const user = await User.create({
    fullname,
    username,
    email,
    password,
  });

  const createdUser = await User.findById(user._id)
    .select(" -password -refreshToken")
    .lean();

  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while creating the user");
  }

  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "User created Successfully"));
});
