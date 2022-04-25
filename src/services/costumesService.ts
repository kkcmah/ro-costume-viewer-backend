import Costume, { ICostume } from "../models/costume";
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
  const addedCostume = await costumeToAdd.save();
  return addedCostume;
};

export default {
  getAllCostumes,
  getCostumeById,
  addCostume,
  getCostumesByIds,
};
