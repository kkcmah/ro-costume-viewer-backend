import mongoose from "mongoose";
import { EquipSlot } from "../types";

export interface ICostume {
  id?: mongoose.Types.ObjectId;
  itemId: number;
  name: string;
  equipSlots: EquipSlot[];
  costumeTags: mongoose.Types.ObjectId[];
  previewUrl: string;
  className: string;
}

const costumeSchema = new mongoose.Schema<ICostume>({
  itemId: { type: Number, required: true },
  name: { type: String, required: true },
  equipSlots: { type: [String] },
  costumeTags: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CostumeTag",
    },
  ],
  previewUrl: String,
  className: String,
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
