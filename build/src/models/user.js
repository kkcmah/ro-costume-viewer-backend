"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const userSchema = new mongoose_1.default.Schema({
    username: { type: String, required: true, minlength: 3, maxlength: 50 },
    // do not test password restritions with mongoose validators because request pass !== db pass
    passwordHash: String,
    favCostumes: [
        {
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: "Costume",
        },
    ],
    likedCostumeSets: [
        {
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: "CostumeSet",
        },
    ],
    userType: { type: Number, default: 0 },
}, { timestamps: true });
const User = mongoose_1.default.model("User", userSchema);
// applies when document's toJSON method is called or via JSON.stringify
userSchema.set("toJSON", {
    transform: (_document, returnedObject) => {
        // eslint-disable-next-line
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject.__v;
        // the passwordHash should not be revealed
        delete returnedObject.passwordHash;
        delete returnedObject.userType;
    },
});
exports.default = User;
