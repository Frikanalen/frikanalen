import { posterPreview, posterUpload } from "./handlers";
import { checkStaff } from "../auth/checkStaff";
import express from "express";

export const posterRouter = express.Router();

posterRouter.get("/preview", posterPreview);
posterRouter.post("/upload", [checkStaff, posterUpload]);
