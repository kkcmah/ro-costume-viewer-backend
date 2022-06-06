"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const costumeSetSchema = new mongoose_1.default.Schema({
    name: { type: String, required: true, minlength: 1, maxlength: 100 },
    description: { type: String, maxlength: 300 },
    costumes: [
        {
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: "Costume",
        },
    ],
    likes: { type: Number, default: 0 },
    owner: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        required: true,
        ref: "User",
    },
    isPublic: { type: Boolean, default: false },
}, { timestamps: true });
const CostumeSet = mongoose_1.default.model("CostumeSet", costumeSetSchema);
costumeSetSchema.set("toJSON", {
    transform: (_document, returnedObject) => {
        // eslint-disable-next-line
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject.__v;
    },
});
exports.default = CostumeSet;
