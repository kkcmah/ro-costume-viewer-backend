import Costume, { ICostume } from "../models/costume";
import CostumeSet, { ICostumeSet } from "../models/costumeSet";
import CostumeTag, { ICostumeTag } from "../models/costumeTag";
import { NewCostume, NewCostumeSet } from "../types";

const getAllCostumes = async (): Promise<ICostume[]> => {
  const costumes = await Costume.find({});
  return costumes;
};

const getCostumeById = async (id: string): Promise<ICostume | undefined> => {
  const costume = await Costume.findById(id);
  if (!costume) {
    return undefined;
  }
  return costume;
};

const getAllCostumeTags = async (): Promise<ICostumeTag[]> => {
  const costumeTags = await CostumeTag.find({});
  return costumeTags;
};

const getCostumeSetById = async (
  id: string
): Promise<ICostumeSet | undefined> => {
  const costumeSet = await CostumeSet.findById(id);
  if (!costumeSet) {
    return undefined;
  }
  return costumeSet;
};

const getCostumesByIds = async (costumeIds: string[]): Promise<ICostume[]> => {
  const costumes = await Costume.find({
    _id: { $in: costumeIds },
  });
  return costumes;
};

const addCostume = async ({
  itemId,
  name,
  equipSlots,
  costumeTags,
  previewUrl,
  className,
}: NewCostume): Promise<ICostume> => {
  const costumeToAdd = new Costume({
    itemId,
    name,
    equipSlots,
    costumeTags,
    previewUrl,
    className,
  });
  const addedCostume = costumeToAdd.save();
  return addedCostume;
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
  const addedCostumeSet = costumeSetToAdd.save();
  return addedCostumeSet;
};

const deleteCostumeSet = async (id: string) => {
  return await CostumeSet.findByIdAndDelete(id);
};

export default {
  getAllCostumes,
  getCostumeById,
  getAllCostumeTags,
  getCostumeSetById,
  addCostume,
  getCostumesByIds,
  addCostumeSet,
  deleteCostumeSet,
};
