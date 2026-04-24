import mongoose, { Schema } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";
mongooseAggregatePaginate;
const videoSchema = new Schema(
  {
    videoFile: {
      type: String, //Cloudnary Url
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

videoSchema.plugin(mongooseAggregatePaginate);

export const Video = mongoose.model("Video", videoSchema);
