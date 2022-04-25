/* eslint-disable @typescript-eslint/no-misused-promises */
import { Router } from "express";
import { toUserLoginCreds } from "../utils/typeParsers/users";
import usersService from "../services/usersService";
import middleware from "../utils/middleware";

const usersRouter = Router();
// baseurl = api/users

// admin get all users
usersRouter.get(
  "/",
  middleware.userExtractor,
  middleware.isUserAdmin,
  async (_req, res) => {
    res.json(await usersService.getAllUsers());
  }
);

// sign up
usersRouter.post("/", async (req, res) => {
  const { username, password } = toUserLoginCreds(req.body);

  if (username.length < 3 || username.length > 50) {
    return res.status(400).json({
      error: "username must be between 3 - 50 characters",
    });
  }

  if (password.length < 3) {
    return res.status(400).json({
      error: "password must be longer than 3 characters",
    });
  }

  const existingUser = await usersService.getUserByUsername(username);
  if (existingUser) {
    return res.status(400).json({
      error: "username must be unique",
    });
  }

  const savedUser = await usersService.addUser({ username, password });

  return res.status(201).json(savedUser);
});

export default usersRouter;
