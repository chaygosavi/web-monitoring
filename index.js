import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import "dotenv/config";

const app = express();
app.use(cors());

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    app.listen(3001, () => {
      console.log("Listening to 3001");
    });
  })
  .catch((err) => console.log("Database connection err", err));
