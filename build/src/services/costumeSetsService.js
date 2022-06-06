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
const costumeSet_1 = __importDefault(require("../models/costumeSet"));
const getAllPublicCostumeSets = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield costumeSet_1.default.find({ isPublic: true })
        .populate("owner", "username")
        .populate({
        path: "costumes",
        // select: ["itemId", "name", "costumeTags"],
        populate: {
            path: "costumeTags",
        },
    });
});
const getPublicCostumeSetsPaged = (params) => __awaiter(void 0, void 0, void 0, function* () {
    const query = {};
    if (params.name !== null) {
        query.name = { $regex: new RegExp(params.name, "i") };
    }
    if (params.lastSeenIds !== null) {
        query._id = { $nin: params.lastSeenIds };
    }
    if (params.lastLikeValue !== null) {
        query.likes = { $lte: params.lastLikeValue };
    }
    query.isPublic = true;
    const costumeSets = yield costumeSet_1.default.find(query)
        .sort({ likes: -1 })
        .sort({ name: 1 })
        .collation({ locale: "en", caseLevel: true })
        .limit(10)
        .populate("owner", "username")
        .populate({
        path: "costumes",
        populate: {
            path: "costumeTags",
        },
    });
    const count = yield costumeSet_1.default.find(query).countDocuments();
    return { costumeSets, count };
});
const getLikedCostumeSetsPaged = (params, likedCostumeSetIds, profileOwnerId) => __awaiter(void 0, void 0, void 0, function* () {
    const query = {};
    if (params.name !== null) {
        query.name = { $regex: new RegExp(params.name, "i") };
    }
    if (params.lastLikeValue !== null) {
        query.likes = { $lte: params.lastLikeValue };
    }
    if (params.lastSeenIds !== null) {
        query.$and = [
            { _id: { $nin: params.lastSeenIds } },
            { _id: { $in: likedCostumeSetIds } },
        ];
    }
    else {
        query._id = { $in: likedCostumeSetIds };
    }
    // isPublic or user liked own private set
    query.$or = [{ isPublic: true }, { owner: profileOwnerId }];
    const costumeSets = yield costumeSet_1.default.find(query)
        .sort({ likes: -1 })
        .sort({ name: 1 })
        .collation({ locale: "en", caseLevel: true })
        .limit(10)
        .populate("owner", "username")
        .populate({
        path: "costumes",
        populate: {
            path: "costumeTags",
        },
    });
    const count = yield costumeSet_1.default.find(query).countDocuments();
    return { costumeSets, count };
});
const getOwnedCostumeSetsPaged = (params, profileOwnerId) => __awaiter(void 0, void 0, void 0, function* () {
    const query = {};
    if (params.name !== null) {
        query.name = { $regex: new RegExp(params.name, "i") };
    }
    if (params.lastLikeValue !== null) {
        query.likes = { $lte: params.lastLikeValue };
    }
    if (params.lastSeenIds !== null) {
        query._id = { $nin: params.lastSeenIds };
    }
    query.owner = profileOwnerId;
    const costumeSets = yield costumeSet_1.default.find(query)
        .sort({ likes: -1 })
        .sort({ name: 1 })
        .collation({ locale: "en", caseLevel: true })
        .limit(10)
        .populate("owner", "username")
        .populate({
        path: "costumes",
        populate: {
            path: "costumeTags",
        },
    });
    const count = yield costumeSet_1.default.find(query).countDocuments();
    return { costumeSets, count };
});
const getPublicCostumeSetById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const costumeSet = yield costumeSet_1.default.findById(id)
        .populate("owner", "username")
        .populate({
        path: "costumes",
        populate: {
            path: "costumeTags",
        },
    });
    if (costumeSet && !costumeSet.isPublic) {
        return null;
    }
    return costumeSet;
});
const getCostumeSetById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const costumeSet = yield costumeSet_1.default.findById(id)
        .populate("owner", "username")
        .populate({
        path: "costumes",
        populate: {
            path: "costumeTags",
        },
    });
    return costumeSet;
});
const addCostumeSet = (newCostumeSet) => __awaiter(void 0, void 0, void 0, function* () {
    const costumeSetToAdd = new costumeSet_1.default(newCostumeSet);
    const addedCostumeSet = yield costumeSetToAdd.save();
    return addedCostumeSet;
});
const deleteCostumeSet = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return yield costumeSet_1.default.findByIdAndDelete(id);
});
const likeCostumeSet = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return yield costumeSet_1.default.findByIdAndUpdate(id, {
        $inc: { likes: 1 },
    }, { new: true });
});
const unlikeCostumeSet = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return yield costumeSet_1.default.findByIdAndUpdate(id, {
        $inc: { likes: -1 },
    }, { new: true });
});
const updateCostumeSet = (id, updatableFields) => __awaiter(void 0, void 0, void 0, function* () {
    return yield costumeSet_1.default.findByIdAndUpdate(id, Object.assign({}, updatableFields), { new: true });
});
exports.default = {
    getAllPublicCostumeSets,
    getPublicCostumeSetsPaged,
    getPublicCostumeSetById,
    getLikedCostumeSetsPaged,
    getOwnedCostumeSetsPaged,
    getCostumeSetById,
    addCostumeSet,
    deleteCostumeSet,
    likeCostumeSet,
    unlikeCostumeSet,
    updateCostumeSet,
};
