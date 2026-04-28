import { Router } from "express";
import { authorizeUser } from "../middleware/authorize.mid.js";
import {
  createTweet,
  deleteTweet,
  getUserTweets,
  updateTweet,
} from "../controllers/tweet.controller.js";
const router = Router();
router.route("/write-tweet").post(authorizeUser, createTweet);
router.route("/edit-tweet").post(authorizeUser, updateTweet);
router.route("/delete-tweet").post(authorizeUser, deleteTweet);
router.route("/my-tweets").get(authorizeUser, getUserTweets);
export default router;
