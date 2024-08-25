import dotenv from "dotenv";
dotenv.configDotenv({
  path: "./.env",
});

import app from "./server";
import connectDB from "./services/db";
import { redis } from "./services/redis";

const PORT = process.env.PORT || 8000;

async function init() {
  try {
    await connectDB();
  } catch (error) {
    console.error(`Error connecting to DB: ${error}`);
  }

  await redis.ping((err, res) => {
    if (err) {
      console.log(`error while connecting to redis:`, err);
    }
    console.log(`redis PING:${res}`);
  });

  app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
  });
}

init();
