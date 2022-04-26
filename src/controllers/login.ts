/* eslint-disable @typescript-eslint/no-misused-promises */
import { Router } from "express";
import usersService from "../services/usersService";
import { toUserLoginCreds } from "../utils/typeParsers/users";

const loginRouter = Router();
// baseurl = api/login

// ping pong
loginRouter.get("/ping", (_req, res) => {
  res.json({ message: "login pong" });
});

// login user
loginRouter.post("/", async (req, res) => {
  const { username, password } = toUserLoginCreds(req.body);

  let userWithToken;
  try {
    userWithToken = await usersService.verifyUser({ username, password });
  } catch (error) {
    return res.status(401).json({
      error: "invalid username or password",
    });
  }

  return res.status(200).json(userWithToken);
});

export default loginRouter;
