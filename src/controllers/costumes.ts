/* eslint-disable @typescript-eslint/no-misused-promises */
import { Router } from "express";
import costumesService from "../services/costumesService";
import usersService from "../services/usersService";
import { CostumeListRetObj } from "../types";
import middleware from "../utils/middleware";
import { toCostumeId, toNewCostume } from "../utils/typeParsers/costumes";
import { toCostumesSearchParams } from "../utils/typeParsers/costumesSearchParams";

const costumesRouter = Router();
// baseurl = api/costumes

// admin get all costumes
costumesRouter.get(
  "/",
  middleware.userExtractor,
  middleware.isUserAdmin,
  async (_req, res) => {
    const costumes = await costumesService.getAllCostumes();
    res.status(200).json(costumes);
  }
);

// handle query of form /params?name=cat&page=3....
// params: rows, page, itemId, name, equipSlots
costumesRouter.get("/params", async (req, res) => {
  const costumesSearchParams = toCostumesSearchParams(req.query);
  const costumesWithCount = await costumesService.getCostumesByParams(
    costumesSearchParams
  );
  const costumeListRetObj: CostumeListRetObj = {
    ...costumesWithCount,
    rowsOptions: costumesSearchParams.rowsOptions,
    correctedParams: costumesSearchParams.correctedParams,
  };
  res.status(200).json(costumeListRetObj);
});

// get users favorite costumes paginated
costumesRouter.get(
  "/profilefav/params",
  middleware.userExtractor,
  async (req, res) => {
    if (!req.user) {
      return res
        .status(400)
        .json({ error: "you must be logged in to view favorite costumes" });
    }

    if (req.user.favCostumes.length === 0) {
      // return a dummy empty object to avoid hitting database
      const emptyRetObj: CostumeListRetObj = {
        rowsOptions: [],
        correctedParams: {},
        costumes: [],
        count: 0,
      };
      return res.json(emptyRetObj);
    }

    const costumesSearchParams = toCostumesSearchParams(req.query);
    const costumesWithCount = await costumesService.getCostumesByParams(
      costumesSearchParams,
      true,
      req.user.favCostumes
    );
    const costumeListRetObj: CostumeListRetObj = {
      ...costumesWithCount,
      rowsOptions: costumesSearchParams.rowsOptions,
      correctedParams: costumesSearchParams.correctedParams,
    };
    return res.status(200).json(costumeListRetObj);
  }
);

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
