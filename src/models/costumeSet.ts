import mongoose from "mongoose";

export interface ICostumeSet {
  id?: mongoose.Types.ObjectId;
  name: string;
  description: string;
  costumes: mongoose.Types.ObjectId[];
  likes: number;
  owner: mongoose.Types.ObjectId;
  isPublic: boolean;
}

const costumeSetSchema = new mongoose.Schema<ICostumeSet>(
  {
    name: { type: String, required: true, minlength: 1, maxlength: 100 },
    description: { type: String, maxlength: 300 },
    costumes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Costume",
      },
    ],
    likes: { type: Number, default: 0 },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    isPublic: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const CostumeSet = mongoose.model<ICostumeSet>("CostumeSet", costumeSetSchema);

costumeSetSchema.set("toJSON", {
  transform: (_document, returnedObject) => {
    // eslint-disable-next-line
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

export default CostumeSet;
