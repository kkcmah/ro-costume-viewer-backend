/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-misused-promises */
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { Router } from "express";
import User from "../models/user";
import { UserToken } from "../types";

const loginRouter = Router();
// baseurl = api/login

loginRouter.get("/ping", async (_req, res) => {
  const user = await User.findOne({});
  console.log("poing", user);
  res.json({ message: "pong" });
});

loginRouter.post("/", async (request, response) => {
  const { username, password } = request.body;

  const user = await User.findOne({ username });
  const passwordCorrect =
    user === null ? false : await bcrypt.compare(password, user.passwordHash);

  if (!(user && passwordCorrect)) {
    return response.status(401).json({
      error: "invalid username or password",
    });
  }

  const userForToken: UserToken = {
    username: user.username,
    id: user._id.toString(),
  };

  const token = jwt.sign(userForToken, process.env.SECRET as string, {
    expiresIn: "1d",
  });

  return response.status(200).send({ token, username: user.username });
});

export default loginRouter;
