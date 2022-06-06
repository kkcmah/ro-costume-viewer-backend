"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable @typescript-eslint/no-misused-promises */
const express_1 = require("express");
const profileRouter = (0, express_1.Router)();
// baseurl = api/profile
// TODO remove later just checking if app.js user extractor works
profileRouter.get("/", (req, res) => {
    var _a;
    res.json({ message: `you are recognized as: ${(_a = req.user) === null || _a === void 0 ? void 0 : _a.username}` });
});
exports.default = profileRouter;
