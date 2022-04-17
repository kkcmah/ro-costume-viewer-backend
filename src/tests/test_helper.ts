import Costume, { ICostume } from "../models/costume";
import User from "../models/user";
import { EquipSlot } from "../types";

const initialCostumes: ICostume[] = [
  {
    itemId: 12,
    name: "poring hat",
    equipSlots: [EquipSlot.Top],
    costumeTags: [],
    gifUrl: "",
    iconUrl: "",
  },
  {
    itemId: 125,
    name: "poring glasses",
    equipSlots: [EquipSlot.Middle],
    costumeTags: [],
    gifUrl: "",
    iconUrl: "",
  },
  {
    itemId: 5125,
    name: "poring bread",
    equipSlots: [EquipSlot.Lower],
    costumeTags: [],
    gifUrl: "",
    iconUrl: "",
  },
  {
    itemId: 62363,
    name: "poring aura garment",
    equipSlots: [EquipSlot.Garment],
    costumeTags: [],
    gifUrl: "",
    iconUrl: "",
  },
  {
    itemId: 2165,
    name: "poring mask",
    equipSlots: [EquipSlot.Top, EquipSlot.Middle],
    costumeTags: [],
    gifUrl: "",
    iconUrl: "",
  },
];

const nonExistingId = async () => {
  const costume = new Costume({
    itemId: 123,
    name: "willberemoved",
  });
  await costume.save();
  await costume.remove();

  return costume._id.toString();
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
  initialCostumes,
  nonExistingId,
  costumesInDb,
  usersInDb,
};
