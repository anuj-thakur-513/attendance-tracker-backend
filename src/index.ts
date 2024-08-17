import dotenv from "dotenv";
dotenv.configDotenv({
  path: "./.env",
});

import app from "./server";
import connectDB from "./services/db";

const PORT = process.env.PORT || 8000;

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server started on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error(`Error connecting to DB: ${err}`);
  });
