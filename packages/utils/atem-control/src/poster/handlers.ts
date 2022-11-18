import type { RequestHandler } from "express";
import fetch from "node-fetch";
import { checkIfStaff } from "../auth.js";
import { getLogger } from "../logger.js";
import atem from "../atem/AtemInterface.js";
const logger = getLogger();

export const posterPreview: RequestHandler = async (req, res) => {
  const { text, heading } = req.query;
  logger.info(`Generating poster: [${text}] heading: [${heading}]`);

  const pngPosterRes = await fetch("http://stills-generator/getPoster.png", {
    headers: { "Content-Type": "application/json" },
    method: "post",
    body: JSON.stringify({ text: text, heading: heading }),
  });

  if (!pngPosterRes.ok) {
    res
      .status(500)
      .send(`unexpected response from renderer ${pngPosterRes.statusText}`)
      .end();
    return;
  }
  const pixMap = await pngPosterRes.arrayBuffer();
  res.type("image/png").send(new Buffer(pixMap));
};

export const posterUpload: RequestHandler = async (req, res) => {
  const staff = await checkIfStaff(req.cookies);

  if (!staff) {
    logger.warn(`Rejected non-staff user`);
    res.status(403).send("User not authorized").end();
    return;
  }

  const posterRequest = await fetch("http://stills-generator/getPoster.rgba", {
    method: "post",
    body: JSON.stringify(req.body),
    headers: { "Content-Type": "application/json" },
  });

  if (!posterRequest.ok)
    throw new Error(
      `unexpected response from renderer ${posterRequest.statusText}`
    );
  try {
    const pixMap = await posterRequest.arrayBuffer();
    await atem.atem?.uploadStill(0, new Buffer(pixMap), "test", "test");
    res.send({ result: "success" });
  } catch (e) {
    console.log(e);
    throw new Error(`exception: ${e}`);
  }
};
