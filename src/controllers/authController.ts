import { Request, Response } from "express";
import asyncHandler from "../utils/asyncHandler";
import ApiError from "../core/ApiError";
import verifyGoogleToken from "../utils/verifyGoogleToken";
import ApiResponse from "../core/ApiResponse";
import { User } from "../models/User";
import { generateTokens } from "../utils/generateTokens";
import { AUTH_COOKIE_OPTIONS } from "../config/cookiesConfig";

const handleGoogleAuth = asyncHandler(async (req: Request, res: Response) => {
  const { credential } = req.body;
  if (!credential) {
    throw new ApiError(400, "No credential found for signup");
  }

  const verificationResponse = await verifyGoogleToken(credential);
  if (verificationResponse.error) {
    throw new ApiError(400, verificationResponse.error);
  }

  const profile = verificationResponse?.payload;

  if (!profile) {
    throw new ApiError(404, "No user found");
  }

  let user = await User.findOne({ email: profile?.email });
  if (!user) {
    user = await User.create({
      name: profile?.name,
      email: profile?.email,
      profilePicture: profile?.picture,
      googleId: profile.sub,
    });
  }

  const { accessToken, refreshToken } = generateTokens(user._id);
  user = await User.findOneAndUpdate(
    { _id: user._id },
    { refreshToken: refreshToken },
    { new: true }
  );

  const responseObject = {
    name: user?.name,
    email: user?.email,
    profilePicture: user?.profilePicture,
    accessToken: accessToken,
    refreshToken: refreshToken,
  };

  console.log(responseObject);

  res
    .status(200)
    .json(new ApiResponse(responseObject, "User logged in successfully"));
});

const handleGetUser = asyncHandler(async (req: Request, res: Response) => {
  res
    .status(200)
    .json(new ApiResponse({ user: req?.user }, "User sent successfully"));
});

const handleLogout = asyncHandler(async (req: Request, res: Response) => {
  const user = await User.findByIdAndUpdate(req?.user?._id, {
    refreshToken: "",
  });

  if (!user) {
    throw new ApiError(404, "No user found");
  }

  res.status(200).json(new ApiResponse({}, "User logged out successfully"));
});

export { handleGoogleAuth, handleGetUser, handleLogout };
