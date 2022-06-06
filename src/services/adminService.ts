/* eslint-disable @typescript-eslint/no-misused-promises */
import fs from "fs";
import csv from "csv-parser";
import costumeTagsService from "./costumeTagsService";
import { toManyNewCostumes } from "../utils/typeParsers/costumes";
import { toManyNewCostumeTags } from "../utils/typeParsers/costumeTag";
import { NewCostume, NewCostumeTag } from "../types";
import costumesService from "./costumesService";

const RAW_FILE = "./rawdata/raw.csv";

interface NewCostumeRaw extends NewCostume {
  equipSlots: any[];
  costumeTags: any[];
}

// assuming that the database is clean
// for future use:
// create new function to update documents so that ids are preserved
const initializeCostumes = () => {
  const costumeTagsToAdd: string[] = [];
  let costumesToAdd: NewCostumeRaw[] = [];
  fs.createReadStream(RAW_FILE)
    .pipe(csv())
    .on("data", function (data: { [key: string]: string }) {
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
      } catch (err) {
        console.log("error", err);
      }
    })
    .on("end", async function () {
      const tagsToAddObj: NewCostumeTag[] = [];
      for (const tagToAdd of costumeTagsToAdd) {
        tagsToAddObj.push({ name: tagToAdd });
      }
      const manyNewCostumeTags = await toManyNewCostumeTags(tagsToAddObj);
      const addedCostumeTags = await costumeTagsService.addManyCostumeTags(
        manyNewCostumeTags
      );
      fs.writeFileSync(
        "./rawdata/result/costumeTags.txt",
        JSON.stringify(addedCostumeTags)
      );
      console.log("added costume tags");
      // change costumeTags to their ids
      costumesToAdd = costumesToAdd.map((costume) => {
        return {
          ...costume,
          costumeTags: costume.costumeTags.map((tag: string) => {
            const foundTag = addedCostumeTags.find(
              (addedTag) => addedTag.name === tag
            );
            if (!foundTag) {
              throw "tag not found: " + tag;
            }
            return foundTag.id as string;
          }),
        };
      });
      console.log("parsing costumes.....");
      const manyNewCostumes = await toManyNewCostumes(costumesToAdd);
      console.log("adding many new costumes.....");
      const addedCostumes = await costumesService.addManyCostumes(
        manyNewCostumes
      );
      fs.writeFileSync(
        "./rawdata/result/costumes.txt",
        JSON.stringify(addedCostumes)
      );
      console.log("initted costumes check rawdata result");
    });
};

export default {
  initializeCostumes,
};
