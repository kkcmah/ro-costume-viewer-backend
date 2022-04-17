/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-misused-promises */
import bcrypt from "bcrypt";
import express from "express";
import User from "../models/user";

const usersRouter = express.Router();
// baseurl = api/user

usersRouter.get("/", async (_req, res) => {
  const users = await User.find({});
  res.json(users);
});

usersRouter.post("/", async (req, res) => {
  const { username, password } = req.body;

  const existingUser = await User.findOne({ username });
  if (existingUser) {
    return res.status(400).json({
      error: "username must be unique",
    });
  }

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

  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(password, saltRounds);

  const user = new User({
    username,
    passwordHash,
  });

  const savedUser = await user.save();
  return res.status(201).json(savedUser);
});

export default usersRouter;
