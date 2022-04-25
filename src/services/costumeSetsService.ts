import CostumeSet, { ICostumeSet } from "../models/costumeSet";
import { CostumeSetUpdatableFields, NewCostumeSet } from "../types";

const getAllPublicCostumeSets = async () => {
  return await CostumeSet.find({ isPublic: true })
    .populate("owner", "username")
    .populate({
      path: "costumes",
      select: ["itemId", "name", "costumeTags"],
    //   populate: {
    //     path: "costumeTags",
    //   },
    });
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
  getCostumeSetById,
  addCostumeSet,
  deleteCostumeSet,
  likeCostumeSet,
  unlikeCostumeSet,
  updateCostumeSet,
};
