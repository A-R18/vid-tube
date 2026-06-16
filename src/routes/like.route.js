import { Router } from "express";
const router = Router();
import { authorizeUser } from "../middleware/authorize.mid.js";
import { getLikedVideos, toggleCommentLike, toggleTweetLike, toggleVideoLike } from "../controllers/like.controller.js";

router.route("/toggle-video").post(authorizeUser, toggleVideoLike);
router.route("/toggle-comment").post(authorizeUser, toggleCommentLike);
router.route("/toggle-tweet").post(authorizeUser, toggleTweetLike);
router.route("/my-liked-videos").get(authorizeUser, getLikedVideos);

export default router;
