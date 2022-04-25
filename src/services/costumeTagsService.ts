import CostumeTag, { ICostumeTag } from "../models/costumeTag";

const getAllCostumeTags = async (): Promise<ICostumeTag[]> => {
  const costumeTags = await CostumeTag.find({});
  return costumeTags;
};

export default {
  getAllCostumeTags,
};
