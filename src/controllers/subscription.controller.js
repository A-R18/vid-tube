import mongoose, { isValidObjectId } from "mongoose";
import { User } from "../models/user.model.js";
import { Subscription } from "../models/subscription.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const toggleSubscription = asyncHandler(async (req, res) => {
  // TODO: toggle subscription
  const { channelId } = req.params;
  if (!channelId) {
    return res.status(404).json(new ApiResponse(404, {}, "Chanel reference is required!"));
  }
  const checkIfAlreadySubscribed = await Subscription.findOne({
    channel: new mongoose.Types.ObjectId(channelId),
    subscriber: new mongoose.Types.ObjectId(req.user._id),
  });

  const subscriptionData = {
    subscriber: req.user._id,
    channel: new mongoose.Types.ObjectId(channelId),
  };

  if (checkIfAlreadySubscribed) {
    await Subscription.deleteOne(subscriptionData);
    return res.status(200).json(new ApiResponse(200, {}, "Unsubscribed successfully!"));
  } else {
    await Subscription.insertOne(subscriptionData);
    return res.status(200).json(new ApiResponse(200, {}, "Subscribed successfully!"));
  }
});

// controller to return subscriber list of a channel
const getUserChannelSubscribers = asyncHandler(async (req, res) => {
  const { channelId } = req.params;
  if (!channelId) {
    return res.status(400).json(new ApiResponse(400, {}, "Channel details are required!"));
  }
  const subscribersFetched = await Subscription.find({ channel: channelId });
  if (!subscribersFetched) {
    return res.status(400).json(new ApiResponse(400, {}, "Couldn't fetch subscribers!"));
  }
  return res.status(200).json(new ApiResponse(200, { subscribers: subscribersFetched }, "Subscribers fetched successfully!"));
});

// controller to return channel list to which user has subscribed
const getSubscribedChannels = asyncHandler(async (req, res) => {
  const count = await Subscription.countDocuments({ subscriber: req.user._id });
  const { page, lastPage, offset, limit } = await paginate(req.query.page, count);
  const subscriptionsFetched = await Subscription.find({ subscriber: req.user._id })
    .offset(offset)
    .limit(limit);
  if (!subscriptionsFetched) {
    return res.status(400).json(new ApiResponse(400, {}, "Couldn't fetch subscriptions!"));
  }
  return res.status(200).json(new ApiResponse(200,
    {
      subscriptions: subscriptionsFetched,
      currentPage: page,
      totalPages: lastPage,
      totalSubscribers: count
    },
    "Subscriptions fetched successfully!"));
});

export {
  toggleSubscription,
  getUserChannelSubscribers,
  getSubscribedChannels
};
