import { Router } from "express";
import { getChannelStats, getChannelVideos } from "../controllers/dashboard.controller.js";
const router = Router();
router.route("/channel-videos/:channelId").get(getChannelVideos);
router.route("/channel-statistics/:channelId").get(getChannelStats);
export default router;
