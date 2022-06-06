"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
// import adminService from "../services/adminService";
const adminRouter = (0, express_1.Router)();
// baseurl = api/admin
// controller used to initialize database with costumes
// admin create many new costumes
adminRouter.get("/initialize", (_req, res) => {
    // assuming that the database is clean
    // for future use:
    // create new function to update documents so that ids are preserved
    // //  adminService.initializeCostumes();
    res.json("initted check rawdata result");
});
exports.default = adminRouter;
