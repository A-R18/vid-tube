import mongoose from "mongoose";
import { Video } from "../models/video.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { deleteFromCloudnary, uploadOnCloudnary } from "../utils/uploadsCloudnary.js";
import fs from "fs/promises";
import { paginate } from "../utils/paginate.js";

const getAllVideos = asyncHandler(async (req, res) => {
  //TODO: get all videos based on query, sort, pagination
  console.log(Video);
  const { userId } = req.body;
  if (!userId) {
    return res.status(400).json(new ApiResponse(400, {}, "Please specify userId!"));
  }
  const count = await Video.countDocuments({ owner: new mongoose.Types.ObjectId(userId) });
  const { page, lastPage, offset, limit } = await paginate(req.query.page, count);
  const allVideosFetched = await Video.find({ owner: new mongoose.Types.ObjectId(userId) })
    .skip(offset)
    .limit(limit);
  if (!allVideosFetched) {
    return res.status(404).json(new ApiResponse(404, {}, "Video(s) not found!"));
  }
  return res.status(200).json(
    new ApiResponse(
      200,
      {
        totalVideos: count,
        currentPage: page,
        totalPages: lastPage,
        videos: allVideosFetched,
      },
      "videos fetched successfully!"
    )
  );
});

const publishAVideo = asyncHandler(async (req, res) => {
  const { vid_title, desc } = req.body;
  // TODO: get video, upload to cloudinary, create video
  console.log(req.files);
  if (!req?.files?.thumbnail || !req?.files?.video) {
    return res.status(403).json(new ApiResponse(403, {}, "File & video both are required!"));
  }
  const thumbnailFileName = req?.files?.thumbnail[0]?.path;
  const videoFileName = req?.files?.video[0]?.path;
  if (!thumbnailFileName || !videoFileName) {
    return res.status(404).json(new ApiResponse(404, {}, "Please specify thumbnail & video"));
  }
  const [videoUploaded, thumbnailUploaded] = await Promise.all([
    uploadOnCloudnary(videoFileName),
    uploadOnCloudnary(thumbnailFileName),
  ]);

  if (!videoUploaded || !thumbnailUploaded) {
    await Promise.all([
      deleteFromCloudnary(videoUploaded.video_public_id, "video"),
      deleteFromCloudnary(thumbnailUploaded.thumbnail_public_id, "image"),
    ]);
    return res
      .status(400)
      .json(new ApiResponse(400, {}, "Couldn't upload video and its thumbnail!"));
  }

  console.log(videoUploaded, "\n\n", thumbnailUploaded);
  const videoData = {
    owner: req.user._id,
    description: desc,
    title: vid_title,
    thumbnail: thumbnailUploaded.url,
    videoFile: videoUploaded.url,
    thumbnail_public_id: thumbnailUploaded.public_id,
    video_public_id: videoUploaded.public_id,
  };
  const videoSaved = await Video.insertOne(videoData);
  if (!videoSaved) {
    await Promise.all([fs.unlink(videoFileName), fs.unlink(thumbnailFileName)]);
    return res.status(400).json(new ApiResponse(400, {}, "Couldn't save video data!"));
  }
  return res.status(201).json(new ApiResponse(201, {}, "Video uploaded successfully!"));
});

const getVideoById = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  if (!videoId) {
    return res.status(400).json(new ApiResponse(400, {}, "Please specify videoId!"));
  }
  const videoFetched = await Video.findOne({ _id: new mongoose.Types.ObjectId(videoId) });
  if (!videoFetched) {
    return res.status(404).json(new ApiResponse(404, {}, "Video not found!"));
  }
  return res.status(200).json(new ApiResponse(200, { videoData: videoFetched }, "Video fetched"));
});

const updateVideo = asyncHandler(async (req, res) => {
  //TODO: update video details like title, description, thumbnail
  const { videoId } = req.params;
  const { desc } = req.body;
  let thumbnailFileName = undefined;
  let videoFileName = undefined;
  let thumbnailUpdated;
  let videoUpdated;
  console.log(desc);
  if (!videoId) {
    return res.status(400).json(new ApiResponse(400, {}, "Please specify videoId!"));
  }
  const videoFetched = await Video.findOne({ _id: new mongoose.Types.ObjectId(videoId) });
  console.log(videoFetched);
  if (!videoFetched) {
    return res.status(404).json(new ApiResponse(404, {}, "Video not found!"));
  }

  if (req?.files?.thumbnail) {
    thumbnailFileName = req.files?.thumbnail[0]?.path;
    thumbnailUpdated = await uploadOnCloudnary(thumbnailFileName);
    await deleteFromCloudnary(videoFetched.thumbnail_public_id, "image");
    await fs.unlink(thumbnailFileName);
    if (!thumbnailUpdated) {
      return res.status(400).json(new ApiResponse(400, {}, "Thumbnail was not updated!"));
    }
  }

  if (req?.files?.video) {
    videoFileName = req.files?.video[0]?.path;
    videoUpdated = await uploadOnCloudnary(videoFileName);
    await deleteFromCloudnary(videoFetched.video_public_id, "video");
    await fs.unlink(videoFileName);
    if (!videoUpdated) {
      return res.status(400).json(new ApiResponse(400, {}, "Video wasn't updated!"));
    }
  }

  const videoUpdateData = {
    description: req?.body?.desc ? desc : videoFetched.description,
    video_public_id: req?.files?.video ? videoUpdated.public_id : videoFetched.video_public_id,
    thumbnail_public_id: req?.files?.thumbnail
      ? thumbnailUpdated.public_id
      : videoFetched.thumbnail_public_id,
    thumbnail: req?.files?.thumbnail ? thumbnailUpdated.url : videoFetched.thumbnail,
    videoFile: req?.files?.video ? videoUpdated.url : videoFetched.videoFile,
  };

  const VideoSaved = await Video.findByIdAndUpdate(videoId, videoUpdateData);
  if (!VideoSaved) {
    return res.status(400).json(new ApiResponse(400, {}, "Video wasn't saved!"));
  }

  return res.status(200).json(new ApiResponse(200, {}, "Video updated successfully!"));
  S;
});

const deleteVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  //TODO: delete video
  if (!videoId) {
    return res.status(404).json(new ApiResponse(404, {}, "Please specify video address!"));
  }
  const videoFetched = await Video.findById({ _id: videoId });
  if (!videoFetched) {
    return res.status(404).json(new ApiResponse(404, {}, "Video not found!"));
  }
  const videoRemovedCompletely = await Promise.all([
    deleteFromCloudnary(videoFetched.video_public_id, "video"),
    deleteFromCloudnary(videoFetched.thumbnail_public_id, "image"),
    Video.findOneAndDelete({ _id: new mongoose.Types.ObjectId(videoId) }),
  ]);
  console.log(
    "video pub id: \n",
    videoFetched.video_public_id,
    "thumbnail pub id: \n",
    videoFetched.thumbnail_public_id
  );

  if (!videoRemovedCompletely) {
    return res.status(400).json(new ApiResponse(400, {}, "Error in deleting video!"));
  }
  return res.status(200).json(new ApiResponse(200, {}, "Video deleted successfully!"));
});

const togglePublishStatus = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  if (!videoId) {
    return res.status(404).json(new ApiResponse(404, {}, "Please specify video address!"));
  }
  const videoFetched = await Video.findById({ _id: videoId });
  if (!videoFetched) {
    return res.status(404).json(new ApiResponse(404, {}, "Video not found!"));
  }

  const videoPublishStatusToggled = videoFetched.isPublished
    ? await Video.findByIdAndUpdate(videoFetched._id, { isPublished: false })
    : await Video.findByIdAndUpdate(videoFetched._id, { isPublished: true });

  if (!videoPublishStatusToggled) {
    return res.status(400).json(new ApiResponse(400, {}, "Video status wasn't updated!"));
  }
  return res.status(200).json(new ApiResponse(200, {}, "Video status updated successfully!"));
});

export { updateVideo, deleteVideo, getAllVideos, getVideoById, publishAVideo, togglePublishStatus };
