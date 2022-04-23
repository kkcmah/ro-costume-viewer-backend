import Costume, { ICostume } from "../models/costume";
import CostumeTag, { ICostumeTag } from "../models/costumeTag";
import { NewCostume } from "../types";

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

export default {
  getAllCostumes,
  getCostumeById,
  getAllCostumeTags,
  addCostume,
};
