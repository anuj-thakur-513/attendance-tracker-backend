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

  res
    .status(200)
    .cookie("accessToken", accessToken, AUTH_COOKIE_OPTIONS)
    .cookie("refreshToken", refreshToken, AUTH_COOKIE_OPTIONS)
    .json(
      new ApiResponse(
        {
          name: user?.name,
          email: user?.email,
          profilePicture: user?.profilePicture,
        },
        "User logged in successfully"
      )
    );
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

  res
    .status(200)
    .clearCookie("accessToken", AUTH_COOKIE_OPTIONS)
    .clearCookie("refreshToken", AUTH_COOKIE_OPTIONS)
    .json(new ApiResponse({}, "User logged out successfully"));
});

export { handleGoogleAuth, handleGetUser, handleLogout };
