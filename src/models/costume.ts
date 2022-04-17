import mongoose from "mongoose";
import { EquipSlot } from "../types";

export interface ICostume {
  itemId: number;
  name: string;
  equipSlots: EquipSlot[];
  costumeTags: mongoose.Types.ObjectId[];
  gifUrl: string;
  iconUrl: string;
}

const costumeSchema = new mongoose.Schema<ICostume>({
  itemId: { type: Number, required: true },
  // do not test password restritions with mongoose validators because request pass !== db pass
  name: { type: String, required: true },
  equipSlots: { type: [String] },
  costumeTags: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CostumeTag",
    },
  ],
  gifUrl: String,
  iconUrl: String,
});

const Costume = mongoose.model<ICostume>("Costume", costumeSchema);

costumeSchema.set("toJSON", {
  transform: (_document, returnedObject) => {
    // eslint-disable-next-line
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

export default Costume;
