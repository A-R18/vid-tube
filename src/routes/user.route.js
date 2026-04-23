import { Router } from "express";
import {
    changeCurrentPassword,
    getCurrentUser,
    logUserIn,
    logUserOut,
    regUser,
    updateAccDetails
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
router.route("/change-my-password").post(authorizeUser, changeCurrentPassword);
router.route("/current-user").get(authorizeUser, getCurrentUser);
router.route("/update-account").post(authorizeUser, updateAccDetails);
export default router;