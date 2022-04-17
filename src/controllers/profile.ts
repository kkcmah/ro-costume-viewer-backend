/* eslint-disable @typescript-eslint/no-misused-promises */
import { Router } from "express";

const profileRouter = Router();
// baseurl = api/profile

profileRouter.get("/", (req, res) => {
  res.json({ message: `you are recognized as: ${req.user}` });
});

export default profileRouter;
