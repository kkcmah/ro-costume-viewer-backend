/* eslint-disable @typescript-eslint/no-misused-promises */
import { Router } from "express";
import Costume from "../models/costume";
import { EquipSlot } from "../types";
import middleware from "../utils/middleware";

const costumesRouter = Router();
// baseurl = api/costumes

costumesRouter.get("/", async (_req, res) => {
  const costumes = await Costume.find({});
  res.json(costumes);
});

costumesRouter.post(
  "/",
  middleware.userExtractor,
  middleware.isUserAdmin,
  async (_req, res) => {
    console.log("costume router post");
    const costume = new Costume({
      itemId: 123,
      name: "name",
      equipSlots: [EquipSlot.Top],
    });
    await costume.save();
    res.json(costume);
  }
);

export default costumesRouter;
