/* eslint-disable @typescript-eslint/no-misused-promises */
import { Router } from "express";
import costumesService from "../services/costumesService";
import usersService from "../services/usersService";
import middleware from "../utils/middleware";
import { toCostumeId, toNewCostume } from "../utils/typeParsers/costumes";

const costumesRouter = Router();
// baseurl = api/costumes

// get all costumes
costumesRouter.get("/", async (_req, res) => {
  const costumes = await costumesService.getAllCostumes();
  res.status(200).json(costumes);
});

// admin create new costume
costumesRouter.post(
  "/",
  middleware.userExtractor,
  middleware.isUserAdmin,
  async (req, res) => {
    const costumeToAdd = await toNewCostume(req.body);
    const addedCostume = await costumesService.addCostume(costumeToAdd);
    res.status(201).json(addedCostume);
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

  const isCostumeAlreadyFavorited =
    req.user.favCostumes.findIndex((cos) => cos.toString() === costumeId) !==
    -1;

  if (isCostumeAlreadyFavorited) {
    return res.status(200).json(req.user.favCostumes);
  }
  const updatedUser = await usersService.favoriteCostume(req.user, costumeId);
  if (!updatedUser) {
    return res
      .status(400)
      .json({ error: "failed to add costume to favorites" });
  }
  return res.status(200).json(updatedUser.favCostumes);
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

    const isCostumeAlreadyUnfavorited =
      req.user.favCostumes.findIndex((cos) => cos.toString() === costumeId) ===
      -1;

    if (isCostumeAlreadyUnfavorited) {
      return res.status(200).json(req.user.favCostumes);
    }

    const updatedUser = await usersService.unFavoriteCostume(
      req.user,
      costumeId
    );
    if (!updatedUser) {
      return res
        .status(400)
        .json({ error: "failed to remove costume from favorites" });
    }
    return res.status(200).json(updatedUser.favCostumes);
  }
);

export default costumesRouter;
