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
  console.log("PARAMS", params);
  console.log("QUERY", query);

  const costumeSets = await CostumeSet.find(query)
    .sort({ likes: -1 })
    .collation({ locale: "en", caseLevel: true })
    .limit(20)
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
  const costumeSet = await CostumeSet.findById(id);
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
  getCostumeSetById,
  addCostumeSet,
  deleteCostumeSet,
  likeCostumeSet,
  unlikeCostumeSet,
  updateCostumeSet,
};
