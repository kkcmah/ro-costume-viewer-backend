/* eslint-disable @typescript-eslint/no-misused-promises */
import { Router } from "express";
import costumesService from "../services/costumesService";
import usersService from "../services/usersService";
import middleware from "../utils/middleware";
import { toCostumeId, toNewCostume } from "../utils/typeParsers/costumes";
import {
  toCostumeSetId,
  toNewCostumeSet,
} from "../utils/typeParsers/costumeSet";

const costumesRouter = Router();
// baseurl = api/costumes

costumesRouter.get("/", async (_req, res) => {
  const costumes = await costumesService.getAllCostumes();
  res.json(costumes);
});

costumesRouter.post(
  "/",
  middleware.userExtractor,
  middleware.isUserAdmin,
  async (req, res) => {
    const costumeToAdd = await toNewCostume(req.body);
    const addedCostume = await costumesService.addCostume(costumeToAdd);
    res.json(addedCostume);
  }
);

// add costume to user's favorite
costumesRouter.post("/favorite", middleware.userExtractor, async (req, res) => {
  if (!req.user) {
    return res
      .status(400)
      .json({ error: "you must be logged in to favorite a costume" });
  }
  const costumeId = toCostumeId(req.body);
  const updatedUser = await usersService.favoriteCostume(req.user, costumeId);
  if (!updatedUser) {
    return res
      .status(400)
      .json({ error: "failed to add costume to favorites" });
  }
  return res.json(updatedUser.favCostumes);
});

// remove costume from user's favorite
costumesRouter.post(
  "/unfavorite",
  middleware.userExtractor,
  async (req, res) => {
    if (!req.user) {
      return res
        .status(400)
        .json({ error: "you must be logged in to unfavorite a costume" });
    }
    const costumeId = toCostumeId(req.body);
    const updatedUser = await usersService.unFavoriteCostume(
      req.user,
      costumeId
    );
    if (!updatedUser) {
      return res
        .status(400)
        .json({ error: "failed to remove costume from favorites" });
    }
    return res.json(updatedUser.favCostumes);
  }
);

costumesRouter.post(
  "/costumeSet",
  middleware.userExtractor,
  async (req, res) => {
    if (!req.user || !req.user.id) {
      return res
        .status(400)
        .json({ error: "You must be logged in to create a costume set" });
    }
    const costumeSetToAdd = await toNewCostumeSet(req.body, req.user.id);
    const addedCostumeSet = await costumesService.addCostumeSet(
      costumeSetToAdd
    );
    return res.json(addedCostumeSet);
  }
);

costumesRouter.delete(
  "/costumeSet",
  middleware.userExtractor,
  async (req, res) => {
    if (!req.user || !req.user.id) {
      return res
        .status(400)
        .json({ error: "You must be logged in to delete a costume set" });
    }
    const costumeSetIdToDelete = toCostumeSetId(req.body);
    const costumeSetToDel = await costumesService.getCostumeSetById(
      costumeSetIdToDelete
    );

    if (!costumeSetToDel) {
      return res.status(200).json({ message: "costume set already deleted" });
    }

    if (costumeSetToDel.owner.toString() === req.user.id.toString()) {
      const deletedCostumeSet = await costumesService.deleteCostumeSet(
        costumeSetIdToDelete
      );
      return res
        .status(200)
        .json({ message: `deleted set name: ${deletedCostumeSet?.name}` });
    } else {
      return res
        .status(401)
        .json({ error: "You are not the owner of this costume set" });
    }
  }
);

export default costumesRouter;
