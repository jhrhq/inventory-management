import jwt from "jsonwebtoken";
import { User } from "../models/user.models.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

/**
 * TODO
 * upload avatar , cover image to cloudinary
 * From the user settings page
 */

export const generateAccessAndRefreshToken = async (userId) => {
  /**
   * get user by using userId
   * generate accessToken using generateAccessToken method
   * generate refreshToken using generateRefreshToken method
   * add refreshToken eg: user.refreshToken = generatedRefreshToken
   * user.save() to save it in the database
   * return accessToken and refreshToken
   */
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;

    user.save({
      validateBeforeSave: false,
    });

    return { accessToken, refreshToken };
  } catch (_error) {
    throw new ApiError(
      500,
      "Something went wrong while generating access and refresh token",
    );
  }
};

const createUser = asyncHandler(async (req, res) => {
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

const createAvatar = asyncHandler((req, res) => {
  const avatarFile = req.file;

  if (!avatarFile) {
    throw new ApiError(400, "Mvataravata is requiredr filer file");
  }
  /**
   * TODO
   * upload the avatar file to cloudinary
   * add the avatar URL to User avatr field
   * return upload status
   */
  // const avatar = await uploadOnCloudinary(avatarLocalPath)

  return res.status(201).json({ message: "ok" });
});

const loginUser = asyncHandler(async (req, res) => {
  /**
   * get data from body, data = req.body
   * username or email
   * find the user
   * password check
   * generate access token (User method)
   * generae refresh token (User method)
   * send cookie
   *
   */
  const { email, username, password } = req.body;

  if (!(email || username)) {
    throw new ApiError(400, "username or email required");
  }

  if (!password) {
    throw new ApiError(400, "Invalid Credentials");
  }

  const user = await User.findOne({
    $or: [{ username }, { email }, { password }],
  });

  if (!user) {
    throw new ApiError(400, "User does not exist");
  }

  const isValidPassword = user.isPasswordCorrect(user.password);

  if (!isValidPassword) {
    throw new ApiError(400, "Invalid Credentials");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    user._id,
  );

  const loggedInUser = await User.findById(user._id)
    .select("-password -refreshToken ")
    .lean();

  if (!loggedInUser) {
    throw new ApiError(400, "User not found");
  }

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        { user: loggedInUser, accessToken, refreshToken },
        "user logged in successfully",
      ),
    );
});

const logoutUser = asyncHandler(async (req, res) => {
  /**
   * get the user req.user
   * remove refreshToken from the DB
   * remove accessToken and refreshToken from using clearCookie
   */
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $unset: {
        refreshToken: 1, // this removes the field from document
      },
    },
    {
      new: true,
    },
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, null, "user logged out successfully"));
});

const refreshAccessToken = asyncHandler(async (req, res) => {
  /**
   * get refreshToken from req.body | req.cookies
   * throw error on not found refreshToken
   * decode refreshToken with jwt.verify
   * get user using decoded.id
   * throw error on no user
   * check users saved refreshToken with  DB's refreshToken
   * throw error on not matching
   * generate new access and refresh token
   * save refreshToken in DB
   *  return new accessToken , refreshToken in cookies and db
   */
  const token = req.cookies?.refreshToken || req.body?.refreshToken;

  if (!token) {
    throw new ApiError(401, "Invalid refresh token");
  }

  try {
    const decodedToken = jwt.decode(token, process.env.REFRESH_TOKEN_SECRET);

    const user = await User.findById(decodedToken?._id);

    if (!user) {
      throw new ApiError(401, "Invalid refresh token");
    }

    if (token !== user.refreshToken) {
      throw new ApiError(401, "Invalid refresh token");
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
      user._id,
    );

    const options = {
      secure: true,
      httpOnly: true,
    };

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json(
        new ApiResponse(
          200,
          { accessToken, refreshToken },
          "Access token refreshed successfully",
        ),
      );
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid refresh token");
  }
});

const changeCurrentPassword = asyncHandler(async (req, res) => {
  /**
   * get oldpassword, new password from req
   * get full user using User model
   * throw error on no user
   * check old password is correct using user modles method
   * throw error on incorrect passowrd
   * add new password to the password field of DB
   * save
   * return response
   */
  const { oldPassword, newPassword } = req.body;

  if (!oldPassword || !newPassword) {
    throw ApiError(400, "oldPassword or newPassword not found");
  }

  const user = await User.findById(user._id);
  if (!user) {
    throw ApiError(400, "oldPassword or newPassword not found");
  }

  const isPasswordCorrect = user.isPasswordCorrect(oldPassword);

  if (!isPasswordCorrect) {
    throw new ApiError(400, "Invalid old password");
  }

  user.password = newPassword;
  await user.save({ validateBeforeSave: false });

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Password changed successfully"));
});

export {
  createAvatar,
  createUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  changeCurrentPassword,
};
