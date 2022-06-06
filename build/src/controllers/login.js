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
const usersService_1 = __importDefault(require("../services/usersService"));
const users_1 = require("../utils/typeParsers/users");
const loginRouter = (0, express_1.Router)();
// baseurl = api/login
// ping pong
loginRouter.get("/ping", (_req, res) => {
    res.json({ message: "login pong" });
});
// login user
loginRouter.post("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = (0, users_1.toUserLoginCreds)(req.body);
    let userWithToken;
    try {
        userWithToken = yield usersService_1.default.verifyUser({ username, password });
    }
    catch (error) {
        return res.status(401).json({
            error: "invalid username or password",
        });
    }
    return res.status(200).json(userWithToken);
}));
exports.default = loginRouter;
