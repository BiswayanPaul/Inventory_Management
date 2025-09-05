import { Request, Response } from "express";
import jwt, { Secret } from "jsonwebtoken";
import { User, IUser } from "../models/user.model";
import asyncHandler from "../utils/asyncHandler";
import ApiError from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";

// Extend Request type to include `user`
import { AuthRequest } from "../utils/types";
// --------------------
// Generate Access + Refresh Tokens
// --------------------
const generateAccessAndRefreshToken = async (userId: string) => {

    try {
        const user = await User.findById(userId)
        if (!user) throw new ApiError(404, "User not found");
        // console.log({ userId })

        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        // console.log({ userId })

        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });

        return { accessToken, refreshToken };
    } catch (err) {
        throw new ApiError(500, "Could not generate tokens, Please try again")
    }

};

// --------------------
// Register User
// --------------------
export const registerUser = asyncHandler(async (req: Request, res: Response) => {
    const { fullname, email, password, businessId } = req.body;

    if ([fullname, email, password, businessId].some((field) => !field || field.trim() === "")) {
        throw new ApiError(400, "All fields are required");
    }

    const existedUser = await User.findOne({ email });
    if (existedUser) throw new ApiError(409, "User already exists");

    const user = await User.create({
        fullname,
        email,
        password,
        businessId,
    });

    const createdUser = await User.findById(user._id).select("-password -refreshToken");
    if (!createdUser) throw new ApiError(500, "Could not create user. Please try again");

    return res.status(201).json(new ApiResponse(200, createdUser, "User registered successfully"));
});

// --------------------
// Login User
// --------------------
export const loginUser = asyncHandler(async (req: Request, res: Response) => {
    const { email, password } = req.body;
    if (!email) throw new ApiError(400, "Email is required");

    const user = await User.findOne({ email });
    if (!user) throw new ApiError(404, "User not found. Please register");

    const isPasswordValid = await user.isPasswordCorrect(password);
    if (!isPasswordValid) throw new ApiError(401, "Invalid password");

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id.toString());
    const loggedInUser = await User.findById(user._id).select("-password -refreshToken");

    const cookieOptions = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production",
    };

    return res
        .status(200)
        .cookie("accessToken", accessToken, cookieOptions)
        .cookie("refreshToken", refreshToken, cookieOptions)
        .json(new ApiResponse(200, { user: loggedInUser, accessToken, refreshToken }, "User logged in successfully"));
});

// --------------------
// Logout User
// --------------------
export const logoutUser = asyncHandler(async (req: AuthRequest, res: Response) => {
    if (!req.user) throw new ApiError(401, "Unauthorized");

    await User.findByIdAndUpdate(req.user._id, { $set: { refreshToken: undefined } });

    const cookieOptions = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
    };

    return res
        .status(200)
        .clearCookie("accessToken", cookieOptions)
        .clearCookie("refreshToken", cookieOptions)
        .json(new ApiResponse(200, {}, "User logged out successfully"));
});

// --------------------
// Refresh Access Token
// --------------------
export const refreshAccessToken = asyncHandler(async (req: Request, res: Response) => {
    const incomingRefreshToken = req.cookies?.refreshToken || req.body.refreshToken;
    if (!incomingRefreshToken) throw new ApiError(401, "Unauthorized Request");

    try {
        const decodedToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET as Secret) as { _id: string };
        const user = await User.findById(decodedToken._id);
        if (!user) throw new ApiError(401, "Unauthorized Request");

        if (user.refreshToken !== incomingRefreshToken) throw new ApiError(401, "Invalid refresh token. Please login again");

        const cookieOptions = {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
        };

        const { accessToken, refreshToken: newRefreshToken } = await generateAccessAndRefreshToken(user._id.toString());

        return res
            .status(200)
            .cookie("accessToken", accessToken, cookieOptions)
            .cookie("refreshToken", newRefreshToken, cookieOptions)
            .json(new ApiResponse(200, { accessToken, refreshToken: newRefreshToken }, "Access token refreshed successfully"));
    } catch (error) {
        throw new ApiError(401, "Invalid refresh token. Please login again");
    }
});

// --------------------
// Get Current User
// --------------------
export const getCurrentUser = asyncHandler(async (req: AuthRequest, res: Response) => {
    if (!req.user) throw new ApiError(401, "Unauthorized");
    return res.status(200).json(new ApiResponse(200, req.user, "User fetched successfully"));
});
