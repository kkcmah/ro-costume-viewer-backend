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
/* eslint-disable @typescript-eslint/no-unsafe-call */
const mongoose_1 = __importDefault(require("mongoose"));
const supertest_1 = __importDefault(require("supertest"));
const app_1 = __importDefault(require("../app"));
const test_helper_1 = __importDefault(require("./test_helper"));
const costume_1 = __importDefault(require("../models/costume"));
const api = (0, supertest_1.default)(app_1.default);
// POST /api/costumes/favorite and /unfavorite
describe("when there's a user and costume in db", () => {
    let existingUserToken;
    let existingCostumeId;
    beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
        yield api.post("/api/testing/resetUsers");
        yield api.post("/api/testing/resetCostumes");
        existingUserToken = yield test_helper_1.default.createNormalUserToken();
        // setup a initial costume
        const existingCostume = new costume_1.default(test_helper_1.default.oneCostume);
        yield existingCostume.save();
        existingCostumeId = existingCostume._id.toString();
    }));
    test("favoriting costume that exists succeeds", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield api
            .post("/api/costumes/favorite")
            .set("Authorization", `bearer ${existingUserToken}`)
            .send({ costumeId: existingCostumeId })
            .expect(200)
            .expect("content-type", /application\/json/);
        expect(response.body).toEqual([existingCostumeId]);
    }));
    test("favoriting already favorited costume doesn't add duplicates to user's favorites", () => __awaiter(void 0, void 0, void 0, function* () {
        yield api
            .post("/api/costumes/favorite")
            .set("Authorization", `bearer ${existingUserToken}`)
            .send({ costumeId: existingCostumeId })
            .expect(200);
        const response = yield api
            .post("/api/costumes/favorite")
            .set("Authorization", `bearer ${existingUserToken}`)
            .send({ costumeId: existingCostumeId })
            .expect(200);
        expect(response.body).toEqual([existingCostumeId]);
    }));
    test("unfavoriting favorited costume successfully removes it", () => __awaiter(void 0, void 0, void 0, function* () {
        yield api
            .post("/api/costumes/favorite")
            .set("Authorization", `bearer ${existingUserToken}`)
            .send({ costumeId: existingCostumeId })
            .expect(200);
        const response = yield api
            .post("/api/costumes/unfavorite")
            .set("Authorization", `bearer ${existingUserToken}`)
            .send({ costumeId: existingCostumeId })
            .expect(200);
        expect(response.body).toEqual([]);
    }));
    test("unfavoriting non-existing costume has no effect", () => __awaiter(void 0, void 0, void 0, function* () {
        yield api
            .post("/api/costumes/favorite")
            .set("Authorization", `bearer ${existingUserToken}`)
            .send({ costumeId: existingCostumeId })
            .expect(200);
        const response = yield api
            .post("/api/costumes/unfavorite")
            .set("Authorization", `bearer ${existingUserToken}`)
            .send({ costumeId: new mongoose_1.default.Types.ObjectId("randomcostum") })
            .expect(200);
        expect(response.body).toEqual([existingCostumeId]);
    }));
});
afterAll(() => {
    void mongoose_1.default.connection.close();
});
