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
exports.toManyNewCostumes = exports.toNewCostume = exports.toCostumeId = void 0;
const costumeTagsService_1 = __importDefault(require("../../services/costumeTagsService"));
const helpers_1 = require("./helpers");
const parseCostumeId = (costumeId) => {
    if (!costumeId || !(0, helpers_1.isString)(costumeId)) {
        throw new helpers_1.ParseError("Malformatted or missing costume id " + costumeId);
    }
    return costumeId;
};
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const toCostumeId = (object) => {
    return parseCostumeId(object.costumeId);
};
exports.toCostumeId = toCostumeId;
const parseItemId = (itemId) => {
    if (itemId === null || itemId === undefined || !(0, helpers_1.isNumber)(itemId)) {
        throw new helpers_1.ParseError("Malformatted or missing itemId " + itemId);
    }
    return itemId;
};
const parseName = (name) => {
    if (!name || !(0, helpers_1.isString)(name)) {
        throw new helpers_1.ParseError("Malformatted or missing name " + name);
    }
    return name;
};
const parseEquipSlot = (equipSlot) => {
    if (!(0, helpers_1.isEquipSlot)(equipSlot)) {
        throw new helpers_1.ParseError("Malformatted or missing equipslot " + equipSlot);
    }
    return equipSlot;
};
const parseEquipSlots = (equipSlots) => {
    if (!equipSlots || !Array.isArray(equipSlots)) {
        throw new helpers_1.ParseError("Malformatted or missing equipSlots " + equipSlots);
    }
    return equipSlots.map((slot) => parseEquipSlot(slot));
};
const parseCostumeTags = (costumeTags) => __awaiter(void 0, void 0, void 0, function* () {
    if (!costumeTags || !Array.isArray(costumeTags)) {
        throw new helpers_1.ParseError("Malformatted or missing costumeTags " + costumeTags);
    }
    const costumeTagIds = costumeTags.map((cos) => {
        if (!cos || !(0, helpers_1.isString)(cos)) {
            throw new helpers_1.ParseError("Malformatted or missing costumeTag id " + cos);
        }
        return cos;
    });
    const costumeTagsInDb = yield costumeTagsService_1.default.getCostumeTagsByIds(costumeTagIds);
    if (costumeTagsInDb.length !== costumeTags.length) {
        throw new helpers_1.ParseError("One or more costumeTag(s) do not exist");
    }
    return costumeTagsInDb.map((cos) => {
        if (!cos || !cos.id) {
            throw new helpers_1.ParseError("Malformatted or missing costumeTag id " + cos.name);
        }
        return cos.id;
    });
});
const parsePreviewUrl = (previewUrl) => {
    if (!(0, helpers_1.isString)(previewUrl)) {
        throw new helpers_1.ParseError("Malformatted or missing previewUrl " + previewUrl);
    }
    return previewUrl;
};
const parseClassName = (className) => {
    if (!className || !(0, helpers_1.isString)(className)) {
        throw new helpers_1.ParseError("Malformatted or missing className " + className);
    }
    return className;
};
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const toNewCostume = (object) => __awaiter(void 0, void 0, void 0, function* () {
    const newCostume = {
        itemId: parseItemId(object.itemId),
        name: parseName(object.name),
        equipSlots: parseEquipSlots(object.equipSlots),
        costumeTags: yield parseCostumeTags(object.costumeTags),
        previewUrl: parsePreviewUrl(object.previewUrl),
        className: parseClassName(object.className),
    };
    return newCostume;
});
exports.toNewCostume = toNewCostume;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const toManyNewCostumes = (object) => __awaiter(void 0, void 0, void 0, function* () {
    //const manyNewCostumes: NewCostume[] = [];
    if (!Array.isArray(object)) {
        throw new helpers_1.ParseError("Malformatted or missing costumes array " + object);
    }
    const manyNewCostumes = yield Promise.all(object.map(exports.toNewCostume));
    return manyNewCostumes;
});
exports.toManyNewCostumes = toManyNewCostumes;
