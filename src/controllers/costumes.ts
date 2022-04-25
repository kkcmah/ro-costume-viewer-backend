/* eslint-disable @typescript-eslint/no-misused-promises */
import { Router } from "express";
import costumesService from "../services/costumesService";
import usersService from "../services/usersService";
import middleware from "../utils/middleware";
import { toCostumeId, toNewCostume } from "../utils/typeParsers/costumes";
import {
  toCostumeSetId,
  toCostumeSetUpdatableFields,
  toNewCostumeSet,
} from "../utils/typeParsers/costumeSet";

const costumesRouter = Router();
// baseurl = api/costumes

costumesRouter.get("/", async (_req, res) => {
  const costumes = await costumesService.getAllCostumes();
  res.status(200).json(costumes);
});

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

// create a costume set
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
    return res.status(201).json(addedCostumeSet);
  }
);

// delete a costume set if user is owner
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

// like a costume set
costumesRouter.post(
  "/costumeSet/:id/like",
  middleware.userExtractor,
  async (req, res) => {
    if (!req.user) {
      return res
        .status(400)
        .json({ error: "you must be logged in to like a costume set" });
    }

    const costumeSetId = req.params.id;
    const isSetAlreadyLiked =
      req.user.likedCostumeSets.findIndex(
        (lcs) => lcs.toString() === costumeSetId
      ) !== -1;

    if (isSetAlreadyLiked) {
      return res.status(200).json(req.user.likedCostumeSets);
    }

    const updatedUser = await usersService.likeCostumeSet(
      req.user,
      costumeSetId
    );
    if (!updatedUser) {
      return res.status(400).json({ error: "failed to like costume set" });
    }
    await costumesService.likeCostumeSet(costumeSetId);
    return res.status(200).json(updatedUser.likedCostumeSets);
  }
);

// unlike a costume set
costumesRouter.post(
  "/costumeSet/:id/unlike",
  middleware.userExtractor,
  async (req, res) => {
    if (!req.user) {
      return res
        .status(400)
        .json({ error: "you must be logged in to unlike a costume set" });
    }

    const costumeSetId = req.params.id;
    const isSetAlreadyUnliked =
      req.user.likedCostumeSets.findIndex(
        (lcs) => lcs.toString() === costumeSetId
      ) === -1;

    if (isSetAlreadyUnliked) {
      return res.status(200).json(req.user.likedCostumeSets);
    }

    const updatedUser = await usersService.unlikeCostumeSet(
      req.user,
      costumeSetId
    );
    if (!updatedUser) {
      return res.status(400).json({ error: "failed to unlike costume set" });
    }
    await costumesService.unlikeCostumeSet(costumeSetId);
    return res.status(200).json(updatedUser.likedCostumeSets);
  }
);

// update a costume set
costumesRouter.patch(
  "/costumeSet/:id",
  middleware.userExtractor,
  async (req, res) => {
    if (!req.user || !req.user.id) {
      return res
        .status(400)
        .json({ error: "You must be logged in to update a costume set" });
    }

    const costumeSetToUpdate = await costumesService.getCostumeSetById(
      req.params.id
    );
    if (
      !costumeSetToUpdate ||
      costumeSetToUpdate.owner.toString() !== req.user.id.toString()
    ) {
      return res.status(401).json({
        error: "You do not have permissions to update this costume set",
      });
    }

    const updatedCostumeSetFields = await toCostumeSetUpdatableFields(req.body);
    const updatedCostumeSet = await costumesService.updateCostumeSet(
      req.params.id,
      updatedCostumeSetFields
    );
    if (!updatedCostumeSet) {
      return res.status(400).json({ error: "failed to update costume set" });
    }
    return res.status(200).json(updatedCostumeSet);
  }
);

export default costumesRouter;
