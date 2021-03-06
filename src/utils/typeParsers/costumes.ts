import mongoose from "mongoose";
import costumeTagsService from "../../services/costumeTagsService";
import { EquipSlot, NewCostume } from "../../types";
import { isEquipSlot, isNumber, isString, ParseError } from "./helpers";

const parseCostumeId = (costumeId: unknown): string => {
  if (!costumeId || !isString(costumeId)) {
    throw new ParseError("Malformatted or missing costume id " + costumeId);
  }
  return costumeId;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const toCostumeId = (object: any): string => {
  return parseCostumeId(object.costumeId);
};

const parseItemId = (itemId: unknown): number => {
  if (itemId === null || itemId === undefined || !isNumber(itemId)) {
    throw new ParseError("Malformatted or missing itemId " + itemId);
  }
  return itemId;
};

const parseName = (name: unknown): string => {
  if (!name || !isString(name)) {
    throw new ParseError("Malformatted or missing name " + name);
  }
  return name;
};

const parseEquipSlot = (equipSlot: unknown): EquipSlot => {
  if (!isEquipSlot(equipSlot)) {
    throw new ParseError("Malformatted or missing equipslot " + equipSlot);
  }
  return equipSlot;
};

const parseEquipSlots = (equipSlots: unknown): EquipSlot[] => {
  if (!equipSlots || !Array.isArray(equipSlots)) {
    throw new ParseError("Malformatted or missing equipSlots " + equipSlots);
  }
  return equipSlots.map((slot) => parseEquipSlot(slot));
};

const parseCostumeTags = async (
  costumeTags: unknown
): Promise<mongoose.Types.ObjectId[]> => {
  if (!costumeTags || !Array.isArray(costumeTags)) {
    throw new ParseError("Malformatted or missing costumeTags " + costumeTags);
  }

  const costumeTagIds = costumeTags.map((cos) => {
    if (!cos || !isString(cos)) {
      throw new ParseError("Malformatted or missing costumeTag id " + cos);
    }
    return cos;
  });

  const costumeTagsInDb = await costumeTagsService.getCostumeTagsByIds(
    costumeTagIds
  );

  if (costumeTagsInDb.length !== costumeTags.length) {
    throw new ParseError("One or more costumeTag(s) do not exist");
  }
  return costumeTagsInDb.map((cos) => {
    if (!cos || !cos.id) {
      throw new ParseError("Malformatted or missing costumeTag id " + cos.name);
    }
    return cos.id;
  });
};

const parsePreviewUrl = (previewUrl: unknown): string => {
  if (!isString(previewUrl)) {
    throw new ParseError("Malformatted or missing previewUrl " + previewUrl);
  }
  return previewUrl;
};

const parseClassName = (className: unknown): string => {
  if (!className || !isString(className)) {
    throw new ParseError("Malformatted or missing className " + className);
  }
  return className;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const toNewCostume = async (object: any): Promise<NewCostume> => {
  const newCostume: NewCostume = {
    itemId: parseItemId(object.itemId),
    name: parseName(object.name),
    equipSlots: parseEquipSlots(object.equipSlots),
    costumeTags: await parseCostumeTags(object.costumeTags),
    previewUrl: parsePreviewUrl(object.previewUrl),
    className: parseClassName(object.className),
  };
  return newCostume;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const toManyNewCostumes = async (object: any): Promise<NewCostume[]> => {
  //const manyNewCostumes: NewCostume[] = [];
  if (!Array.isArray(object)) {
    throw new ParseError("Malformatted or missing costumes array " + object);
  }
  const manyNewCostumes = await Promise.all(object.map(toNewCostume));
  return manyNewCostumes;
};
