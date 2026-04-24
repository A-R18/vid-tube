import mongoose, { mongo, Schema } from "mongoose";

const likeSchema = new Schema(
  {
    // any one of video, comment or tweet will be assigned per document

    video: {
      type: Schema.Types.ObjectId,
      ref: "Video",
    },
    comment: {
      type: Schema.Types.ObjectId,
      ref: "Comment",
    },
    tweet: {
      type: Schema.Types.ObjectId,
      ref: "Tweet",
    },
    likedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

export const like = mongoose.model("Like", likeSchema);
