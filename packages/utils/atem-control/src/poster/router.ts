import { posterPreview, posterUpload } from "./handlers.js";
import { checkStaff } from "../auth/checkStaff.js";
import express from "express";

export const posterRouter = express.Router();

posterRouter.get("/preview", posterPreview);
posterRouter.post("/upload", [checkStaff, posterUpload]);
