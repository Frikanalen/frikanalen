import type { RequestHandler } from "express";
import atem from "./AtemInterface";

export const setInput: RequestHandler = async (req, res) => {
  const inputIndex = parseInt(req.body.inputIndex);

  if (isNaN(inputIndex)) {
    res
      .status(400)
      .send("Malformed request, expected {inputIndex: number}")
      .end();
    return;
  }

  try {
    await atem.ME[0]!.setInput(inputIndex);
  } catch (e: any) {
    res.status(500).send(`could not set input; e = ${e}`);
    return;
  }
  res.send({ inputIndex: atem.ME[0]?.input });
};

export const getInput: RequestHandler = (_req, res) => {
  res.send({ inputIndex: atem.ME[0]!.input });
};
