/* eslint-disable @typescript-eslint/no-misused-promises */
import { Router } from "express";

const profileRouter = Router();
// baseurl = api/profile

// TODO remove later just checking if app.js user extractor works
profileRouter.get("/", (req, res) => {
  res.json({ message: `you are recognized as: ${req.user?.username}` });
});

export default profileRouter;
