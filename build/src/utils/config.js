"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
// import * as dotenv from "dotenv";
// dotenv.config();
const PORT = process.env.PORT;
const MONGODB_URI = process.env.NODE_ENV === "test"
    ? process.env.TEST_MONGODB_URI
    : process.env.MONGODB_URI;
exports.default = { MONGODB_URI, PORT };
