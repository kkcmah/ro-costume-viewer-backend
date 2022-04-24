/* eslint-disable @typescript-eslint/no-misused-promises */
import { Router } from "express";
import Costume from "../models/costume";
import CostumeSet from "../models/costumeSet";
import CostumeTag from "../models/costumeTag";
import User from "../models/user";

const testingRouter = Router();
// baseurl = api/testing
// ENSURE this router is only being used in env test and
// utils/config is pointing at test database

testingRouter.post("/resetUsers", async (_req, res) => {
  await User.deleteMany({});
  res.status(204).end();
});

testingRouter.post("/resetCostumes", async (_req, res) => {
  await Costume.deleteMany({});
  res.status(204).end();
});

testingRouter.post("/resetCostumeSets", async (_req, res) => {
  await CostumeSet.deleteMany({});
  res.status(204).end();
});

testingRouter.post("/resetCostumeTags", async (_req, res) => {
  await CostumeTag.deleteMany({});
  res.status(204).end();
});

export default testingRouter;
