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
const users_1 = require("../utils/typeParsers/users");
const usersService_1 = __importDefault(require("../services/usersService"));
const middleware_1 = __importDefault(require("../utils/middleware"));
const usersRouter = (0, express_1.Router)();
// baseurl = api/users
// admin get all users
usersRouter.get("/", middleware_1.default.userExtractor, middleware_1.default.isUserAdmin, (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.json(yield usersService_1.default.getAllUsers());
}));
// get requesting user's info
usersRouter.get("/self", middleware_1.default.userExtractor, (req, res) => {
    res.json(req.user);
});
// sign up
usersRouter.post("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = (0, users_1.toUserLoginCreds)(req.body);
    if (username.length < 3 || username.length > 50) {
        return res.status(400).json({
            error: "username must be between 3 - 50 characters",
        });
    }
    if (password.length < 3 || password.length > 50) {
        return res.status(400).json({
            error: "password must be between 3 - 50 characters",
        });
    }
    const existingUser = yield usersService_1.default.getUserByUsername(username);
    if (existingUser) {
        return res.status(400).json({
            error: "username must be unique",
        });
    }
    const savedUser = yield usersService_1.default.addUser({ username, password });
    return res.status(201).json(savedUser);
}));
exports.default = usersRouter;
