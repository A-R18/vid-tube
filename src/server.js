import { app } from "./app.js";
import dotenv from "dotenv";
import { connectDataBase } from "./config/dbConfig.js";

dotenv.config();
const port = process.env.PORT || 3018;
import healthRoute from "../src/routes/healthCheck.route.js";
import userRoutes from "../src/routes/user.route.js";
import videoRoutes from "../src/routes/video.route.js";
import tweetRoutes from "../src/routes/tweet.route.js";
import commentRoutes from "../src/routes/comment.route.js";
import subscriptionRoutes from "../src/routes/subscription.route.js";
app.use("/app/users", userRoutes);
app.use("/app/video", videoRoutes);
app.use("/app/tweet", tweetRoutes);
app.use("/application", healthRoute);
app.use("/app/comments", commentRoutes);
app.use("/app/subscription", subscriptionRoutes);

app.listen(port, () => {
  connectDataBase();
  console.log(`Server is up at ${port}`);
});
