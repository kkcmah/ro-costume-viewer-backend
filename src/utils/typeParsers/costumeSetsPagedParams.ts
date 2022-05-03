import { CostumeSetsPagedParams } from "../../types";
import { isNumber, isString } from "./helpers";

const parseLastSeenIds = (lastSeenIds: unknown): string[] | null => {
  if (!Array.isArray(lastSeenIds) || lastSeenIds.length === 0) {
    return null;
  }
  const lastSeenIdsString = [];
  for (const id of lastSeenIds) {
    if (!isString(id)) {
      return null;
    }
    lastSeenIdsString.push(id);
  }
  return lastSeenIdsString;
};

const parseName = (name: unknown): string | null => {
  if (!isString(name)) {
    return null;
  }
  return name;
};

const parseLastLikeValue = (lastLikeValue: unknown): number | null => {
  if (!isNumber(lastLikeValue)) {
    return null;
  }
  return lastLikeValue;
};

export const toCostumeSetsPagedParams = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  object: any
): CostumeSetsPagedParams => {
  const costumeSetsPagedParams: CostumeSetsPagedParams = {
    lastSeenIds: parseLastSeenIds(object.lastSeenIds),
    name: parseName(object.name),
    lastLikeValue: parseLastLikeValue(object.lastLikeValue),
  };

  return costumeSetsPagedParams;
};
