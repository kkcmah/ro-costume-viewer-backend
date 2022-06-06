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
exports.toCostumeSetUpdatableFields = exports.toNewCostumeSet = exports.toCostumeSetId = void 0;
const costumesService_1 = __importDefault(require("../../services/costumesService"));
const helpers_1 = require("./helpers");
const parseName = (name) => {
    if (!name || !(0, helpers_1.isString)(name)) {
        throw new helpers_1.ParseError("Malformatted or missing name " + name);
    }
    if (name.length > 100) {
        throw new helpers_1.ParseError("name must be less than 100 characters long: " + name);
    }
    return name;
};
const parseDescription = (desc) => {
    if (!desc || !(0, helpers_1.isString)(desc)) {
        throw new helpers_1.ParseError("Malformatted or missing description " + desc);
    }
    if (desc.length > 300) {
        throw new helpers_1.ParseError("description must be less than 300 characters: " + desc);
    }
    return desc;
};
const parseCostumes = (costumes) => __awaiter(void 0, void 0, void 0, function* () {
    if (!costumes || !Array.isArray(costumes) || costumes.length < 1) {
        throw new helpers_1.ParseError("Malformatted or missing costumes " + costumes);
    }
    const costumeIds = costumes.map((cos) => {
        if (!cos || !(0, helpers_1.isString)(cos)) {
            throw new helpers_1.ParseError("Malformatted or missing costume id " + cos);
        }
        return cos;
    });
    const costumesInDb = yield costumesService_1.default.getCostumesByIds(costumeIds);
    if (costumesInDb.length !== costumes.length) {
        throw new helpers_1.ParseError("One or more costume(s) do not exist");
    }
    return costumesInDb.map((cos) => {
        if (!cos || !cos.id) {
            throw new helpers_1.ParseError("Malformatted or missing costume item id " + cos.itemId);
        }
        return cos.id;
    });
});
const parseIsPublic = (pub) => {
    if (!(0, helpers_1.isBoolean)(pub)) {
        throw new helpers_1.ParseError("Malformatted or missing isPublic " + pub);
    }
    return pub;
};
const parseCostumeSetId = (costumeSetId) => {
    if (!costumeSetId || !(0, helpers_1.isString)(costumeSetId)) {
        throw new helpers_1.ParseError("Malformatted or missing costumeSet id " + costumeSetId);
    }
    return costumeSetId;
};
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const toCostumeSetId = (object) => {
    return parseCostumeSetId(object.costumeSetId);
};
exports.toCostumeSetId = toCostumeSetId;
const toNewCostumeSet = (
// eslint-disable-next-line @typescript-eslint/no-explicit-any
object, owner) => __awaiter(void 0, void 0, void 0, function* () {
    const newCostumeSet = {
        name: parseName(object.name),
        description: parseDescription(object.description),
        costumes: yield parseCostumes(object.costumes),
        likes: 0,
        owner: owner,
        isPublic: parseIsPublic(object.isPublic),
    };
    return newCostumeSet;
});
exports.toNewCostumeSet = toNewCostumeSet;
const toCostumeSetUpdatableFields = (
// eslint-disable-next-line @typescript-eslint/no-explicit-any
object) => __awaiter(void 0, void 0, void 0, function* () {
    const updatedCostumeSetFields = {
        name: parseName(object.name),
        description: parseDescription(object.description),
        costumes: yield parseCostumes(object.costumes),
        isPublic: parseIsPublic(object.isPublic),
    };
    return updatedCostumeSetFields;
});
exports.toCostumeSetUpdatableFields = toCostumeSetUpdatableFields;
