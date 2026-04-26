import mongoose, { isValidObjectId } from "mongoose";
import { Like } from "../models/like.models.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const toggleVideoLike = asyncHandler(async (req, res) => {
  //TODO: toggle like on video
  const { videoId } = req.body;
  if (!videoId) {
    return res.status(400).json({ alert: "Video data is required!" });
  }
  const alreadyLiked = await Like.findOne({ targetId: videoId, likedBy: req.user._id });
  if (alreadyLiked) {
    await Like.deleteOne({ targetId: videoId, likedBy: req.user._id });
    res.status(200).json({ message: "Like removed!" });
  } else {
    await Like.insertOne({ targetId: videoId, likedBy: req.user._id });
    res.status(200).json({ message: "Like added!" });
  }
});

const toggleCommentLike = asyncHandler(async (req, res) => {
  const { commentId } = req.body;
  //TODO: toggle like on comment

  if (!commentId) {
    return res.status(400).json({ alert: "Comment data is required!" });
  }
  const alreadyLiked = await Like.findOne({ targetId: commentId, likedBy: req.user._id });
  if (alreadyLiked) {
    await Like.deleteOne({ targetId: commentId, likedBy: req.user._id });
    res.status(200).json({ message: "Like removed!" });
  } else {
    await Like.insertOne({ targetId: commentId, likedBy: req.user._id });
    res.status(200).json({ message: "Like added!" });
  }
});

const toggleTweetLike = asyncHandler(async (req, res) => {

  //TODO: toggle like on tweet
  const { tweetId } = req.body;
  if (!tweetId) {
    return res.status(400).json({ alert: "tweet data is required!" });
  }
  const alreadyLiked = await Like.findOne({ targetId: tweetId, likedBy: req.user._id });
  if (alreadyLiked) {
    await Like.deleteOne({ targetId: tweetId, likedBy: req.user._id });
    res.status(200).json({ message: "Like removed!" });
  } else {
    await Like.insertOne({ targetId: tweetId, likedBy: req.user._id });
    res.status(200).json({ message: "Like added!" });
  }
});

const getLikedVideos = asyncHandler(async (req, res) => {
  //TODO: get all liked videos
  const likedVideosFetched = await Like.find({ likedBy: req.user._id, targetType: "Video" });
  if (!likedVideosFetched) {
    return res.status(400).json({ alert: "couldn't fetch liked videos" });
  }
  return res.status(200).json({ message: "Liked videos fetched successfully!",
     likedVideos: likedVideosFetched });
});

export {
  toggleCommentLike,
  toggleTweetLike,
  toggleVideoLike,
  getLikedVideos
};
