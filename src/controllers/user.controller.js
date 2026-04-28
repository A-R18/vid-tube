import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { User } from "../models/user.model.js";
import { deleteFromCloudnary, uploadOnCloudnary } from "../utils/uploadsCloudnary.js";
import { paginate } from "../utils/paginate.js";
const regUser = asyncHandler(async (req, res) => {
  const { fullName, mail, usName, pass } = req.body;

  const userExists = await User.findOne({
    $or: [{ usName }, { mail }],
  });

  if (userExists) {
    throw new ApiError(409, "User already exists");
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
    uploadOnCloudnary(coverLocalPath),
  ]);
  const user = await User.create({
    fullName,
    avatar: avatar.secure_url || "classic",
    coverImage: coverImage?.secure_url || "classic",
    email: mail,
    password: pass,
    username: usName.toLowerCase(),
  });

  const createdUser = await User.findById(user._id).select("-password -refreshToken");

  if (!createdUser) {
    await deleteFromCloudnary(avatar.public_id);
    await deleteFromCloudnary(coverImage.public_id);
    throw new ApiError(500, "DB: User wasn't created");
  }
  return res.status(201).json(new ApiResponse(201, "Registration successfull!"));
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
    userExists.generateRefreshToken(userExists._id),
  ]);

  if (refreshToken) {
    userExists.refreshToken = refreshToken;
    await userExists.save();
  }

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie("accToken", accessToken, options)
    .cookie("refToken", refreshToken, options)
    .json({ message: "Login successfull!", token: accessToken });
});

const logUserOut = asyncHandler(async (req, res) => {
  const TokenCleared = await User.findByIdAndUpdate(req.user._id, {
    $unset: {
      refreshToken: "",
    },
  });

  if (!TokenCleared) {
    return res.status(401).json({ alert: "Couldn't logout!" });
  }
  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json({
      message: "user logged out successfully!",
    });
});

const changeCurrentPassword = asyncHandler(async (req, res) => {
  const { oldPass, newPass } = req.body;
  const userExists = await User.findById(req.user._id);
  console.log(userExists);
  if (!userExists) {
    return res.status(404).json({ alert: "User not found!" });
  }
  const passwordsMatch = userExists.matchPassword(oldPass);
  if (passwordsMatch) {
    userExists.password = newPass;
    await userExists.save();
    return res.status(200).json({ message: "Password changed successfully!" });
  } else {
    return res.status(401).json({ alert: "Old password entered is wrong!" });
  }
});

const getCurrentUser = asyncHandler(async (req, res) => {
  return res.status(200).json({ message: "current user fetched!", user: req.user });
});

const updateAccDetails = asyncHandler(async (req, res) => {
  const { name, email } = req.body;
  if (!email || !name) {
    return res.status(404).json({ alert: "Both email & name are required!" });
  }
  const updatedUser = await User.findByIdAndUpdate(req.user._id, {
    $set: {
      fullName: name,
      email: email,
    },
  });
  if (!updatedUser) {
    return res.status(400).json({ alert: "unable to update", error: error.message });
  }
  return res.status(200).json({ message: "Name & email have been updated!" });
});

const updateAvatar = asyncHandler(async (req, res) => {
  const avatarLocalPath = req?.file?.path;
  if (!avatarLocalPath) {
    return res.status(404).json({ alert: "Avatar is required!" });
  }
  const avatarUploaded = await uploadOnCloudnary(avatarLocalPath);

  if (!avatarUploaded.url) {
    return res.status(400).json({ alert: "Failed to upload avatar!" });
  }
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        avatar: avatar.url,
      },
    },
    { new: true }
  ).select("-password, -refreshToken");

  res.status(200).json({ message: "Avatar updated successfully!" });
});

const updateUserCoverImage = asyncHandler(async (req, res) => {
  const converLocalPath = req?.file?.path;
  if (!converLocalPath) {
    return res.status(404).json({ alert: "Avatar is required!" });
  }
  const converUploaded = await uploadOnCloudnary(converLocalPath);
  if (!converUploaded.url) {
    return res.status(400).json({ alert: "Failed to upload avatar!" });
  }
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        coverImage: coverImage.url,
      },
    },
    { new: true }
  ).select("-password, -refreshToken");

  res.status(200).json({ message: "Avatar updated successfully!", userData: user });
});

const getUserChannelData = asyncHandler(async (req, res) => {
  const { username } = req.params;
  if (!username) {
    return res.status(404).json({ alert: "username is required!" });
  }

  const UserChannelInfo = User.aggregate([
    {
      $match: {
        username: username?.toLowerCase(),
      },
    },
    {
      $lookup: {
        from: "subscriptions",
        localField: "_id",
        foreignField: "channel",
        as: "subscribers",
      },
    },
    {
      $lookup: {
        from: "subscriptions",
        localField: "_id",
        foreignField: "subscriber",
        as: "subscription",
      },
    },
    {
      $addFields: {
        subscribersCount: {
          $size: "$subscribers",
        },
        subscriptionsCount: {
          $size: "subscription",
        },
        isSubscribed: {
          $cond: {
            if: { $in: [req.user?._id, "$subscribers.subscriber"] },
            then: true,
            else: false,
          },
        },
      },
    },
    {
      $project: {
        fullName: 1,
        username: 1,
        avatar: 1,
        subscribersCount: 1,
        subscriptionsCount: 1,
        isSubscribed: 1,
        coverImage: 1,
        email: 1,
      },
    },
  ]);

  if (!UserChannelInfo) {
    return res.status(404).json({ alert: "Channel data not found!" });
  }

  return res.status(200).json({ message: "Channel fetched successfully!" });
});

const getUserWatchTimeData = asyncHandler(async (req, res) => {
  const user = await User.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(req.user?._id),
      },
    },
    {
      $lookup: {
        from: "videos",
        localField: "watchHistory",
        foreignField: "_id",
        as: "watchHistory",
        pipeline: [
          {
            $lookup: {
              from: "users",
              localField: "owner",
              foreignField: "_id",
              as: "owner",
              pipeline: [
                {
                  $project: {
                    fullName: 1,
                    username: 1,
                    avatar: 1,
                  },
                },
              ],
            },
          },
          {
            $addFields: {
              owner: {
                $first: "$owner",
              },
            },
          },
        ],
      },
    },
  ]);
  if (!user) {
    return res.status(404).json({ alert: "watch history not available!" });
  }

  return res
    .status(200)
    .json({ message: "Watch history fetched successfully!", watchHistory: user[0]?.watchHistory });
});

export {
  regUser,
  logUserIn,
  logUserOut,
  updateAvatar,
  getCurrentUser,
  updateAccDetails,
  getUserChannelData,
  getUserWatchTimeData,
  updateUserCoverImage,
  changeCurrentPassword,
};
