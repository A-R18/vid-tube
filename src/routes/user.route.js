import { Router } from "express";
import { logUserIn, regUser } from "../controllers/user.controller.js";

import { uploadFile } from "../middleware/fileUpload.mid.js";
const router = Router();
router.route("/register").post(
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
export default router;