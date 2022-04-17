import mongoose from "mongoose";

interface ICostumeTag {
  name: string;
}

const costumeTagSchema = new mongoose.Schema<ICostumeTag>({
  name: { type: String, required: true },
});

const CostumeTag = mongoose.model<ICostumeTag>("CostumeTag", costumeTagSchema);

costumeTagSchema.set("toJSON", {
  transform: (_document, returnedObject) => {
    // eslint-disable-next-line
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

export default CostumeTag;
