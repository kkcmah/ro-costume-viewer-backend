import { NewCostumeTag } from "../../types";
import { isString, ParseError } from "./helpers";

const parseName = (name: unknown): string => {
  if (!name || !isString(name)) {
    throw new ParseError("Malformatted or missing name " + name);
  }
  return name;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const toNewCostumeTag = (object: any): NewCostumeTag => {
  const newCostumeTag: NewCostumeTag = {
    name: parseName(object.name),
  };
  return newCostumeTag;
};

export const toManyNewCostumeTags = async (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  object: any
): Promise<NewCostumeTag[]> => {
  if (!Array.isArray(object)) {
    throw new ParseError(
      "Malformatted or missing costume tags array " + object
    );
  }
  const manyNewCostumeTags = await Promise.all(object.map(toNewCostumeTag));
  return manyNewCostumeTags;
};
