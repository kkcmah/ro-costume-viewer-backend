"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toCostumeSetsPagedParams = void 0;
const helpers_1 = require("./helpers");
const parseLastSeenIds = (lastSeenIds) => {
    if (!Array.isArray(lastSeenIds) || lastSeenIds.length === 0) {
        return null;
    }
    const lastSeenIdsString = [];
    for (const id of lastSeenIds) {
        if (!(0, helpers_1.isString)(id)) {
            return null;
        }
        lastSeenIdsString.push(id);
    }
    return lastSeenIdsString;
};
const parseName = (name) => {
    if (!(0, helpers_1.isString)(name)) {
        return null;
    }
    return name;
};
const parseLastLikeValue = (lastLikeValue) => {
    if (!(0, helpers_1.isNumber)(lastLikeValue)) {
        return null;
    }
    return lastLikeValue;
};
const toCostumeSetsPagedParams = (
// eslint-disable-next-line @typescript-eslint/no-explicit-any
object) => {
    const costumeSetsPagedParams = {
        lastSeenIds: parseLastSeenIds(object.lastSeenIds),
        name: parseName(object.name),
        lastLikeValue: parseLastLikeValue(object.lastLikeValue),
    };
    return costumeSetsPagedParams;
};
exports.toCostumeSetsPagedParams = toCostumeSetsPagedParams;
