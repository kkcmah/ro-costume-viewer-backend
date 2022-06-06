"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toCostumesSearchParams = void 0;
const helpers_1 = require("./helpers");
const DEFAULT_PAGE = 0;
const ROWS_OPTIONS = [10, 25, 100];
const parseRows = (rows) => {
    if (!(0, helpers_1.isString)(rows) || !(0, helpers_1.isNumber)(+rows)) {
        return ROWS_OPTIONS[0];
    }
    if (ROWS_OPTIONS.includes(+rows)) {
        return +rows;
    }
    else {
        return ROWS_OPTIONS[0];
    }
};
const parsePage = (page) => {
    if (!(0, helpers_1.isString)(page) || !(0, helpers_1.isNumber)(+page)) {
        return DEFAULT_PAGE;
    }
    if (+page < 0) {
        return DEFAULT_PAGE;
    }
    else {
        return +page;
    }
};
const parseItemId = (itemId) => {
    if (!(0, helpers_1.isString)(itemId) || !(0, helpers_1.isNumber)(+itemId)) {
        return null;
    }
    return +itemId;
};
const parseName = (name) => {
    if (!(0, helpers_1.isString)(name)) {
        return null;
    }
    return name;
};
const parseEquipSlots = (equipSlots) => {
    if (!(0, helpers_1.isString)(equipSlots)) {
        return null;
    }
    const equipSlotsArr = equipSlots.split(",");
    const parsedEquipSlots = [];
    for (const slot of equipSlotsArr) {
        if ((0, helpers_1.isEquipSlot)(slot)) {
            parsedEquipSlots.push(slot);
        }
    }
    if (parsedEquipSlots.length === 0) {
        return null;
    }
    return parsedEquipSlots;
};
const getCorrectedParams = ({ rows, page, itemId, name, equipSlots, }) => {
    const correctedParams = {
        rows: rows.toString(),
        page: page.toString(),
    };
    if (itemId !== null)
        correctedParams.itemId = itemId.toString();
    if (name !== null)
        correctedParams.name = name;
    if (equipSlots !== null)
        correctedParams.equipSlots = equipSlots.join(",");
    return correctedParams;
};
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const toCostumesSearchParams = (object) => {
    const costumesSearchParams = {
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
exports.toCostumesSearchParams = toCostumesSearchParams;
