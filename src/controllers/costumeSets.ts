/* eslint-disable @typescript-eslint/no-misused-promises */
import { Router } from "express";
import costumeSetsService from "../services/costumeSetsService";
import usersService from "../services/usersService";
import { CostumeSetsWithCount } from "../types";
import middleware from "../utils/middleware";
import {
  toCostumeSetId,
  toCostumeSetUpdatableFields,
  toNewCostumeSet,
} from "../utils/typeParsers/costumeSet";
import { toCostumeSetsPagedParams } from "../utils/typeParsers/costumeSetsPagedParams";

const costumeSetsRouter = Router();
// baseurl = api/costumeSets

// admin get all public costume sets
costumeSetsRouter.get(
  "/",
  middleware.userExtractor,
  middleware.isUserAdmin,
  async (_req, res) => {
    const costumeSets = await costumeSetsService.getAllPublicCostumeSets();
    res.status(200).json(costumeSets);
  }
);

// get a single public costume set by id
costumeSetsRouter.get("/:costumeSetId", async (req, res) => {
  const costumeSetId = toCostumeSetId(req.params);
  const costumeSet = await costumeSetsService.getPublicCostumeSetById(
    costumeSetId
  );
  res.status(200).json(costumeSet);
});

// get paged costume sets
costumeSetsRouter.post("/params", async (req, res) => {
  const costumeSetsPagedParams = toCostumeSetsPagedParams(req.body);
  const costumeSetsWithCount =
    await costumeSetsService.getPublicCostumeSetsPaged(costumeSetsPagedParams);
  res.status(200).json(costumeSetsWithCount);
});

// get users liked costume sets paged from profile
costumeSetsRouter.post(
  "/profileliked/params",
  middleware.userExtractor,
  async (req, res) => {
    if (!req.user || !req.user.id) {
      return res
        .status(400)
        .json({ error: "you must be logged in to view liked costume sets" });
    }

    if (req.user.likedCostumeSets.length === 0) {
      // return a dummy empty object to avoid hitting database
      const emptyRetObj: CostumeSetsWithCount = {
        costumeSets: [],
        count: 0,
      };
      return res.json(emptyRetObj);
    }

    const costumeSetsPagedParams = toCostumeSetsPagedParams(req.body);
    const costumeSetsWithCount =
      await costumeSetsService.getLikedCostumeSetsPaged(
        costumeSetsPagedParams,
        req.user.likedCostumeSets,
        req.user.id
      );
    return res.status(200).json(costumeSetsWithCount);
  }
);

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
costumeSetsRouter.delete(
  "/:costumeSetId",
  middleware.userExtractor,
  async (req, res) => {
    if (!req.user || !req.user.id) {
      return res
        .status(400)
        .json({ error: "You must be logged in to delete a costume set" });
    }
    const costumeSetIdToDelete = toCostumeSetId(req.params);
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
  }
);

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
costumeSetsRouter.patch("/:id", middleware.userExtractor, async (req, res) => {
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
});

export default costumeSetsRouter;
