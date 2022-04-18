import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import User, { IUser } from "../models/user";
import { UserLoginCreds, UserToken } from "../types";

const getAllUsers = async (): Promise<IUser[]> => {
  const users = await User.find({});
  return users;
};

const getUserByUsername = async (
  username: string
): Promise<IUser | undefined> => {
  const existingUser = await User.findOne({ username });
  if (!existingUser) {
    return undefined;
  }
  return existingUser;
};

const addUser = async ({
  username,
  password,
}: UserLoginCreds): Promise<IUser> => {
  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(password, saltRounds);
  const addedUser = new User({ username, passwordHash });
  await addedUser.save();
  return addedUser;
};

const verifyUser = async ({
  username,
  password,
}: UserLoginCreds): Promise<string> => {
  const user = await User.findOne({ username });
  const passwordCorrect = !user
    ? false
    : await bcrypt.compare(password, user.passwordHash);
  if (!user || !passwordCorrect) {
    throw new Error("verification failed");
  }
  const userForToken: UserToken = {
    username: user.username,
    id: user._id.toString(),
  };
  const token = jwt.sign(userForToken, process.env.SECRET as string, {
    expiresIn: "1d",
  });
  return token;
};

export default { getAllUsers, getUserByUsername, addUser, verifyUser };
