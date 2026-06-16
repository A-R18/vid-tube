import mongoose, { isValidObjectId } from "mongoose";
import { Tweet } from "../models/tweet.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { paginate } from "../utils/paginate.js";
const createTweet = asyncHandler(async (req, res) => {
      //TODO: create tweet
      const { tweet_cont } = req.body;
      if (!tweet_cont) {
            return res.status(400).json(new ApiResponse(400, {}, "Tweet is required!"));
      }
      const tweetData = {
            content: tweet_cont,
            owner: new mongoose.Types.ObjectId(req.user._id),
      };
      const tweetSaved = await Tweet.insertOne(tweetData);
      if (!tweetSaved) {
            return res.status(400).json(new ApiResponse(400, {}, "Tweet not saved!"));
      }
      return res.status(201).json(new ApiResponse(201, {}, "Tweet saved!"));
});

const getUserTweets = asyncHandler(async (req, res) => {
      // TODO: get user tweets
      const count = await Tweet.countDocuments({ owner: req.user._id });
      const { page, lastPage, offset, limit } = await paginate(req.query.page, count);
      const tweetsFetched = await Tweet.find({ owner: req.user._id }).offset(offset).limit(limit);
      if (!tweetsFetched) {
            return res.status(400).json(new ApiResponse(400, {}, "Something went wrong!"));
      }
      return res.status(200).json(
            new ApiResponse(
                  200,
                  {
                        tweets: tweetsFetched,
                        currentPage: page,
                        totalPages: lastPage,
                        totalRecords: count,
                  },
                  "Tweets fetched!"
            )
      );
});

const updateTweet = asyncHandler(async (req, res) => {
      //TODO: update tweet
      const { tweetId, tweet_cont } = req.body;
      if (!tweetId || !tweet_cont) {
            return res.status(400).json(new ApiResponse(400, {}, "Tweet data is required!"));
      }
      const existingTweet = await Tweet.findOne({ _id: tweetId, owner: req.user._id });
      if (!existingTweet) {
            return res.status(403).json(new ApiResponse(403, {}, "Forbidden"));
      }

      const tweetUpdatedData = {
            content: tweet_cont,
      };
      const tweetUpdated = await Tweet.findByIdAndUpdate(tweetId, tweetUpdatedData);
      if (!tweetUpdated) {
            return res.status(400).json(new ApiResponse(400, {}, "Tweet not updated!"));
      }
      return res.status(200).json(new ApiResponse(200, {}, "Tweet updated!"));
});

const deleteTweet = asyncHandler(async (req, res) => {
      const { tweetId } = req.body;
      if (!tweetId) {
            return res.status(400).json(new ApiResponse(400, {}, "Please specify tweet!"));
      }
      const tweetDeleted = await Tweet.deleteOne({ _id: tweetId });
      if (!tweetDeleted) {
            return res.status(400).json(new ApiResponse(400, {}, "Tweet not deleted!"));
      }
      return res.status(200).json(new ApiResponse(200, {}, "Tweet deleted successfully!"));
});

export { getUserTweets, createTweet, updateTweet, deleteTweet };
