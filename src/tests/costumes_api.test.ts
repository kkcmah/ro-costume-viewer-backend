/* eslint-disable @typescript-eslint/no-unsafe-call */
import mongoose from "mongoose";
import supertest from "supertest";
import app from "../app";
import helper from "./test_helper";
import Costume from "../models/costume";

const api = supertest(app);

// POST /api/costumes/favorite and /unfavorite
describe("when there's a user and costume in db", () => {
  let existingUserToken: string;
  let existingCostumeId: string;
  beforeEach(async () => {
    await api.post("/api/testing/resetUsers");
    await api.post("/api/testing/resetCostumes");
    existingUserToken = await helper.createNormalUserToken();

    // setup a initial costume
    const existingCostume = new Costume(helper.oneCostume);
    await existingCostume.save();
    existingCostumeId = existingCostume._id.toString();
  });

  test("favoriting costume that exists succeeds", async () => {
    const response = await api
      .post("/api/costumes/favorite")
      .set("Authorization", `bearer ${existingUserToken}`)
      .send({ costumeId: existingCostumeId })
      .expect(200)
      .expect("content-type", /application\/json/);

    expect(response.body).toEqual([existingCostumeId]);
  });

  test("favoriting already favorited costume doesn't add duplicates to user's favorites", async () => {
    await api
      .post("/api/costumes/favorite")
      .set("Authorization", `bearer ${existingUserToken}`)
      .send({ costumeId: existingCostumeId })
      .expect(200);

    const response = await api
      .post("/api/costumes/favorite")
      .set("Authorization", `bearer ${existingUserToken}`)
      .send({ costumeId: existingCostumeId })
      .expect(200);

    expect(response.body).toEqual([existingCostumeId]);
  });

  test("unfavoriting favorited costume successfully removes it", async () => {
    await api
      .post("/api/costumes/favorite")
      .set("Authorization", `bearer ${existingUserToken}`)
      .send({ costumeId: existingCostumeId })
      .expect(200);

    const response = await api
      .post("/api/costumes/unfavorite")
      .set("Authorization", `bearer ${existingUserToken}`)
      .send({ costumeId: existingCostumeId })
      .expect(200);

    expect(response.body).toEqual([]);
  });

  test("unfavoriting non-existing costume has no effect", async () => {
    await api
      .post("/api/costumes/favorite")
      .set("Authorization", `bearer ${existingUserToken}`)
      .send({ costumeId: existingCostumeId })
      .expect(200);

    const response = await api
      .post("/api/costumes/unfavorite")
      .set("Authorization", `bearer ${existingUserToken}`)
      .send({ costumeId: new mongoose.Types.ObjectId("randomcostum") })
      .expect(200);

    expect(response.body).toEqual([existingCostumeId]);
  });
});

afterAll(() => {
  void mongoose.connection.close();
});
