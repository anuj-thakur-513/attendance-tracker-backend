import dotenv from "dotenv";
dotenv.configDotenv({
  path: "./.env",
});

import app from "./server";
import connectDB from "./services/db";

const PORT = process.env.PORT || 8000;

async function init() {
  try {
    await connectDB();
  } catch (error) {
    console.error(`Error connecting to DB: ${error}`);
  }

  app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
  });
}

init();
