import { Router } from "express";
const router = Router();
import { authorizeUser } from "../middleware/authorize.mid.js";
import { getSubscribedChannels, getUserChannelSubscribers, toggleSubscription } from "../controllers/subscription.controller.js";
router.route("/toggle-subscription/:channelId").post(authorizeUser, toggleSubscription);
router.route("/my-subscriptions").get(authorizeUser, getUserChannelSubscribers);
router.route("/subscribers/:channelId").get(getSubscribedChannels);

export default router;
