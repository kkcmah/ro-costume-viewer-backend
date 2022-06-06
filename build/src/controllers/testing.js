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
const costume_1 = __importDefault(require("../models/costume"));
const costumeSet_1 = __importDefault(require("../models/costumeSet"));
const costumeTag_1 = __importDefault(require("../models/costumeTag"));
const user_1 = __importDefault(require("../models/user"));
const costumesService_1 = __importDefault(require("../services/costumesService"));
const config_1 = __importDefault(require("../utils/config"));
const costumes_1 = require("../utils/typeParsers/costumes");
const testingRouter = (0, express_1.Router)();
// baseurl = api/testing
// ENSURE this router is only being used in env test and
// utils/config is pointing at test database
// router level middleware to check that server is in test mode
testingRouter.use((_req, res, next) => {
    if (process.env.NODE_ENV !== "test" ||
        process.env.TEST_MONGODB_URI !== config_1.default.MONGODB_URI) {
        res.status(401).json({ error: "Server is not in test mode" });
    }
    else {
        next();
    }
});
// check to see if server is running in test mode prior to running tests
testingRouter.get("/", (_req, res) => {
    res.json(process.env.NODE_ENV === "test" &&
        process.env.TEST_MONGODB_URI === config_1.default.MONGODB_URI);
});
// reset all users
testingRouter.post("/resetUsers", (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield user_1.default.deleteMany({});
    res.status(204).end();
}));
// reset all costumes
testingRouter.post("/resetCostumes", (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield costume_1.default.deleteMany({});
    res.status(204).end();
}));
// reset all costumeSets
testingRouter.post("/resetCostumeSets", (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield costumeSet_1.default.deleteMany({});
    res.status(204).end();
}));
// reset all costumeTags
testingRouter.post("/resetCostumeTags", (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield costumeTag_1.default.deleteMany({});
    res.status(204).end();
}));
// add a single costume copied from costumesRouter
testingRouter.post("/seed/costume", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const costumeToAdd = yield (0, costumes_1.toNewCostume)(req.body);
    const addedCostume = yield costumesService_1.default.addCostume(costumeToAdd);
    res.status(201).json(addedCostume);
}));
// add many costumes copied from costumesRouter
testingRouter.post("/seed/manyCostumes", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const manyCostumesToAdd = yield (0, costumes_1.toManyNewCostumes)(req.body);
    const addedCostumes = yield costumesService_1.default.addManyCostumes(manyCostumesToAdd);
    res.status(201).json(addedCostumes);
}));
exports.default = testingRouter;
