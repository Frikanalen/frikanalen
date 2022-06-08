import type { RequestHandler } from "express";
import { checkIfStaff } from "../auth";

export const checkStaff: RequestHandler = async (req, res, next) => {
  if (!(await checkIfStaff(req.cookies))) {
    res.status(403).send("User must be staff");
    return;
  }
  next();
};
