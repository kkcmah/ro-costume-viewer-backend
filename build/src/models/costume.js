"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const costumeSchema = new mongoose_1.default.Schema({
    itemId: { type: Number, required: true },
    name: { type: String, required: true },
    equipSlots: { type: [String] },
    costumeTags: [
        {
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: "CostumeTag",
        },
    ],
    previewUrl: String,
    className: String,
});
const Costume = mongoose_1.default.model("Costume", costumeSchema);
costumeSchema.set("toJSON", {
    transform: (_document, returnedObject) => {
        // eslint-disable-next-line
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject.__v;
    },
});
exports.default = Costume;
