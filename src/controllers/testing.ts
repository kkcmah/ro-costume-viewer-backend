/* eslint-disable @typescript-eslint/no-misused-promises */
import { Router } from "express";
import User from "../models/user";

const testingRouter = Router();
// baseurl = api/testing
// ENSURE this router is only being used in env test and
// utils/config is pointing at test database

testingRouter.post("/resetUsers", async (_req, res) => {
  // reset test database for testing
  await User.deleteMany({});
  res.status(204).end();
});

export default testingRouter;
