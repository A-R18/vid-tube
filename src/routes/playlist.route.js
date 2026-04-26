import { Router } from "express";
const router = Router();
import { authorizeUser } from "../middleware/authorize.mid.js";
import {
    createPlaylist,
    deletePlaylist,
    getPlaylistById,
    getUserPlaylists,
    addVideoToPlaylist,
    removeVideoFromPlaylist
} from "../controllers/playlist.controller.js";
router.route("/create-playlist").post(authorizeUser, createPlaylist);
router.route("/delete-playlist").post(authorizeUser, deletePlaylist);
router.route("/playlist-by-id/:playlistId").get(authorizeUser, getPlaylistById);
router.route("/add-video-to-playlist").post(authorizeUser, addVideoToPlaylist);
router.route("/user-playlists/:playlistId").get(authorizeUser, getUserPlaylists);
router.route("/remove-video-from-playlist").post(authorizeUser, removeVideoFromPlaylist);
export default router;
