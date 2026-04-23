import { Router } from "express";
import {
    changeCurrentPassword,
    getUserWatchTimeData,
    getUserChannelData,
    updateAccDetails,
    getCurrentUser,
    logUserOut,
    logUserIn,
    regUser,
    updateAvatar,
    updateUserCoverImage
} from "../controllers/user.controller.js";
import { uploadFile } from "../middleware/fileUpload.mid.js";
import { authorizeUser } from "../middleware/authorize.mid.js";
const router = Router();
router.route("/register").post(
    authorizeUser,
    uploadFile.fields([
        {
            name: "avatar",
            maxCount: 1
        },

        {
            name: "coverImage",
            maxCount: 1
        },

    ]),
    regUser);

router.route("/login").post(logUserIn);
router.route("/logout").post(authorizeUser, logUserOut);
router.route("/current-user").get(authorizeUser, getCurrentUser);
router.route("/update-account").post(authorizeUser, updateAccDetails);
router.route("/my-watchtime").get(authorizeUser, getUserWatchTimeData);
router.route("/change-my-password").post(authorizeUser, changeCurrentPassword);
router.route("/my-channel-data/:username").get(authorizeUser, getUserChannelData);
router.route("/update-my-avatar").post(authorizeUser, uploadFile.single("avatar"), updateAvatar)
router.route("/update-video-cover").post(authorizeUser,uploadFile.single("coverImage"), updateUserCoverImage);


export default router;