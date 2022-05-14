import mongoose from "mongoose";
import costumesService from "../../services/costumesService";
import { CostumeSetUpdatableFields, NewCostumeSet } from "../../types";
import { isBoolean, isString, ParseError } from "./helpers";

const parseName = (name: unknown): string => {
  if (!name || !isString(name)) {
    throw new ParseError("Malformatted or missing name " + name);
  }
  if (name.length > 100) {
    throw new ParseError("name must be less than 100 characters long: " + name);
  }
  return name;
};

const parseDescription = (desc: unknown): string => {
  if (!desc || !isString(desc)) {
    throw new ParseError("Malformatted or missing description " + desc);
  }
  if (desc.length > 300) {
    throw new ParseError(
      "description must be less than 300 characters: " + desc
    );
  }
  return desc;
};

const parseCostumes = async (
  costumes: unknown
): Promise<mongoose.Types.ObjectId[]> => {
  if (!costumes || !Array.isArray(costumes) || costumes.length < 1) {
    throw new ParseError("Malformatted or missing costumes " + costumes);
  }

  const costumeIds = costumes.map((cos) => {
    if (!cos || !isString(cos)) {
      throw new ParseError("Malformatted or missing costume id " + cos);
    }
    return cos;
  });

  const costumesInDb = await costumesService.getCostumesByIds(costumeIds);

  if (costumesInDb.length !== costumes.length) {
    throw new ParseError("One or more costume(s) do not exist");
  }
  return costumesInDb.map((cos) => {
    if (!cos || !cos.id) {
      throw new ParseError(
        "Malformatted or missing costume item id " + cos.itemId
      );
    }
    return cos.id;
  });
};

const parseIsPublic = (pub: unknown): boolean => {
  if (!isBoolean(pub)) {
    throw new ParseError("Malformatted or missing isPublic " + pub);
  }
  return pub;
};

const parseCostumeSetId = (costumeSetId: unknown): string => {
  if (!costumeSetId || !isString(costumeSetId)) {
    throw new ParseError(
      "Malformatted or missing costumeSet id " + costumeSetId
    );
  }
  return costumeSetId;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const toCostumeSetId = (object: any): string => {
  return parseCostumeSetId(object.costumeSetId);
};

export const toNewCostumeSet = async (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  object: any,
  owner: mongoose.Types.ObjectId
): Promise<NewCostumeSet> => {
  const newCostumeSet: NewCostumeSet = {
    name: parseName(object.name),
    description: parseDescription(object.description),
    costumes: await parseCostumes(object.costumes),
    likes: 0,
    owner: owner,
    isPublic: parseIsPublic(object.isPublic),
  };
  return newCostumeSet;
};

export const toCostumeSetUpdatableFields = async (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  object: any
): Promise<CostumeSetUpdatableFields> => {
  const updatedCostumeSetFields: CostumeSetUpdatableFields = {
    name: parseName(object.name),
    description: parseDescription(object.description),
    costumes: await parseCostumes(object.costumes),
    isPublic: parseIsPublic(object.isPublic),
  };
  return updatedCostumeSetFields;
};
