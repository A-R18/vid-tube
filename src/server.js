import { app } from "./app.js";
import dotenv from "dotenv";
import { connectDataBase } from "./config/dbConfig.js";

dotenv.config();
const port = process.env.PORT || 3018;
import healthRoute from "../src/routes/healthCheck.route.js";
import userRoutes from "../src/routes/user.route.js";
import videoRoutes from "../src/routes/video.route.js";
import tweetRoutes from "../src/routes/tweet.route.js";
app.use("/application", healthRoute);
app.use("/app/users", userRoutes);
app.use("/app/video", videoRoutes);
app.use("/app/tweet", tweetRoutes);
app.listen(port, () => {
  connectDataBase();
  console.log(`Server is up at ${port}`);
});
