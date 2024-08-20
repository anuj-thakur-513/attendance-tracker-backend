import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload, Secret } from "jsonwebtoken";
import asyncHandler from "../utils/asyncHandler";
import ApiError from "../core/ApiError";
import config from "../config/keys";
import { User } from "../models/User";
import { generateTokens } from "../utils/generateTokens";
import { AUTH_COOKIE_OPTIONS } from "../config/cookiesConfig";

const authMiddleware = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const token: string =
      req?.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer", "");

    if (!token) {
      throw new ApiError(401, "No access token found");
    }

    try {
      const decodedToken = jwt.verify(
        token,
        config.jwt.jwtSecret as Secret
      ) as JwtPayload;

      const user = await User.findOne({ _id: decodedToken.userId }).select(
        "-createdAt -updatedAt -googleId"
      );
      if (!user) {
        throw new ApiError(401, "Invalid Access Token");
      }
      req.user = user;
      next();
    } catch (error: any) {
      if (error.name === "TokenExpiredError" || error.statusCode === 401) {
        const token: string =
          req.cookies?.refreshToken ||
          req.header("Authorization")?.replace("Bearer ", "");
        if (!token) {
          throw new ApiError(401, "Unauthorized Request");
        }

        try {
          const decodedToken = jwt.verify(
            token,
            config.jwt.jwtSecret as Secret
          ) as JwtPayload;

          const user = await User.findOne({ _id: decodedToken.userId }).select(
            "-createdAt -updatedAt -googleId"
          );
          if (user?.refreshToken !== token) {
            throw new ApiError(401, "Unauthorized Request");
          }

          const { accessToken, refreshToken } = generateTokens(
            decodedToken.userId
          );
          user.refreshToken = refreshToken;
          await user.save();
          req.user = user;
          res
            .cookie("accessToken", accessToken, AUTH_COOKIE_OPTIONS)
            .cookie("refreshToken", refreshToken, AUTH_COOKIE_OPTIONS);
          next();
        } catch (error) {
          throw new ApiError(401, "Unauthorized Request");
        }
      }
    }
  }
);

export default authMiddleware;
