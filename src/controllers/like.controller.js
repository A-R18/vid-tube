import { Like } from "../models/like.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { paginate } from "../utils/paginate.js";

const toggleVideoLike = asyncHandler(async (req, res) => {
  //TODO: toggle like on video
  const { videoId } = req.body;
  if (!videoId) {
    return res.status(400).json(new ApiResponse(400, {}, "Video data is required!"));
  }
  const alreadyLiked = await Like.findOne({ targetId: videoId, likedBy: req.user._id });
  if (alreadyLiked) {
    await Like.deleteOne({
      targetId: videoId,
      likedBy: req.user._id,
      targetType: "Video",
    });
    res.status(200).json(new ApiResponse(200, {}, "Like removed!"));
  } else {
    await Like.insertOne({
      targetId: videoId,
      likedBy: req.user._id,
      targetType: "Video",
    });
    res.status(200).json(new ApiResponse(200, {}, "Like added!"));
  }
});

const toggleCommentLike = asyncHandler(async (req, res) => {
  const { commentId } = req.body;
  //TODO: toggle like on comment

  if (!commentId) {
    return res.status(400).json(new ApiResponse(400, {}, "Comment data is required!"));
  }
  const alreadyLiked = await Like.findOne({
    targetId: commentId,
    likedBy: req.user._id,
    targetType: "Comment",
  });
  if (alreadyLiked) {
    await Like.deleteOne({
      targetId: commentId,
      likedBy: req.user._id,
      targetType: "Comment",
    });
    res.status(200).json(new ApiResponse(200, {}, "Like removed!"));
  } else {
    await Like.insertOne({
      targetId: commentId,
      likedBy: req.user._id,
      targetType: "Comment",
    });
    res.status(200).json(new ApiResponse(200, {}, "Like added!"));
  }
});

const toggleTweetLike = asyncHandler(async (req, res) => {
  //TODO: toggle like on tweet
  const { tweetId } = req.body;
  if (!tweetId) {
    return res.status(400).json(new ApiResponse(400, {}, "Tweet data is required!"));
  }
  const alreadyLiked = await Like.findOne({ targetId: tweetId, likedBy: req.user._id });
  if (alreadyLiked) {
    await Like.deleteOne({
      targetId: tweetId,
      likedBy: req.user._id,
      targetType: "Tweet",
    });
    res.status(200).json(new ApiResponse(200, {}, "Like removed!"));
  } else {
    await Like.insertOne({
      targetId: tweetId,
      likedBy: req.user._id,
      targetType: "Tweet",
    });
    res.status(200).json(new ApiResponse(200, {}, "Like added!"));
  }
});

const getLikedVideos = asyncHandler(async (req, res) => {
  //TODO: get all liked videos

  const count = await Like.countDocuments({ likedBy: req.user._id, targetType: "Video" });
  const { page, lastPage, offset, limit } = await paginate(req.query.page, count);
  const likedVideosFetched = await Like.find({ likedBy: req.user._id, targetType: "Video" })
    .skip(offset)
    .limit(limit);
  if (!likedVideosFetched) {
    return res.status(400).json(new ApiResponse(400, {}, "Couldn't fetch liked videos!"));
  }
  return res.status(200).json(new ApiResponse(200, {
    likedVideos: likedVideosFetched,
    totalPages: lastPage,
    currentPage: page,
    totalVideos: count
  }, "Liked videos fetched successfully!"));
});

export {
  toggleCommentLike,
  toggleTweetLike,
  toggleVideoLike,
  getLikedVideos
};
