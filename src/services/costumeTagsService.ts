import CostumeTag, { ICostumeTag } from "../models/costumeTag";
import { NewCostumeTag } from "../types";

const getAllCostumeTags = async (): Promise<ICostumeTag[]> => {
  const costumeTags = await CostumeTag.find({});
  return costumeTags;
};

const getCostumeTagByName = async (
  name: string
): Promise<ICostumeTag | null> => {
  const existingCostumeTag = await CostumeTag.findOne({ name });
  return existingCostumeTag;
};

const getCostumeTagsByIds = async (
  costumeTagIds: string[]
): Promise<ICostumeTag[]> => {
  const costumeTags = await CostumeTag.find({
    _id: { $in: costumeTagIds },
  });
  return costumeTags;
};

const addCostumeTag = async (newCostumeTag: NewCostumeTag) => {
  const costumeTagToAdd = new CostumeTag(newCostumeTag);
  const addedCostumeTag = await costumeTagToAdd.save();
  return addedCostumeTag;
};

const addManyCostumeTags = async (manyCostumeTags: NewCostumeTag[]) => {
  const addedCostumeTags = await CostumeTag.insertMany(manyCostumeTags);
  return addedCostumeTags;
};

export default {
  getAllCostumeTags,
  getCostumeTagByName,
  getCostumeTagsByIds,
  addCostumeTag,
  addManyCostumeTags,
};
