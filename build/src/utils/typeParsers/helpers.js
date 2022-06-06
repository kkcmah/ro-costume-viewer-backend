"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isBoolean = exports.isEquipSlot = exports.isNumber = exports.isDate = exports.isString = exports.ParseError = void 0;
const types_1 = require("../../types");
class ParseError extends Error {
    constructor(message) {
        super(message);
        this.name = "ParseError";
    }
}
exports.ParseError = ParseError;
const isString = (text) => {
    return typeof text === "string" || text instanceof String;
};
exports.isString = isString;
const isDate = (date) => {
    return Boolean(Date.parse(date));
};
exports.isDate = isDate;
const isNumber = (param) => {
    return typeof param === "number" && !isNaN(param);
};
exports.isNumber = isNumber;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const isEquipSlot = (param) => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    return Object.values(types_1.EquipSlot).includes(param);
};
exports.isEquipSlot = isEquipSlot;
const isBoolean = (param) => {
    return typeof param === "boolean";
};
exports.isBoolean = isBoolean;
