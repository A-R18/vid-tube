import mongoose, { Schema } from "mongoose";

const playListSchema = new Schema(
      {
            playList_name: {
                  type: String,
                  required: true,
            },
            playList_description: {
                  type: String,
                  required: true,
            },
            playList_videos: [
                  {
                        type: Schema.Types.ObjectId,
                        ref: "Video",
                  },
            ],
            owner: {
                  type: Schema.Types.ObjectId,
                  ref: "User",
            },
      },
      {
            timestamps: true,
      }
);

export const Playlist = mongoose.model("Playlist", playListSchema);
