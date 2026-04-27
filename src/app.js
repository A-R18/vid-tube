import express from "express";
import cors from "cors";
const app = express();
import cookieParser from "cookie-parser";

import likeRoutes from "../src/routes/like.route.js";
import userRoutes from "../src/routes/user.route.js";
import videoRoutes from "../src/routes/video.route.js";
import tweetRoutes from "../src/routes/tweet.route.js";
import commentRoutes from "../src/routes/comment.route.js";
import playlistRoutes from "../src/routes/playlist.route.js";
import healthRoute from "../src/routes/healthCheck.route.js";
import dashboardRoutes from "../src/routes/dashboard.route.js";
import subscriptionRoutes from "../src/routes/subscription.route.js";

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));

app.use(express.static("public"));
app.use(cookieParser());

app.use("/app/like", likeRoutes);
app.use("/app/users", userRoutes);
app.use("/app/video", videoRoutes);
app.use("/app/tweet", tweetRoutes);
app.use("/application", healthRoute);
app.use("/app/comments", commentRoutes);
app.use("/app/playlist", playlistRoutes);
app.use("/app/dashboard", dashboardRoutes);
app.use("/app/subscription", subscriptionRoutes);

export { app };
