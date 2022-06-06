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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const costumeTag_1 = __importDefault(require("../models/costumeTag"));
const getAllCostumeTags = () => __awaiter(void 0, void 0, void 0, function* () {
    const costumeTags = yield costumeTag_1.default.find({});
    return costumeTags;
});
const getCostumeTagByName = (name) => __awaiter(void 0, void 0, void 0, function* () {
    const existingCostumeTag = yield costumeTag_1.default.findOne({ name });
    return existingCostumeTag;
});
const getCostumeTagsByIds = (costumeTagIds) => __awaiter(void 0, void 0, void 0, function* () {
    const costumeTags = yield costumeTag_1.default.find({
        _id: { $in: costumeTagIds },
    });
    return costumeTags;
});
const addCostumeTag = (newCostumeTag) => __awaiter(void 0, void 0, void 0, function* () {
    const costumeTagToAdd = new costumeTag_1.default(newCostumeTag);
    const addedCostumeTag = yield costumeTagToAdd.save();
    return addedCostumeTag;
});
const addManyCostumeTags = (manyCostumeTags) => __awaiter(void 0, void 0, void 0, function* () {
    const addedCostumeTags = yield costumeTag_1.default.insertMany(manyCostumeTags);
    return addedCostumeTags;
});
exports.default = {
    getAllCostumeTags,
    getCostumeTagByName,
    getCostumeTagsByIds,
    addCostumeTag,
    addManyCostumeTags,
};
