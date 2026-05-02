import mongoose from "mongoose";
import { Comment } from "../models/comment.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { paginate } from "../utils/paginate.js";

const getVideoComments = asyncHandler(async (req, res) => {
  //TODO: get all comments for a video
  const { videoId } = req.params;
  const count = await Comment.countDocuments({ video: videoId });
  const { page, lastPage, offset, limit } = await paginate(req.query.page, count);

  const commentsOnVideoFetched = await Comment.find({ video: videoId })
    .skip(offset)
    .limit(limit);
  if (!commentsOnVideoFetched) {
    return res.status(400).json(new ApiResponse(400, {}, "Couldn't fetch comments!"));
  }
  return res
    .status(200)
    .json(new ApiResponse(200, {
      comments: commentsOnVideoFetched,
      currentPage: page,
      totalPages: lastPage,
      totalComments: count
    }, "Comments fetched! successfully!"));

});

const addComment = asyncHandler(async (req, res) => {
  // TODO: add a comment to a video
  const { videoId, comment } = req.body;
  if (!comment || !videoId) {
    return res.status(400).json(new ApiResponse(400, {}, "Please provide comment data!"));
  }
  const commentData = {
    video: new mongoose.Types.ObjectId(videoId),
    owner: req.user._id,
    content: comment,
  };
  const commentSaved = await Comment.insertOne(commentData);
  if (!commentSaved) {
    return res.status(400).json(new ApiResponse(400, {}, "Comment was not saved"));
  }
  return res.status(200).json(new ApiResponse(200, {}, "Comment saved successfully!"));
});

const updateComment = asyncHandler(async (req, res) => {
  // TODO: update a comment
  const { comment, commentId } = req.body;
  if (!comment || !commentId) {
    return res.status(404).json(new ApiResponse(400, {}, "Please provide comment data"));
  }
  const commentUpdated = await Comment.findOneAndUpdate(
    { _id: commentId, owner: req.user._id },
    { $set: { content: comment } },
    { new: true }
  );
  if (!commentUpdated) {
    return res.status(400).json(new ApiResponse(400, {}, "Couldn't update comment!"));
  }
  return res
    .status(200)
    .json(new ApiResponse(200, { updatedComm: commentUpdated }, "Comment updated successfully!"));
});

const deleteComment = asyncHandler(async (req, res) => {
  // TODO: delete a comment
  const { commentId } = req.body;
  if (!commentId) {
    return res.status(400).json(new ApiResponse(400, {}, "Please provide referennce of comment"));
  }
  const commentDeleted = await Comment.findOneAndDelete({ _id: commentId, owner: req.user._id });
  if (!commentDeleted) {
    return res.status(400).json(new ApiResponse(400, {}, "Couldn't delete comment!"));

  }
  return res.status(200).json(new ApiResponse(400, {}, "Comment deleted successfully!"));;
});

export { addComment, deleteComment, updateComment, getVideoComments };
