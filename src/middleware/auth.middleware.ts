import { Request } from "express";
import { IUser, User } from "../models/user.model";
import asyncHandler from "../utils/asyncHandler";
import ApiError from "../utils/ApiError";
import jwt, { Secret } from "jsonwebtoken";

interface AuthRequest extends Request {
    user?: IUser;
}

export const verifyJWT = asyncHandler(async (req: AuthRequest, _, next) => {
    const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");
    if (!token) throw new ApiError(401, "Unauthorized. No token provided");

    const secret: Secret = process.env.ACCESS_TOKEN_SECRET!;
    const decodedToken = jwt.verify(token, secret) as { _id: string };

    const user = await User.findById(decodedToken._id).select("-password -refreshToken");
    if (!user) throw new ApiError(401, "Unauthorized. User not found");

    req.user = user;
    next();
});
