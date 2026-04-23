import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { User } from "../models/user.model.js";
import bcrypt from "bcrypt";

import { deleteFromCloudnary, uploadOnCloudnary } from "../utils/uploadsCloudnary.js"
import { response } from "express";

const regUser = asyncHandler(async (req, res) => {
    const { fullName, mail, usName, pass } = req.body;

    const userExists = await User.findOne({
        $or: [{ usName }, { mail }]
    });

    if (userExists) {
        throw new ApiError(409, "User already exists")
    }

    const avatarLocalPath = req.files?.avatar[0]?.path;
    const coverLocalPath = req.files?.coverImage[0]?.path;

    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar  is missing!");
    } else if (!coverLocalPath) {
        throw new ApiError(400, "Cover Image is missing!");
    }
    const [avatar, coverImage] = await Promise.all([
        uploadOnCloudnary(avatarLocalPath),
        uploadOnCloudnary(coverLocalPath)
    ]);
    const user = await User.create({
        fullName,
        avatar: avatar.secure_url || "classic",
        coverImage: coverImage?.secure_url || "classic",
        email: mail,
        password: pass,
        username: usName.toLowerCase()
    });

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    if (!createdUser) {
        throw new ApiError(500, "DB: User wasn't created");
        await deleteFromCloudnary(avatar.public_id);
        await deleteFromCloudnary(coverImage.public_id);
    }
    return res.status(201).json(
        new ApiResponse(201, "Registration successfull!")
    )
});


const logUserIn = asyncHandler(async (req, res) => {

    const { mail, pass } = req.body;
    const userExists = await User.findOne({ email: mail });
    if (!userExists) {
        return res.status(404).json({ alert: "User doesn't exist!" });
    }
    const passwordMatched = await userExists.matchPassword(pass);
    if (!passwordMatched) {
        return res.status(401).json({ alert: "Invalid credentials!" });
    }

    const [accessToken, refreshToken] = await Promise.all([
        userExists.generateAccessToken(userExists._id),
        userExists.generateRefreshToken(userExists._id)
    ]);

    if (refreshToken) {
        userExists.refreshToken = refreshToken;
        await userExists.save()
    }

    const options = {
        httpOnly: true,
        secure: true
    }

    return res.status(200)
    .cookie("accToken", accessToken, options)
    .cookie("refToken", refreshToken, options)
    .json({ message: "Login successfull!", token: accessToken});


});

export {
    regUser,
    logUserIn

}