import { Router } from "express";
import { authorizeUser } from "../middleware/authorize.mid.js";
import {
  addComment,
  deleteComment,
  getVideoComments,
  updateComment,
} from "../controllers/comment.controller.js";

const router = Router();
router.route("/add-comment").post(authorizeUser, addComment);
router.route("/edit-comment").post(authorizeUser, updateComment);
router.route("/delete-comment").post(authorizeUser, deleteComment);
router.route("/video-comments/:videoId").get(authorizeUser, getVideoComments);

export default router;
