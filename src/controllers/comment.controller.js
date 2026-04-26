import mongoose from "mongoose";
import { Comment } from "../models/comment.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const getVideoComments = asyncHandler(async (req, res) => {
  //TODO: get all comments for a video
  const { videoId } = req.params;
  const { page } = req.query;

  const commentsOnVideoFetched = await Comment.find({ video: videoId });
  if (!commentsOnVideoFetched) {
    return res.status(400).json({ alert: "Comments not fetched!" });
  }
  return res.status(200).json({ message: "Comments fetched! successfully!",
     comments: commentsOnVideoFetched });
});

const addComment = asyncHandler(async (req, res) => {
  // TODO: add a comment to a video
  const { videoId, comment } = req.body;
  if (!comment || !videoId) {
    return res.status(400).json({ alert: "Please provide comment data!" });
  }
  const commentData = {
    video: new mongoose.Types.ObjectId(videoId),
    owner: req.user._id,
    content: comment
  }
  const commentSaved = await Comment.insertOne(commentData);
  if (!commentSaved) {
    return res.status(400).json({ alert: "Comment was not saved!" });
  }
  return res.status(200).json({ message: "Comment saved successfully!" });
});

const updateComment = asyncHandler(async (req, res) => {
  // TODO: update a comment
  const { comment, commentId } = req.body;
  if (!comment || !commentId) {
    return res.status(404).json({ alert: "Please provide comment data" });
  }
  const commentUpdated = await Comment.findAndUpdate(
    { _id: commentId, owner: req.user._id },
    { $set: { content: comment } },
    { new: true });
  if (!commentUpdated) {
    return res.status(400).json({ alert: "Couldn't update comment!" });
  }
  return res.status(200).json({ message: "Comment updated successfully!",
     updatedComm: commentUpdated })

});

const deleteComment = asyncHandler(async (req, res) => {
  // TODO: delete a comment
  const { commentId } = req.body;
  if (!commentId) {
    return res.status(400).json({ alert: "Please provide reference of comment!" })
  }
  const commentDeleted = await Comment.findAndDelete(
    { _id: commentId, owner: req.user._id });
  if (!commentDeleted) {
    return res.status(400).json({ alert: "Couldn't delete comment!" });
  }
  return res.status(200).json({ message: "comment deleted successfully!" });
});

export {
  addComment,
  deleteComment,
  updateComment,
  getVideoComments,
};
