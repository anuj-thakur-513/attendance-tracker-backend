import mongoose from "mongoose";

import { DB_NAME } from "../constants";
import config from "../config/keys";

async function connectDB() {
  try {
    const connection = await mongoose.connect(
      `${config.mongodb.dbUri}/${DB_NAME}`
    );
    console.log(`DB connected on host: ${connection.connection.host}`);
  } catch (error) {
    console.log(`Error while connecting to DB: ${error}`);
  }
}

export default connectDB;
