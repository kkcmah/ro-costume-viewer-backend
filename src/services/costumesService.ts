import mongoose from "mongoose";
import Costume, { ICostume } from "../models/costume";
import { CostumesSearchParams, CostumesWithCount, NewCostume } from "../types";

const getAllCostumes = async (): Promise<ICostume[]> => {
  const costumes = await Costume.find({});
  return costumes;
};

const getCostumesByParams = async (
  params: CostumesSearchParams,
  isProfile = false,
  favCostumeIds: mongoose.Types.ObjectId[] = []
): Promise<CostumesWithCount> => {
  const query: { [key: string]: string | number | object } = {};
  if (params.name !== null)
    query.name = { $regex: new RegExp(params.name, "i") };
  if (params.itemId !== null) query.itemId = params.itemId;
  if (params.equipSlots !== null)
    query.equipSlots = { $all: params.equipSlots };

  // additional queries if from profile
  if (isProfile) {
    query._id = { $in: favCostumeIds };
  }

  const costumes = await Costume.find(query)
    .sort({ name: 1 })
    .collation({ locale: "en", caseLevel: true })
    .skip(params.page * params.rows)
    .limit(params.rows)
    .populate("costumeTags");

  const count = await Costume.find(query).countDocuments();
  return { costumes, count };
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

const addManyCostumes = async (
  manyNewCostumes: NewCostume[]
): Promise<ICostume[]> => {
  const addedCostumes = await Costume.insertMany(manyNewCostumes);
  return addedCostumes;
};

export default {
  getAllCostumes,
  getCostumesByParams,
  getCostumeById,
  addCostume,
  addManyCostumes,
  getCostumesByIds,
};
