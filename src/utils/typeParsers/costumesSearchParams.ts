import {
  CorrectedCostumesSearchParams,
  CostumesSearchParams,
  EquipSlot,
} from "../../types";
import { isEquipSlot, isNumber, isString } from "./helpers";

const DEFAULT_PAGE = 0;
const ROWS_OPTIONS = [10, 25, 100];

const parseRows = (rows: unknown): number => {
  if (!isString(rows) || !isNumber(+rows)) {
    return ROWS_OPTIONS[0];
  }
  if (ROWS_OPTIONS.includes(+rows)) {
    return +rows;
  } else {
    return ROWS_OPTIONS[0];
  }
};

const parsePage = (page: unknown): number => {
  if (!isString(page) || !isNumber(+page)) {
    return DEFAULT_PAGE;
  }
  if (+page < 0) {
    return DEFAULT_PAGE;
  } else {
    return +page;
  }
};

const parseItemId = (itemId: unknown): number | null => {
  if (!isString(itemId) || !isNumber(+itemId)) {
    return null;
  }
  return +itemId;
};

const parseName = (name: unknown): string | null => {
  if (!isString(name)) {
    return null;
  }
  return name;
};

const parseEquipSlots = (equipSlots: unknown): EquipSlot[] | null => {
  if (!isString(equipSlots)) {
    return null;
  }
  const equipSlotsArr = equipSlots.split(",");
  const parsedEquipSlots = [];
  for (const slot of equipSlotsArr) {
    if (isEquipSlot(slot)) {
      parsedEquipSlots.push(slot);
    }
  }
  if (parsedEquipSlots.length === 0) {
    return null;
  }
  return parsedEquipSlots;
};

const getCorrectedParams = ({
  rows,
  page,
  itemId,
  name,
  equipSlots,
}: CostumesSearchParams): CorrectedCostumesSearchParams => {
  const correctedParams: CorrectedCostumesSearchParams = {
    rows: rows.toString(),
    page: page.toString(),
  };
  if (itemId !== null) correctedParams.itemId = itemId.toString();
  if (name !== null) correctedParams.name = name;
  if (equipSlots !== null) correctedParams.equipSlots = equipSlots.join(",");
  return correctedParams;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const toCostumesSearchParams = (object: any): CostumesSearchParams => {
  const costumesSearchParams: CostumesSearchParams = {
    rows: parseRows(object.rows),
    page: parsePage(object.page),
    itemId: parseItemId(object.itemId),
    name: parseName(object.name),
    equipSlots: parseEquipSlots(object.equipSlots),
    rowsOptions: ROWS_OPTIONS,
    correctedParams: {},
  };

  costumesSearchParams.correctedParams =
    getCorrectedParams(costumesSearchParams);

  return costumesSearchParams;
};
