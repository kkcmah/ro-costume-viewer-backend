import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import User, { IUser } from "../models/user";
import { UserLoginCreds, UserToken, UserWithToken } from "../types";

const getAllUsers = async (): Promise<IUser[]> => {
  const users = await User.find({});
  return users;
};

const getUserById = async (id: string): Promise<IUser | null> => {
  const user = await User.findById(id);
  return user;
};

const getUserByUsername = async (
  username: string
): Promise<IUser | null> => {
  const existingUser = await User.findOne({ username });
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
}: UserLoginCreds): Promise<UserWithToken> => {
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
  return {token, ...user.toJSON()};
};

const favoriteCostume = async (user: IUser, costumeId: string) => {
  return await User.findByIdAndUpdate(
    user.id,
    {
      $addToSet: { favCostumes: costumeId },
    },
    { new: true }
  );
};

const unFavoriteCostume = async (user: IUser, costumeId: string) => {
  return await User.findByIdAndUpdate(
    user.id,
    {
      $pull: { favCostumes: costumeId },
    },
    { new: true }
  );
};

const likeCostumeSet = async (user: IUser, costumeSetId: string) => {
  return await User.findByIdAndUpdate(
    user.id,
    {
      $addToSet: { likedCostumeSets: costumeSetId },
    },
    { new: true }
  );
};

const unlikeCostumeSet = async (user: IUser, costumeSetId: string) => {
  return await User.findByIdAndUpdate(
    user.id,
    {
      $pull: { likedCostumeSets: costumeSetId },
    },
    { new: true }
  );
};

export default {
  getAllUsers,
  getUserById,
  getUserByUsername,
  addUser,
  verifyUser,
  favoriteCostume,
  unFavoriteCostume,
  likeCostumeSet,
  unlikeCostumeSet
};
