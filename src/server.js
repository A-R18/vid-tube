import { app } from "./app.js";
import dotenv from "dotenv";
import { connectDataBase } from "./config/dbConfig.js";

dotenv.config();
const port = process.env.PORT || 3018;

app.listen(port, () => {
  connectDataBase();
  console.log(`Server is up at ${port}`);
});
