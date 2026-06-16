import { Router } from "express";
const router = Router();
import { authorizeUser } from "../middleware/authorize.mid.js";
import {
      toggleSubscription,
      getSubscribedChannels,
      getUserChannelSubscribers,
} from "../controllers/subscription.controller.js";

router.route("/toggle-subscription/:channelId").post(authorizeUser, toggleSubscription);
router.route("/my-subscriptions").get(authorizeUser, getSubscribedChannels);
router.route("/subscribers/:channelId").get(getUserChannelSubscribers);

export default router;
