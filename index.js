import cors from "cors";
import "dotenv/config";
import express from "express";
import mongoose from "mongoose";
import { userRouter } from "./app/User/UserRoutes.js";
import { websiteRouter } from "./app/Website/WebsiteRoutes.js";

const app = express();
app.use(cors());
app.use(express.json());

app.use(userRouter);
app.use(websiteRouter);

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    app.listen(9999, () => {
      console.log("Listening to 9999");
    });
  })
  .catch((err) => console.log("Database connection err", err));
