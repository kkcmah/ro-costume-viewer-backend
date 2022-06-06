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
const logger_1 = __importDefault(require("./logger"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const usersService_1 = __importDefault(require("../services/usersService"));
const types_1 = require("../types");
const tokenExtractor = (req, _res, next) => {
    const authorization = req.get("authorization");
    if (authorization && authorization.toLowerCase().startsWith("bearer ")) {
        req.token = authorization.substring(7);
    }
    next();
};
const userExtractor = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.token) {
        return res
            .status(401)
            .json({ error: "token missing or invalid. Please relogin" });
    }
    const decodedToken = jsonwebtoken_1.default.verify(req.token, process.env.SECRET);
    if (!decodedToken.id) {
        return res
            .status(401)
            .json({ error: "token missing or invalid. Please relogin" });
    }
    req.user = yield usersService_1.default.getUserById(decodedToken.id);
    return next();
});
const isUserAdmin = (req, res, next) => {
    if (!req.user || req.user.userType !== types_1.UserType.Admin) {
        res.status(401).json({ error: "you do not have sufficient permissions" });
    }
    else {
        next();
    }
};
const unknownEndpoint = (_req, res) => {
    res.status(404).json({ error: "unknown endpoint" });
};
const errorHandler = (error, _req, res, next) => {
    if (error.name === "CastError") {
        res.status(400).json({ error: "malformatted mongoose id" });
    }
    else if (error.name === "ValidationError") {
        res.status(400).json({ error: error.message });
    }
    else if (error.name === "JsonWebTokenError") {
        res.status(401).json({ error: "invalid token" });
    }
    else if (error.name === "TokenExpiredError") {
        res
            .status(401)
            .json({ error: "session expired: please log out and relogin" });
    }
    else if (error.name === "ParseError") {
        res.status(400).json({ error: error.message });
    }
    else if (error.name === "SyntaxError") {
        res.status(400).json({ error: error.message });
    }
    else {
        logger_1.default.error(error.message);
        next(error);
    }
};
exports.default = {
    tokenExtractor,
    userExtractor,
    unknownEndpoint,
    errorHandler,
    isUserAdmin,
};
