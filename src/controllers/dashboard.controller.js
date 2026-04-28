import mongoose from "mongoose";
import { Video } from "../models/video.model.js";
import { Subscription } from "../models/subscription.model.js";
import { Like } from "../models/like.models.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { paginate } from "../utils/paginate.js";
const getChannelStats = asyncHandler(async (req, res) => {
  // TODO: Get the channel stats like (views are not specified/calculated!) total video views, total subscribers, total videos, total likes etc.
  const { channelId } = req.params;
  const [totalVideos, totalSubscriptions] = await Promise.all([
    Video.countDocuments({ owner: new mongoose.Types.ObjectId(channelId) }),
    Subscription.countDocuments({ channel: new mongoose.Types.ObjectId(channelId) }),
  ]);

  const totalLikes = await Video.aggregate([
    {
      $match: {
        owner: new mongoose.Types.ObjectId(channelId),
      },
    },

    {
      $lookup: {
        from: "likes",
        localField: "_id",
        foreignField: "targetId",
        as: "likesOnVideo",
      },
    },

    {
      $unwind: "$likesOnVideo",
    },

    {
      $group: {
        _id: null,
        count: { $sum: 1 },
      },
    },

    {
      $project: {
        totalLikes: "$count",
        _id: 0,
      },
    },
  ]);

  return res.status(202).json({
    videos: totalVideos,
    subscribers: totalSubscriptions,
    totalLikesOnVideos: totalLikes[0].totalLikes,
  });
});

const getChannelVideos = asyncHandler(async (req, res) => {
  // TODO: Get all the videos uploaded by the channel
  const { channelId } = req.params;
  const channelVideosFetched = await Video.find({ owner: new mongoose.Types.ObjectId(channelId) });
  if (!channelVideosFetched) {
    return res.status(400).json({ alert: "Couldn't fetch channel videos!" });
  }
  return res
    .status(200)
    .json({ message: "Channel videos fetched!", channelVideos: channelVideosFetched });
});

export {
  getChannelStats,
  getChannelVideos
};
