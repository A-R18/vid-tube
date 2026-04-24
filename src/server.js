import { app } from "./app.js";
import dotenv from "dotenv";
import { connectDataBase } from "./config/dbConfig.js";

dotenv.config();
const port = process.env.PORT || 3018;
import healthRoute from "../src/routes/healthCheck.route.js";
import userRoutes from "../src/routes/user.route.js";
app.use("/application", healthRoute);
app.use("/app/users", userRoutes);
app.listen(port, () => {
  connectDataBase();
  console.log(`Server is up at ${port}`);
});
