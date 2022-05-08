import mongoose from "mongoose";
import CostumeSet, { ICostumeSet } from "../models/costumeSet";
import {
  CostumeSetsPagedParams,
  CostumeSetsWithCount,
  CostumeSetUpdatableFields,
  NewCostumeSet,
} from "../types";

const getAllPublicCostumeSets = async () => {
  return await CostumeSet.find({ isPublic: true })
    .populate("owner", "username")
    .populate({
      path: "costumes",
      // select: ["itemId", "name", "costumeTags"],
      populate: {
        path: "costumeTags",
      },
    });
};

const getPublicCostumeSetsPaged = async (
  params: CostumeSetsPagedParams
): Promise<CostumeSetsWithCount> => {
  const query: { [key: string]: string | number | object | boolean } = {};

  if (params.name !== null) {
    query.name = { $regex: new RegExp(params.name, "i") };
  }
  if (params.lastSeenIds !== null) {
    query._id = { $nin: params.lastSeenIds };
  }
  if (params.lastLikeValue !== null) {
    query.likes = { $lte: params.lastLikeValue };
  }
  query.isPublic = true;

  const costumeSets = await CostumeSet.find(query)
    .sort({ likes: -1 })
    .sort({ name: 1 })
    .collation({ locale: "en", caseLevel: true })
    .limit(10)
    .populate("owner", "username")
    .populate({
      path: "costumes",
      populate: {
        path: "costumeTags",
      },
    });

  const count = await CostumeSet.find(query).countDocuments();
  return { costumeSets, count };
};

const getLikedCostumeSetsPaged = async (
  params: CostumeSetsPagedParams,
  likedCostumeSetIds: mongoose.Types.ObjectId[],
  profileOwnerId: mongoose.Types.ObjectId
): Promise<CostumeSetsWithCount> => {
  const query: { [key: string]: string | number | object | boolean } = {};

  if (params.name !== null) {
    query.name = { $regex: new RegExp(params.name, "i") };
  }

  if (params.lastLikeValue !== null) {
    query.likes = { $lte: params.lastLikeValue };
  }

  if (params.lastSeenIds !== null) {
    query.$and = [
      { _id: { $nin: params.lastSeenIds } },
      { _id: { $in: likedCostumeSetIds } },
    ];
  } else {
    query._id = { $in: likedCostumeSetIds };
  }

  // isPublic or user liked own private set
  query.$or = [{ isPublic: true }, { owner: profileOwnerId }];

  const costumeSets = await CostumeSet.find(query)
    .sort({ likes: -1 })
    .sort({ name: 1 })
    .collation({ locale: "en", caseLevel: true })
    .limit(10)
    .populate("owner", "username")
    .populate({
      path: "costumes",
      populate: {
        path: "costumeTags",
      },
    });

  const count = await CostumeSet.find(query).countDocuments();
  return { costumeSets, count };
};

const getOwnedCostumeSetsPaged = async (
  params: CostumeSetsPagedParams,
  profileOwnerId: mongoose.Types.ObjectId
): Promise<CostumeSetsWithCount> => {
  const query: { [key: string]: string | number | object | boolean } = {};

  if (params.name !== null) {
    query.name = { $regex: new RegExp(params.name, "i") };
  }

  if (params.lastLikeValue !== null) {
    query.likes = { $lte: params.lastLikeValue };
  }

  if (params.lastSeenIds !== null) {
    query._id = { $nin: params.lastSeenIds };
  }

  query.owner = profileOwnerId;

  const costumeSets = await CostumeSet.find(query)
    .sort({ likes: -1 })
    .sort({ name: 1 })
    .collation({ locale: "en", caseLevel: true })
    .limit(10)
    .populate("owner", "username")
    .populate({
      path: "costumes",
      populate: {
        path: "costumeTags",
      },
    });

  const count = await CostumeSet.find(query).countDocuments();
  return { costumeSets, count };
};

const getPublicCostumeSetById = async (
  id: string
): Promise<ICostumeSet | null> => {
  const costumeSet = await CostumeSet.findById(id)
    .populate("owner", "username")
    .populate({
      path: "costumes",
      populate: {
        path: "costumeTags",
      },
    });
  if (costumeSet && !costumeSet.isPublic) {
    return null;
  }
  return costumeSet;
};

const getCostumeSetById = async (id: string): Promise<ICostumeSet | null> => {
  const costumeSet = await CostumeSet.findById(id)
    .populate("owner", "username")
    .populate({
      path: "costumes",
      populate: {
        path: "costumeTags",
      },
    });
  return costumeSet;
};

const addCostumeSet = async (
  newCostumeSet: NewCostumeSet
): Promise<ICostumeSet> => {
  const costumeSetToAdd = new CostumeSet(newCostumeSet);
  const addedCostumeSet = await costumeSetToAdd.save();
  return addedCostumeSet;
};

const deleteCostumeSet = async (id: string) => {
  return await CostumeSet.findByIdAndDelete(id);
};

const likeCostumeSet = async (id: string) => {
  return await CostumeSet.findByIdAndUpdate(
    id,
    {
      $inc: { likes: 1 },
    },
    { new: true }
  );
};

const unlikeCostumeSet = async (id: string) => {
  return await CostumeSet.findByIdAndUpdate(
    id,
    {
      $inc: { likes: -1 },
    },
    { new: true }
  );
};

const updateCostumeSet = async (
  id: string,
  updatableFields: CostumeSetUpdatableFields
): Promise<ICostumeSet | null> => {
  return await CostumeSet.findByIdAndUpdate(
    id,
    { ...updatableFields },
    { new: true }
  );
};

export default {
  getAllPublicCostumeSets,
  getPublicCostumeSetsPaged,
  getPublicCostumeSetById,
  getLikedCostumeSetsPaged,
  getOwnedCostumeSetsPaged,
  getCostumeSetById,
  addCostumeSet,
  deleteCostumeSet,
  likeCostumeSet,
  unlikeCostumeSet,
  updateCostumeSet,
};
