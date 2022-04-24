import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Costume, { ICostume } from "../models/costume";
import User from "../models/user";
import { EquipSlot, UserToken, UserType } from "../types";

const oneCostume: ICostume = {
  itemId: 124,
  name: "poring hat",
  equipSlots: [EquipSlot.Top],
  costumeTags: [],
  previewUrl: "",
  className: "",
};

const initialCostumes: ICostume[] = [
  {
    itemId: 12,
    name: "poring hat",
    equipSlots: [EquipSlot.Top],
    costumeTags: [],
    previewUrl: "",
    className: "",
  },
  {
    itemId: 125,
    name: "poring glasses",
    equipSlots: [EquipSlot.Middle],
    costumeTags: [],
    previewUrl: "",
    className: "",
  },
  {
    itemId: 5125,
    name: "poring bread",
    equipSlots: [EquipSlot.Lower],
    costumeTags: [],
    previewUrl: "",
    className: "",
  },
  {
    itemId: 62363,
    name: "poring aura garment",
    equipSlots: [EquipSlot.Garment],
    costumeTags: [],
    previewUrl: "",
    className: "",
  },
  {
    itemId: 2165,
    name: "poring mask",
    equipSlots: [EquipSlot.Top, EquipSlot.Middle],
    costumeTags: [],
    previewUrl: "",
    className: "",
  },
];

const nonExistingCostumeId = async () => {
  const costume = new Costume({
    itemId: 123,
    name: "willberemoved",
  });
  await costume.save();
  await costume.remove();

  return costume._id.toString();
};

const createNormalUserToken = async () => {
  const passwordHash = await bcrypt.hash("secretpass", 3);
  const normalUser = new User({ username: "normal", passwordHash });
  await normalUser.save();
  const normalUserForToken: UserToken = {
    username: normalUser.username,
    id: normalUser._id.toString(),
  };
  return jwt.sign(normalUserForToken, process.env.SECRET as string, {
    expiresIn: "1d",
  });
};

const createAdminUserToken = async () => {
  const passwordHash = await bcrypt.hash("secretpass", 3);
  const normalUser = new User({
    username: "normal",
    passwordHash,
    userType: UserType.Admin,
  });
  await normalUser.save();
  const normalUserForToken: UserToken = {
    username: normalUser.username,
    id: normalUser._id.toString(),
  };
  return jwt.sign(normalUserForToken, process.env.SECRET as string, {
    expiresIn: "1d",
  });
};

const costumesInDb = async () => {
  const costumes = await Costume.find({});
  return costumes.map((costume) => costume.toJSON());
};

const usersInDb = async () => {
  const users = await User.find({});
  return users.map((user) => user.toJSON());
};

export default {
  oneCostume,
  initialCostumes,
  nonExistingCostumeId,
  createNormalUserToken,
  createAdminUserToken,
  costumesInDb,
  usersInDb,
};
