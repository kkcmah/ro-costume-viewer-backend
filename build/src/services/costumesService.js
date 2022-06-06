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
const costume_1 = __importDefault(require("../models/costume"));
const getAllCostumes = () => __awaiter(void 0, void 0, void 0, function* () {
    const costumes = yield costume_1.default.find({});
    return costumes;
});
const getCostumesByParams = (params, isProfile = false, favCostumeIds = []) => __awaiter(void 0, void 0, void 0, function* () {
    const query = {};
    if (params.name !== null)
        query.name = { $regex: new RegExp(params.name, "i") };
    if (params.itemId !== null)
        query.itemId = params.itemId;
    if (params.equipSlots !== null)
        query.equipSlots = { $all: params.equipSlots };
    // additional queries if from profile
    if (isProfile) {
        query._id = { $in: favCostumeIds };
    }
    const costumes = yield costume_1.default.find(query)
        .sort({ name: 1 })
        .collation({ locale: "en", caseLevel: true })
        .skip(params.page * params.rows)
        .limit(params.rows)
        .populate("costumeTags");
    const count = yield costume_1.default.find(query).countDocuments();
    return { costumes, count };
});
const getCostumeById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const costume = yield costume_1.default.findById(id);
    return costume;
});
const getCostumesByIds = (costumeIds) => __awaiter(void 0, void 0, void 0, function* () {
    const costumes = yield costume_1.default.find({
        _id: { $in: costumeIds },
    });
    return costumes;
});
const addCostume = (newCostume) => __awaiter(void 0, void 0, void 0, function* () {
    const costumeToAdd = new costume_1.default(newCostume);
    const addedCostume = yield costumeToAdd.save();
    return addedCostume;
});
const addManyCostumes = (manyNewCostumes) => __awaiter(void 0, void 0, void 0, function* () {
    const addedCostumes = yield costume_1.default.insertMany(manyNewCostumes);
    return addedCostumes;
});
exports.default = {
    getAllCostumes,
    getCostumesByParams,
    getCostumeById,
    addCostume,
    addManyCostumes,
    getCostumesByIds,
};
