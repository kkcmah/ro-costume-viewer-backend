"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const costumeTagSchema = new mongoose_1.default.Schema({
    name: { type: String, required: true, unique: true },
});
const CostumeTag = mongoose_1.default.model("CostumeTag", costumeTagSchema);
costumeTagSchema.set("toJSON", {
    transform: (_document, returnedObject) => {
        // eslint-disable-next-line
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject.__v;
    },
});
exports.default = CostumeTag;
