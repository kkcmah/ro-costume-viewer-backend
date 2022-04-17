import mongoose from "mongoose";

export interface IUser {
  username: string;
  passwordHash: string;
}

const userSchema = new mongoose.Schema<IUser>(
  {
    username: { type: String, required: true, minlength: 3, maxlength: 50 },
    // do not test password restritions with mongoose validators because request pass !== db pass
    passwordHash: String,
  },
  { timestamps: true }
);

const User = mongoose.model<IUser>("User", userSchema);

// applies when document's toJSON method is called or via JSON.stringify
userSchema.set("toJSON", {
  transform: (_document, returnedObject) => {
    // eslint-disable-next-line
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
    // the passwordHash should not be revealed
    delete returnedObject.passwordHash;
  },
});

export default User;
