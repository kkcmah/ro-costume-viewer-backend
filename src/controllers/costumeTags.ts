/* eslint-disable @typescript-eslint/no-misused-promises */
import { Router } from "express";
import costumeTagsService from "../services/costumeTagsService";
import middleware from "../utils/middleware";
import { toNewCostumeTag } from "../utils/typeParsers/costumeTag";

const costumeTagsRouter = Router();
// baseurl = api/costumeTags

// get all costume tags
costumeTagsRouter.get("/", async (_req, res) => {
  const costumeTags = await costumeTagsService.getAllCostumeTags();
  res.status(200).json(costumeTags);
});

// create a costume tag
costumeTagsRouter.post(
  "/",
  middleware.userExtractor,
  middleware.isUserAdmin,
  async (req, res) => {
    const newCostumeTag = toNewCostumeTag(req.body);
    const existingCostumeTag = await costumeTagsService.getCostumeTagByName(
      newCostumeTag.name
    );
    if (existingCostumeTag) {
      res.status(400).json({ error: "costume tag must be unique" });
    } else {
      const addedCostumeTag = await costumeTagsService.addCostumeTag(
        newCostumeTag
      );
      res.status(201).json(addedCostumeTag);
    }
  }
);

export default costumeTagsRouter;
