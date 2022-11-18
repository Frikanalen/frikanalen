import { getProgram, getPreview, setProgram, setPreview } from "./handlers.js";
import { checkStaff } from "../auth/checkStaff.js";
import express from "express";

export const atemRouter = express.Router();

atemRouter.route("/program").get(getProgram).post([checkStaff, setProgram]);
atemRouter.route("/preview").get(getPreview).post([checkStaff, setPreview]);
