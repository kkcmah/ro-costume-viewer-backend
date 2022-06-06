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
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const costume_1 = __importDefault(require("../models/costume"));
const user_1 = __importDefault(require("../models/user"));
const types_1 = require("../types");
const oneCostume = {
    itemId: 124,
    name: "poring hat",
    equipSlots: [types_1.EquipSlot.Top],
    costumeTags: [],
    previewUrl: "",
    className: "",
};
const initialCostumes = [
    {
        itemId: 12,
        name: "poring hat",
        equipSlots: [types_1.EquipSlot.Top],
        costumeTags: [],
        previewUrl: "",
        className: "",
    },
    {
        itemId: 125,
        name: "poring glasses",
        equipSlots: [types_1.EquipSlot.Middle],
        costumeTags: [],
        previewUrl: "",
        className: "",
    },
    {
        itemId: 5125,
        name: "poring bread",
        equipSlots: [types_1.EquipSlot.Lower],
        costumeTags: [],
        previewUrl: "",
        className: "",
    },
    {
        itemId: 62363,
        name: "poring aura garment",
        equipSlots: [types_1.EquipSlot.Garment],
        costumeTags: [],
        previewUrl: "",
        className: "",
    },
    {
        itemId: 2165,
        name: "poring mask",
        equipSlots: [types_1.EquipSlot.Top, types_1.EquipSlot.Middle],
        costumeTags: [],
        previewUrl: "",
        className: "",
    },
];
const nonExistingCostumeId = () => __awaiter(void 0, void 0, void 0, function* () {
    const costume = new costume_1.default({
        itemId: 123,
        name: "willberemoved",
    });
    yield costume.save();
    yield costume.remove();
    return costume._id.toString();
});
const createNormalUserToken = () => __awaiter(void 0, void 0, void 0, function* () {
    const passwordHash = yield bcrypt_1.default.hash("secretpass", 3);
    const normalUser = new user_1.default({ username: "normal", passwordHash });
    yield normalUser.save();
    const normalUserForToken = {
        username: normalUser.username,
        id: normalUser._id.toString(),
    };
    return jsonwebtoken_1.default.sign(normalUserForToken, process.env.SECRET, {
        expiresIn: "1d",
    });
});
const createAdminUserToken = () => __awaiter(void 0, void 0, void 0, function* () {
    const passwordHash = yield bcrypt_1.default.hash("secretpass", 3);
    const normalUser = new user_1.default({
        username: "normal",
        passwordHash,
        userType: types_1.UserType.Admin,
    });
    yield normalUser.save();
    const normalUserForToken = {
        username: normalUser.username,
        id: normalUser._id.toString(),
    };
    return jsonwebtoken_1.default.sign(normalUserForToken, process.env.SECRET, {
        expiresIn: "1d",
    });
});
const costumesInDb = () => __awaiter(void 0, void 0, void 0, function* () {
    const costumes = yield costume_1.default.find({});
    return costumes.map((costume) => costume.toJSON());
});
const usersInDb = () => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield user_1.default.find({});
    return users.map((user) => user.toJSON());
});
exports.default = {
    oneCostume,
    initialCostumes,
    nonExistingCostumeId,
    createNormalUserToken,
    createAdminUserToken,
    costumesInDb,
    usersInDb,
};
