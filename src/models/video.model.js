import mongoose, { Schema } from "mongoose";
const videoSchema = new Schema(
      {
            videoFile: {
                  type: String, //Cloudnary Url
                  required: true,
            },

            video_public_id: {
                  type: String, //Cloudnary video public id
                  required: true,
            },

            thumbnail_public_id: {
                  type: String, //Cloudnary tbumbnail public id
                  required: true,
            },

            thumbnail: {
                  type: String,
                  required: true,
            },

            title: {
                  type: String,
            },

            description: {
                  type: String,
            },

            duration: {
                  type: Number,
            },

            views: {
                  type: Number,
                  default: 0,
            },

            isPublished: {
                  type: Boolean,
                  default: true,
            },

            owner: {
                  type: Schema.Types.ObjectId,
                  ref: "User",
            },
      },
      { timestamps: true }
);

export const Video = mongoose.model("Video", videoSchema);
