import CostumeTag, { ICostumeTag } from "../models/costumeTag";
import { NewCostumeTag } from "../types";

const getAllCostumeTags = async (): Promise<ICostumeTag[]> => {
  const costumeTags = await CostumeTag.find({});
  return costumeTags;
};

const addCostumeTag = async (newCostumeTag: NewCostumeTag) => {
  const costumeTagToAdd = new CostumeTag(newCostumeTag);
  const addedCostumeTag = await costumeTagToAdd.save();
  return addedCostumeTag;
};

export default {
  getAllCostumeTags,
  addCostumeTag,
};
