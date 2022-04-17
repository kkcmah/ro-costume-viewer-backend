import config from "./utils/config";
import express from "express";
import helmet from "helmet";
// eliminates try catch in async await by passing error to next middleware
require("express-async-errors");
const app = express();
import cors from "cors";
import mongoose from "mongoose";
import costumesRouter from "./controllers/costumes";
import usersRouter from "./controllers/users";
import loginRouter from "./controllers/login";
import middleware from "./utils/middleware";

import testingRouter from "./controllers/testing";
import profileRouter from "./controllers/profile";

void mongoose.connect(config.MONGODB_URI as string);

app.use(helmet());
app.use(cors());
app.use(express.static("build"));
app.use(express.json());
// use the middleware in all routes
app.use(middleware.tokenExtractor);

app.use("/api/users", usersRouter);
// use the middleware only in protected routes
// via middleware chaining can also register to specific route in controller
// eslint-disable-next-line @typescript-eslint/no-misused-promises
app.use("/api/profile", middleware.userExtractor, profileRouter);
app.use("/api/costumes", costumesRouter);
app.use("/api/login", loginRouter);

if (process.env.NODE_ENV === "test") {
  app.use("/api/testing", testingRouter);
}

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

export default app;
