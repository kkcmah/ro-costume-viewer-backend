"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable @typescript-eslint/no-misused-promises */
const fs_1 = __importDefault(require("fs"));
const csv_parser_1 = __importDefault(require("csv-parser"));
const costumeTagsService_1 = __importDefault(require("./costumeTagsService"));
const costumes_1 = require("../utils/typeParsers/costumes");
const costumeTag_1 = require("../utils/typeParsers/costumeTag");
const costumesService_1 = __importDefault(require("./costumesService"));
const RAW_FILE = "./rawdata/raw.csv";
// assuming that the database is clean
// for future use:
// create new function to update documents so that ids are preserved
const initializeCostumes = () => {
    const costumeTagsToAdd = [];
    let costumesToAdd = [];
    fs_1.default.createReadStream(RAW_FILE)
        .pipe((0, csv_parser_1.default)())
        .on("data", function (data) {
        try {
            const dataCostumeTags = data.costumeTags
                .split(" ")
                .filter((tag) => tag !== "");
            for (const dataTag of dataCostumeTags) {
                if (!costumeTagsToAdd.includes(dataTag)) {
                    costumeTagsToAdd.push(dataTag);
                }
            }
            costumesToAdd.push({
                name: data.name,
                itemId: +data.id,
                className: data.className,
                equipSlots: data.slotcleaned.split("+"),
                costumeTags: dataCostumeTags,
                previewUrl: data.previewUrl,
            });
        }
        catch (err) {
            console.log("error", err);
        }
    })
        .on("end", function () {
        return __awaiter(this, void 0, void 0, function* () {
            const tagsToAddObj = [];
            for (const tagToAdd of costumeTagsToAdd) {
                tagsToAddObj.push({ name: tagToAdd });
            }
            const manyNewCostumeTags = yield (0, costumeTag_1.toManyNewCostumeTags)(tagsToAddObj);
            const addedCostumeTags = yield costumeTagsService_1.default.addManyCostumeTags(manyNewCostumeTags);
            fs_1.default.writeFileSync("./rawdata/result/costumeTags.txt", JSON.stringify(addedCostumeTags));
            console.log("added costume tags");
            // change costumeTags to their ids
            costumesToAdd = costumesToAdd.map((costume) => {
                return Object.assign(Object.assign({}, costume), { costumeTags: costume.costumeTags.map((tag) => {
                        const foundTag = addedCostumeTags.find((addedTag) => addedTag.name === tag);
                        if (!foundTag) {
                            throw "tag not found: " + tag;
                        }
                        return foundTag.id;
                    }) });
            });
            console.log("parsing costumes.....");
            const manyNewCostumes = yield (0, costumes_1.toManyNewCostumes)(costumesToAdd);
            console.log("adding many new costumes.....");
            const addedCostumes = yield costumesService_1.default.addManyCostumes(manyNewCostumes);
            fs_1.default.writeFileSync("./rawdata/result/costumes.txt", JSON.stringify(addedCostumes));
            console.log("initted costumes check rawdata result");
        });
    });
};
exports.default = {
    initializeCostumes,
};
