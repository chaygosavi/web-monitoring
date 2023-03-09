import express from "express";
import {
  generateNewAccessToken,
  loginUser,
  signupUser,
} from "./UserServices.js";

export const userRouter = express.Router();

userRouter.post("/user/signup", signupUser);
userRouter.post("/user/login", loginUser);
userRouter.post("/user/new-token", generateNewAccessToken);
