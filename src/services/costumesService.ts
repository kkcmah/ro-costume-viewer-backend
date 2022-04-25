import Costume, { ICostume } from "../models/costume";
import { NewCostume } from "../types";

const getAllCostumes = async (): Promise<ICostume[]> => {
  const costumes = await Costume.find({});
  return costumes;
};

const getCostumeById = async (id: string): Promise<ICostume | null> => {
  const costume = await Costume.findById(id);
  return costume;
};

const getCostumesByIds = async (costumeIds: string[]): Promise<ICostume[]> => {
  const costumes = await Costume.find({
    _id: { $in: costumeIds },
  });
  return costumes;
};

const addCostume = async (newCostume: NewCostume): Promise<ICostume> => {
  const costumeToAdd = new Costume(newCostume);
  const addedCostume = await costumeToAdd.save();
  return addedCostume;
};

export default {
  getAllCostumes,
  getCostumeById,
  addCostume,
  getCostumesByIds,
};
