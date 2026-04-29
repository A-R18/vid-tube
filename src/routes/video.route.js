import { Router } from "express";
import {
  updateVideo,
  deleteVideo,
  getVideoById,
  publishAVideo,
  togglePublishStatus,
  getAllVideos,
} from "../controllers/video.controller.js";
import { authorizeUser } from "../middleware/authorize.mid.js";
import { uploadFile } from "../middleware/fileUpload.mid.js";
const router = Router();
router.route("/upload-video").post(
  authorizeUser,
  uploadFile.fields([
    {
      name: "video",
      maxCount: 1,
    },
    {
      name: "thumbnail",
      maxCount: 1,
    },
  ]),
  publishAVideo
);

router.route("/video/:videoId").get(authorizeUser, getVideoById);
router.route("/my-videos").get(authorizeUser, getAllVideos);
router.route("/update-video/:videoId").post(
  authorizeUser,
  uploadFile.fields([
    {
      name: "video",
      maxCount: 1,
    },
    {
      name: "thumbnail",
      maxCount: 1,
    },
  ]),
  updateVideo
);
router.route("/delete-video/:videoId").post(authorizeUser, deleteVideo);
router.route("/toggle-video-status/:videoId").post(authorizeUser, togglePublishStatus);
export default router;
