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
/* eslint-disable @typescript-eslint/no-misused-promises */
const express_1 = require("express");
const costumeSetsService_1 = __importDefault(require("../services/costumeSetsService"));
const usersService_1 = __importDefault(require("../services/usersService"));
const middleware_1 = __importDefault(require("../utils/middleware"));
const costumeSet_1 = require("../utils/typeParsers/costumeSet");
const costumeSetsPagedParams_1 = require("../utils/typeParsers/costumeSetsPagedParams");
const costumeSetsRouter = (0, express_1.Router)();
// baseurl = api/costumeSets
// admin get all public costume sets
costumeSetsRouter.get("/", middleware_1.default.userExtractor, middleware_1.default.isUserAdmin, (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const costumeSets = yield costumeSetsService_1.default.getAllPublicCostumeSets();
    res.status(200).json(costumeSets);
}));
// get a single public costume set by id
costumeSetsRouter.get("/:costumeSetId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const costumeSetId = (0, costumeSet_1.toCostumeSetId)(req.params);
    const costumeSet = yield costumeSetsService_1.default.getPublicCostumeSetById(costumeSetId);
    res.status(200).json(costumeSet);
}));
// get a owned costume set by id used when editing or profile
costumeSetsRouter.get("/owned/:costumeSetId", middleware_1.default.userExtractor, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.user || !req.user.id) {
        return res.status(400).json({ error: "you must be logged in" });
    }
    const costumeSetId = (0, costumeSet_1.toCostumeSetId)(req.params);
    const costumeSet = yield costumeSetsService_1.default.getCostumeSetById(costumeSetId);
    if (!costumeSet) {
        return res.status(400).json({ error: "could not locate costume set" });
    }
    if (costumeSet.owner.id.toString() === req.user.id.toString()) {
        return res.status(200).json(costumeSet);
    }
    else {
        return res
            .status(401)
            .json({ error: "You are not the owner of this costume set" });
    }
}));
// get paged costume sets
costumeSetsRouter.post("/params", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const costumeSetsPagedParams = (0, costumeSetsPagedParams_1.toCostumeSetsPagedParams)(req.body);
    const costumeSetsWithCount = yield costumeSetsService_1.default.getPublicCostumeSetsPaged(costumeSetsPagedParams);
    res.status(200).json(costumeSetsWithCount);
}));
// get users liked costume sets paged from profile
costumeSetsRouter.post("/profileliked/params", middleware_1.default.userExtractor, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.user || !req.user.id) {
        return res
            .status(400)
            .json({ error: "you must be logged in to view liked costume sets" });
    }
    if (req.user.likedCostumeSets.length === 0) {
        // return a dummy empty object to avoid hitting database
        const emptyRetObj = {
            costumeSets: [],
            count: 0,
        };
        return res.json(emptyRetObj);
    }
    const costumeSetsPagedParams = (0, costumeSetsPagedParams_1.toCostumeSetsPagedParams)(req.body);
    const costumeSetsWithCount = yield costumeSetsService_1.default.getLikedCostumeSetsPaged(costumeSetsPagedParams, req.user.likedCostumeSets, req.user.id);
    return res.status(200).json(costumeSetsWithCount);
}));
// get users owned costume sets paged from profile
costumeSetsRouter.post("/owned/params", middleware_1.default.userExtractor, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.user || !req.user.id) {
        return res
            .status(400)
            .json({ error: "you must be logged in to view your costume sets" });
    }
    const costumeSetsPagedParams = (0, costumeSetsPagedParams_1.toCostumeSetsPagedParams)(req.body);
    const costumeSetsWithCount = yield costumeSetsService_1.default.getOwnedCostumeSetsPaged(costumeSetsPagedParams, req.user.id);
    return res.status(200).json(costumeSetsWithCount);
}));
// create a costume set
costumeSetsRouter.post("/", middleware_1.default.userExtractor, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.user || !req.user.id) {
        return res
            .status(400)
            .json({ error: "You must be logged in to create a costume set" });
    }
    const costumeSetToAdd = yield (0, costumeSet_1.toNewCostumeSet)(req.body, req.user.id);
    const addedCostumeSet = yield costumeSetsService_1.default.addCostumeSet(costumeSetToAdd);
    return res.status(201).json(addedCostumeSet);
}));
// delete a costume set if user is owner
costumeSetsRouter.delete("/:costumeSetId", middleware_1.default.userExtractor, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.user || !req.user.id) {
        return res
            .status(400)
            .json({ error: "You must be logged in to delete a costume set" });
    }
    const costumeSetIdToDelete = (0, costumeSet_1.toCostumeSetId)(req.params);
    const costumeSetToDel = yield costumeSetsService_1.default.getCostumeSetById(costumeSetIdToDelete);
    if (!costumeSetToDel) {
        return res.status(200).json({ message: "costume set already deleted" });
    }
    if (costumeSetToDel.owner.id.toString() === req.user.id.toString()) {
        const deletedCostumeSet = yield costumeSetsService_1.default.deleteCostumeSet(costumeSetIdToDelete);
        return res
            .status(200)
            .json({ message: `deleted set name: ${deletedCostumeSet === null || deletedCostumeSet === void 0 ? void 0 : deletedCostumeSet.name}` });
    }
    else {
        return res
            .status(401)
            .json({ error: "You are not the owner of this costume set" });
    }
}));
// like a costume set
costumeSetsRouter.post("/:id/like", middleware_1.default.userExtractor, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.user) {
        return res
            .status(400)
            .json({ error: "you must be logged in to like a costume set" });
    }
    const costumeSetId = req.params.id;
    const isSetAlreadyLiked = req.user.likedCostumeSets.findIndex((lcs) => lcs.toString() === costumeSetId) !== -1;
    if (isSetAlreadyLiked) {
        return res.status(200).json(req.user.likedCostumeSets);
    }
    const updatedUser = yield usersService_1.default.likeCostumeSet(req.user, costumeSetId);
    if (!updatedUser) {
        return res.status(400).json({ error: "failed to like costume set" });
    }
    yield costumeSetsService_1.default.likeCostumeSet(costumeSetId);
    return res.status(200).json(updatedUser.likedCostumeSets);
}));
// unlike a costume set
costumeSetsRouter.post("/:id/unlike", middleware_1.default.userExtractor, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.user) {
        return res
            .status(400)
            .json({ error: "you must be logged in to unlike a costume set" });
    }
    const costumeSetId = req.params.id;
    const isSetAlreadyUnliked = req.user.likedCostumeSets.findIndex((lcs) => lcs.toString() === costumeSetId) === -1;
    if (isSetAlreadyUnliked) {
        return res.status(200).json(req.user.likedCostumeSets);
    }
    const updatedUser = yield usersService_1.default.unlikeCostumeSet(req.user, costumeSetId);
    if (!updatedUser) {
        return res.status(400).json({ error: "failed to unlike costume set" });
    }
    yield costumeSetsService_1.default.unlikeCostumeSet(costumeSetId);
    return res.status(200).json(updatedUser.likedCostumeSets);
}));
// update a costume set
costumeSetsRouter.patch("/:id", middleware_1.default.userExtractor, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.user || !req.user.id) {
        return res
            .status(400)
            .json({ error: "You must be logged in to update a costume set" });
    }
    const costumeSetToUpdate = yield costumeSetsService_1.default.getCostumeSetById(req.params.id);
    if (!costumeSetToUpdate ||
        costumeSetToUpdate.owner.id.toString() !== req.user.id.toString()) {
        return res.status(401).json({
            error: "You do not have permissions to update this costume set",
        });
    }
    const updatedCostumeSetFields = yield (0, costumeSet_1.toCostumeSetUpdatableFields)(req.body);
    const updatedCostumeSet = yield costumeSetsService_1.default.updateCostumeSet(req.params.id, updatedCostumeSetFields);
    if (!updatedCostumeSet) {
        return res.status(400).json({ error: "failed to update costume set" });
    }
    return res.status(200).json(updatedCostumeSet);
}));
exports.default = costumeSetsRouter;
