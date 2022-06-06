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
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const user_1 = __importDefault(require("../models/user"));
const getAllUsers = () => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield user_1.default.find({});
    return users;
});
const getUserById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_1.default.findById(id);
    return user;
});
const getUserByUsername = (username) => __awaiter(void 0, void 0, void 0, function* () {
    const existingUser = yield user_1.default.findOne({ username });
    return existingUser;
});
const addUser = ({ username, password, }) => __awaiter(void 0, void 0, void 0, function* () {
    const saltRounds = 10;
    const passwordHash = yield bcrypt_1.default.hash(password, saltRounds);
    const addedUser = new user_1.default({ username, passwordHash });
    yield addedUser.save();
    return addedUser;
});
const verifyUser = ({ username, password, }) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_1.default.findOne({ username });
    const passwordCorrect = !user
        ? false
        : yield bcrypt_1.default.compare(password, user.passwordHash);
    if (!user || !passwordCorrect) {
        throw new Error("verification failed");
    }
    const userForToken = {
        username: user.username,
        id: user._id.toString(),
    };
    const token = jsonwebtoken_1.default.sign(userForToken, process.env.SECRET, {
        expiresIn: "1d",
    });
    return Object.assign({ token }, user.toJSON());
});
const favoriteCostume = (user, costumeId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield user_1.default.findByIdAndUpdate(user.id, {
        $addToSet: { favCostumes: costumeId },
    }, { new: true });
});
const unFavoriteCostume = (user, costumeId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield user_1.default.findByIdAndUpdate(user.id, {
        $pull: { favCostumes: costumeId },
    }, { new: true });
});
const likeCostumeSet = (user, costumeSetId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield user_1.default.findByIdAndUpdate(user.id, {
        $addToSet: { likedCostumeSets: costumeSetId },
    }, { new: true });
});
const unlikeCostumeSet = (user, costumeSetId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield user_1.default.findByIdAndUpdate(user.id, {
        $pull: { likedCostumeSets: costumeSetId },
    }, { new: true });
});
exports.default = {
    getAllUsers,
    getUserById,
    getUserByUsername,
    addUser,
    verifyUser,
    favoriteCostume,
    unFavoriteCostume,
    likeCostumeSet,
    unlikeCostumeSet,
};
