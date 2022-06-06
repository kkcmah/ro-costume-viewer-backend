"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.toManyNewCostumeTags = exports.toNewCostumeTag = void 0;
const helpers_1 = require("./helpers");
const parseName = (name) => {
    if (!name || !(0, helpers_1.isString)(name)) {
        throw new helpers_1.ParseError("Malformatted or missing name " + name);
    }
    return name;
};
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const toNewCostumeTag = (object) => {
    const newCostumeTag = {
        name: parseName(object.name),
    };
    return newCostumeTag;
};
exports.toNewCostumeTag = toNewCostumeTag;
const toManyNewCostumeTags = (
// eslint-disable-next-line @typescript-eslint/no-explicit-any
object) => __awaiter(void 0, void 0, void 0, function* () {
    if (!Array.isArray(object)) {
        throw new helpers_1.ParseError("Malformatted or missing costume tags array " + object);
    }
    const manyNewCostumeTags = yield Promise.all(object.map(exports.toNewCostumeTag));
    return manyNewCostumeTags;
});
exports.toManyNewCostumeTags = toManyNewCostumeTags;
