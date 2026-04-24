import { ConnectionCreatedEvent } from "mongodb";
import mongoose from "mongoose";
const connectDataBase = async () => {
  try {
    await mongoose.connect(process.env.DB_CONN);
    console.log(`DB connected!`);
  } catch (error) {
    console.log(`error: \n ${error.message}\n stackTrace: ${error.stack}`);
    process.exit(1);
  }
};

export { connectDataBase };
