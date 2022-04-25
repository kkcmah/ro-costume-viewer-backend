/* eslint-disable @typescript-eslint/no-misused-promises */
import { Router } from "express";
import costumeTagsService from "../services/costumeTagsService";

const costumeTagsRouter = Router();
// baseurl = api/costumeTags

costumeTagsRouter.get("/", async (_req, res) => {
  const costumeTags = await costumeTagsService.getAllCostumeTags();
  res.status(200).json(costumeTags);
});

export default costumeTagsRouter;
