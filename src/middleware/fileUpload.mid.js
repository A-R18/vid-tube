import multer from "multer";
import crypto from "crypto";

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./uploads")
    },
    filename: function (req, file, cb) {
        const newFileName = crypto.randomUUID();
        cb(null, newFileName)
    }
})

export const uploadFile = multer({
    storage
});