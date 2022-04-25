import CostumeSet, { ICostumeSet } from "../models/costumeSet";
import { CostumeSetUpdatableFields, NewCostumeSet } from "../types";


const getCostumeSetById = async (
  id: string
): Promise<ICostumeSet | undefined> => {
  const costumeSet = await CostumeSet.findById(id);
  if (!costumeSet) {
    return undefined;
  }
  return costumeSet;
};

const addCostumeSet = async ({
  name,
  description,
  costumes,
  likes,
  owner,
  isPublic,
}: NewCostumeSet): Promise<ICostumeSet> => {
  const costumeSetToAdd = new CostumeSet({
    name,
    description,
    costumes,
    likes,
    owner,
    isPublic,
  });
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
  getCostumeSetById,
  addCostumeSet,
  deleteCostumeSet,
  likeCostumeSet,
  unlikeCostumeSet,
  updateCostumeSet,
};
