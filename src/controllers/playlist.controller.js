import mongoose from "mongoose";
import { Playlist } from "../models/playlist.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createPlaylist = asyncHandler(async (req, res) => {
  const { name, desc, videos } = req.body;
  //TODO: create playlist
  const playListData = {
    playList_name: name,
    playList_description: desc,
    playList_videos: videos,
    owner: req.user._id
  }

  const playListCreated = await Playlist.insertOne(playListData);
  if (!playListCreated) {
    return res.status(400).json({ alert: "Coudln't create playlist!" });
  }
  return res.status(200).json({ message: "Playlist created successfully!" });
});

const getUserPlaylists = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const userPlayListsFetched = await Playlist.find({ owner: new mongoose.Types.ObjectId(userId) });
  if (!userPlayListsFetched) {
    return res.status(400).json({ alert: "Couldn't fetch playlist(s)" });
  }
  return res.status(200).json({ message: "Playlist(s) fetched successfully", playlists: userPlayListsFetched });
  //TODO: get user playlists
});

const getPlaylistById = asyncHandler(async (req, res) => {
  const { playlistId } = req.params;
  //TODO: get playlist by id
  const playListFetched = await Playlist.findById(playlistId);
  if (!playListFetched) {
    return res.status(400).json({ alert: "Coudln't fetch playlist!" });
  }
  return res.status(200).json({ message: "Playlist fetched successfully!", playlist: playListFetched });

});

const addVideoToPlaylist = asyncHandler(async (req, res) => {
  const { playlistId, videoId } = req.body;
  const videoAddedToPlaylist = await Playlist.updateOne(
    { _id: new mongoose.Types.ObjectId(playlistId) },
    {
      $push: { videos: new mongoose.Types.ObjectId(videoId) }
    }, { upsert: true });
  if (!videoAddedToPlaylist) {
    return res.status(400).json({ alert: "Couldn't add video to playlist!" });
  }
  return res.status(200).json({ message: "Video added to playlist successfully!" });
});

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
  const { playlistId, videoId } = req.body;
  const videoRemovedToPlaylist = await Playlist.updateOne(
    { _id: new mongoose.Types.ObjectId(playlistId) },
    {
      $pull: { videos: new mongoose.Types.ObjectId(videoId) }
    });
  if (!videoRemovedToPlaylist) {
    return res.status(400).json({ alert: "Couldn't remove video from playlist!" });
  }
  return res.status(200).json({ message: "Video removed from playlist successfully!" });
});

const deletePlaylist = asyncHandler(async (req, res) => {
  const { playlistId } = req.body;
  if (!playlistId) {
    return res.status(400).json({ alert: "Playlist details are required!" });
  }
  const playListDeleted = await Playlist.deleteOne(playlistId);
  if (!playListDeleted) {
    return res.status(400).json({ alert: "Couldn't delete playlist!" });
  }
  return res.status(200).json({ message: "Playlist deleted successfully!" });
});


const updatePlaylistData = asyncHandler(async (req, res) => {
  //TODO: update playlist
  const { playlistId, name, description } = req.body;
  const playListFetched = await Playlist.findById(playlistId);
  if (!playListFetched) {
    return res.status(400).json({ alert: "Playlist not found!" });
  }
  const playListDataUpdated = await Playlist.updateOne({ _id: playlistId },
    { $set: { playList_name: name, playList_description: description } });

  if (!playListDataUpdated) {
    return res.status(400).json({ alert: "Couldn't update playlist!" });
  }

  return res.status(200).json({ message: "Updated playlist successfully!" });


});

export {
  createPlaylist,
  deletePlaylist,
  getPlaylistById,
  getUserPlaylists,
  addVideoToPlaylist,
  updatePlaylistData,
  removeVideoFromPlaylist,
};
