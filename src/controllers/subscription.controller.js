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
    return res.status(404).json({ alert: "channel reference is required!" });
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
    return res.status(200).json({ message: "Unsubscribed successfully!" });
  } else {
    await Subscription.insertOne(subscriptionData);
    return res.status(200).json({ message: "Subscribed successfully!" });
  }
});

// controller to return subscriber list of a channel
const getUserChannelSubscribers = asyncHandler(async (req, res) => {
  const { channelId } = req.params;
  if (!channelId) {
    return res.status(400).json({ alert: "Channel details are required!" });
  }
  const subscribersFetched = await Subscription.find({ channel: channelId });
  if (!subscribersFetched) {
    return res.status(400).json({ alert: "Couldn't fetch subscribers!" });
  }
  return res.status(200).json({
    message: "Subscribers fetched successfully!",
    subscribers: subscribersFetched,
  });
});

// controller to return channel list to which user has subscribed
const getSubscribedChannels = asyncHandler(async (req, res) => {
  const subscriptionsFetched = await Subscription.find({ subscriber: req.user._id });
  if (!subscriptionsFetched) {
    return res.status(400).json({ alert: "Couldn't fetch subscriptions!" });
  }
  return res.status(200).json({
    message: "Subscriptions fetched successfully!",
    subscriptions: subscriptionsFetched,
  });
});

export { toggleSubscription, getUserChannelSubscribers, getSubscribedChannels };
