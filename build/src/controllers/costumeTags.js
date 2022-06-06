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
const costumeTagsService_1 = __importDefault(require("../services/costumeTagsService"));
const middleware_1 = __importDefault(require("../utils/middleware"));
const costumeTag_1 = require("../utils/typeParsers/costumeTag");
const costumeTagsRouter = (0, express_1.Router)();
// baseurl = api/costumeTags
// get all costume tags
costumeTagsRouter.get("/", (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const costumeTags = yield costumeTagsService_1.default.getAllCostumeTags();
    res.status(200).json(costumeTags);
}));
// create a costume tag
costumeTagsRouter.post("/", middleware_1.default.userExtractor, middleware_1.default.isUserAdmin, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const newCostumeTag = (0, costumeTag_1.toNewCostumeTag)(req.body);
    const existingCostumeTag = yield costumeTagsService_1.default.getCostumeTagByName(newCostumeTag.name);
    if (existingCostumeTag) {
        res.status(400).json({ error: "costume tag must be unique" });
    }
    else {
        const addedCostumeTag = yield costumeTagsService_1.default.addCostumeTag(newCostumeTag);
        res.status(201).json(addedCostumeTag);
    }
}));
exports.default = costumeTagsRouter;
