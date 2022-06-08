import { getInput, setInput } from "./handlers";
import { checkStaff } from "../auth/checkStaff";
import express from "express";

export const atemRouter = express.Router();

atemRouter.route("/program").get(getInput).post([checkStaff, setInput]);
