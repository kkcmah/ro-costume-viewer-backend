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
const costumesService_1 = __importDefault(require("../services/costumesService"));
const usersService_1 = __importDefault(require("../services/usersService"));
const middleware_1 = __importDefault(require("../utils/middleware"));
const costumes_1 = require("../utils/typeParsers/costumes");
const costumesSearchParams_1 = require("../utils/typeParsers/costumesSearchParams");
const costumesRouter = (0, express_1.Router)();
// baseurl = api/costumes
// admin get all costumes
costumesRouter.get("/", middleware_1.default.userExtractor, middleware_1.default.isUserAdmin, (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const costumes = yield costumesService_1.default.getAllCostumes();
    res.status(200).json(costumes);
}));
// handle query of form /params?name=cat&page=3....
// params: rows, page, itemId, name, equipSlots
costumesRouter.get("/params", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const costumesSearchParams = (0, costumesSearchParams_1.toCostumesSearchParams)(req.query);
    const costumesWithCount = yield costumesService_1.default.getCostumesByParams(costumesSearchParams);
    const costumeListRetObj = Object.assign(Object.assign({}, costumesWithCount), { rowsOptions: costumesSearchParams.rowsOptions, correctedParams: costumesSearchParams.correctedParams });
    res.status(200).json(costumeListRetObj);
}));
// get users favorite costumes paginated
costumesRouter.get("/profilefav/params", middleware_1.default.userExtractor, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.user) {
        return res
            .status(400)
            .json({ error: "you must be logged in to view favorite costumes" });
    }
    if (req.user.favCostumes.length === 0) {
        // return a dummy empty object to avoid hitting database
        const emptyRetObj = {
            rowsOptions: [],
            correctedParams: {},
            costumes: [],
            count: 0,
        };
        return res.json(emptyRetObj);
    }
    const costumesSearchParams = (0, costumesSearchParams_1.toCostumesSearchParams)(req.query);
    const costumesWithCount = yield costumesService_1.default.getCostumesByParams(costumesSearchParams, true, req.user.favCostumes);
    const costumeListRetObj = Object.assign(Object.assign({}, costumesWithCount), { rowsOptions: costumesSearchParams.rowsOptions, correctedParams: costumesSearchParams.correctedParams });
    return res.status(200).json(costumeListRetObj);
}));
// admin create new costume
costumesRouter.post("/", middleware_1.default.userExtractor, middleware_1.default.isUserAdmin, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const costumeToAdd = yield (0, costumes_1.toNewCostume)(req.body);
    const addedCostume = yield costumesService_1.default.addCostume(costumeToAdd);
    res.status(201).json(addedCostume);
}));
// admin create many new costumes
costumesRouter.post("/many", middleware_1.default.userExtractor, middleware_1.default.isUserAdmin, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const manyCostumesToAdd = yield (0, costumes_1.toManyNewCostumes)(req.body);
    const addedCostumes = yield costumesService_1.default.addManyCostumes(manyCostumesToAdd);
    res.status(201).json(addedCostumes);
}));
// add costume to user's favorite
costumesRouter.post("/favorite", middleware_1.default.userExtractor, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.user) {
        return res
            .status(400)
            .json({ error: "you must be logged in to favorite a costume" });
    }
    const costumeId = (0, costumes_1.toCostumeId)(req.body);
    const isCostumeAlreadyFavorited = req.user.favCostumes.findIndex((cos) => cos.toString() === costumeId) !==
        -1;
    if (isCostumeAlreadyFavorited) {
        return res.status(200).json(req.user.favCostumes);
    }
    const updatedUser = yield usersService_1.default.favoriteCostume(req.user, costumeId);
    if (!updatedUser) {
        return res
            .status(400)
            .json({ error: "failed to add costume to favorites" });
    }
    return res.status(200).json(updatedUser.favCostumes);
}));
// remove costume from user's favorite
costumesRouter.post("/unfavorite", middleware_1.default.userExtractor, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.user) {
        return res
            .status(400)
            .json({ error: "you must be logged in to unfavorite a costume" });
    }
    const costumeId = (0, costumes_1.toCostumeId)(req.body);
    const isCostumeAlreadyUnfavorited = req.user.favCostumes.findIndex((cos) => cos.toString() === costumeId) ===
        -1;
    if (isCostumeAlreadyUnfavorited) {
        return res.status(200).json(req.user.favCostumes);
    }
    const updatedUser = yield usersService_1.default.unFavoriteCostume(req.user, costumeId);
    if (!updatedUser) {
        return res
            .status(400)
            .json({ error: "failed to remove costume from favorites" });
    }
    return res.status(200).json(updatedUser.favCostumes);
}));
exports.default = costumesRouter;
