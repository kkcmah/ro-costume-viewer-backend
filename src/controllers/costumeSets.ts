/* eslint-disable @typescript-eslint/no-misused-promises */
import { Router } from "express";
import costumeSetsService from "../services/costumeSetsService";
import usersService from "../services/usersService";
import middleware from "../utils/middleware";
import {
  toCostumeSetId,
  toCostumeSetUpdatableFields,
  toNewCostumeSet,
} from "../utils/typeParsers/costumeSet";

const costumeSetsRouter = Router();
// baseurl = api/costumeSets

// create a costume set
costumeSetsRouter.post("/", middleware.userExtractor, async (req, res) => {
  if (!req.user || !req.user.id) {
    return res
      .status(400)
      .json({ error: "You must be logged in to create a costume set" });
  }
  const costumeSetToAdd = await toNewCostumeSet(req.body, req.user.id);
  const addedCostumeSet = await costumeSetsService.addCostumeSet(
    costumeSetToAdd
  );
  return res.status(201).json(addedCostumeSet);
});

// delete a costume set if user is owner
costumeSetsRouter.delete("/", middleware.userExtractor, async (req, res) => {
  if (!req.user || !req.user.id) {
    return res
      .status(400)
      .json({ error: "You must be logged in to delete a costume set" });
  }
  const costumeSetIdToDelete = toCostumeSetId(req.body);
  const costumeSetToDel = await costumeSetsService.getCostumeSetById(
    costumeSetIdToDelete
  );

  if (!costumeSetToDel) {
    return res.status(200).json({ message: "costume set already deleted" });
  }

  if (costumeSetToDel.owner.toString() === req.user.id.toString()) {
    const deletedCostumeSet = await costumeSetsService.deleteCostumeSet(
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
});

// like a costume set
costumeSetsRouter.post(
  "/:id/like",
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
    await costumeSetsService.likeCostumeSet(costumeSetId);
    return res.status(200).json(updatedUser.likedCostumeSets);
  }
);

// unlike a costume set
costumeSetsRouter.post(
  "/:id/unlike",
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
    await costumeSetsService.unlikeCostumeSet(costumeSetId);
    return res.status(200).json(updatedUser.likedCostumeSets);
  }
);

// update a costume set
costumeSetsRouter.patch(
  "/:id",
  middleware.userExtractor,
  async (req, res) => {
    if (!req.user || !req.user.id) {
      return res
        .status(400)
        .json({ error: "You must be logged in to update a costume set" });
    }

    const costumeSetToUpdate = await costumeSetsService.getCostumeSetById(
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
    const updatedCostumeSet = await costumeSetsService.updateCostumeSet(
      req.params.id,
      updatedCostumeSetFields
    );
    if (!updatedCostumeSet) {
      return res.status(400).json({ error: "failed to update costume set" });
    }
    return res.status(200).json(updatedCostumeSet);
  }
);

export default costumeSetsRouter;
