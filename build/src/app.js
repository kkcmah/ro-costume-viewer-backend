"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = __importDefault(require("./utils/config"));
const path_1 = __importDefault(require("path"));
const express_1 = __importDefault(require("express"));
const helmet_1 = __importDefault(require("helmet"));
// eliminates try catch in async await by passing error to next middleware
require("express-async-errors");
const app = (0, express_1.default)();
// import cors from "cors";
const mongoose_1 = __importDefault(require("mongoose"));
const costumes_1 = __importDefault(require("./controllers/costumes"));
const users_1 = __importDefault(require("./controllers/users"));
const login_1 = __importDefault(require("./controllers/login"));
const middleware_1 = __importDefault(require("./utils/middleware"));
const testing_1 = __importDefault(require("./controllers/testing"));
const profile_1 = __importDefault(require("./controllers/profile"));
const costumeSets_1 = __importDefault(require("./controllers/costumeSets"));
const costumeTags_1 = __importDefault(require("./controllers/costumeTags"));
const admin_1 = __importDefault(require("./controllers/admin"));
void mongoose_1.default.connect(config_1.default.MONGODB_URI);
// do hard refresh via ctrl f5 to test helmet header changes,
// otherwise cached version gets used and it looks like nothing changed
app.use((0, helmet_1.default)({
    contentSecurityPolicy: {
        directives: {
            mediaSrc: ["'self'", process.env.MEDIA_SRC],
        },
    },
    crossOriginEmbedderPolicy: false,
}));
app.use(express_1.default.static("client/build"));
app.use(express_1.default.json());
// use the middleware in all routes
app.use(middleware_1.default.tokenExtractor);
app.use("/api/users", users_1.default);
// use the middleware only in protected routes
// via middleware chaining can also register to specific route in controller
// eslint-disable-next-line @typescript-eslint/no-misused-promises
app.use("/api/profile", middleware_1.default.userExtractor, profile_1.default);
app.use("/api/costumes", costumes_1.default);
app.use("/api/costumeSets", costumeSets_1.default);
app.use("/api/costumeTags", costumeTags_1.default);
app.use("/api/login", login_1.default);
if (process.env.NODE_ENV === "test") {
    app.use("/api/testing", testing_1.default);
}
if (process.env.NODE_ENV === "development") {
    // route that I used to fill the database with initial costume data
    app.use("/api/admin", 
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    middleware_1.default.userExtractor, middleware_1.default.isUserAdmin, admin_1.default);
}
if (process.env.NODE_ENV === "production") {
    // serve the frontend index file so that routes using react router dom get displayed correctly
    app.use("*", (_req, res) => res.sendFile(path_1.default.join(__dirname, "../../client/build/index.html")));
}
app.use(middleware_1.default.unknownEndpoint);
app.use(middleware_1.default.errorHandler);
exports.default = app;
