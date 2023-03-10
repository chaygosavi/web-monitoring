import express from "express";
import { authenticateUserMiddleware } from "../User/UserMiddleware.js";
import { createWebsite } from "./WebsiteServices.js";

export const websiteRouter = express.Router();

websiteRouter.post("/website", authenticateUserMiddleware, createWebsite);
