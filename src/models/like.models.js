import mongoose, { mongo, Schema } from "mongoose";

const likeSchema = new Schema(
  {
    // any one of video, comment or tweet will be assigned per document
    targetId: {
      type: Schema.Types.ObjectId,
      required: true,
      refPath: "targetType",
    },
    targetType: {
      type: String,
      enum: ["Video", "Comment", "Tweet"],
      required: true,
    },
    likedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

likeSchema.index({ targetId: 1, targetType: 1, likedBy: 1 }, { unique: true });

export const Like = mongoose.model("Like", likeSchema);
