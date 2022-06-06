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
const api = (0, supertest_1.default)(app_1.default);
// GET /api/users
describe("accessing full list of users", () => {
    let normalUserToken;
    let adminUserToken;
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield api.post("/api/testing/resetUsers");
        normalUserToken = yield test_helper_1.default.createNormalUserToken();
        adminUserToken = yield test_helper_1.default.createAdminUserToken();
    }));
    test("as normal user fails with 401", () => __awaiter(void 0, void 0, void 0, function* () {
        yield api
            .get("/api/users")
            .set("Authorization", `bearer ${normalUserToken}`)
            .expect(401);
    }));
    test("as admin user succeeds", () => __awaiter(void 0, void 0, void 0, function* () {
        yield api
            .get("/api/users")
            .set("Authorization", `bearer ${adminUserToken}`)
            .expect(200)
            .expect("content-type", /application\/json/);
    }));
});
// POST /api/users
describe("when there is initially one user in db", () => {
    beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
        yield api.post("/api/testing/resetUsers");
        yield test_helper_1.default.createNormalUserToken();
    }));
    test("adding new username succeeds", () => __awaiter(void 0, void 0, void 0, function* () {
        const usersAtStart = yield test_helper_1.default.usersInDb();
        const newUser = {
            username: "new username",
            password: "new password",
        };
        yield api
            .post("/api/users")
            .send(newUser)
            .expect(201)
            .expect("content-type", /application\/json/);
        const usersAtEnd = yield test_helper_1.default.usersInDb();
        expect(usersAtEnd).toHaveLength(usersAtStart.length + 1);
        const usernames = usersAtEnd.map((u) => u.username);
        expect(usernames).toContain(newUser.username);
    }));
    test("adding existing username fails with 400", () => __awaiter(void 0, void 0, void 0, function* () {
        const usersAtStart = yield test_helper_1.default.usersInDb();
        const newUser = {
            username: usersAtStart[0].username,
            password: "new password",
        };
        const result = yield api
            .post("/api/users")
            .send(newUser)
            .expect(400)
            .expect("Content-Type", /application\/json/);
        expect(result.body.error).toContain("username must be unique");
        const usersAtEnd = yield test_helper_1.default.usersInDb();
        expect(usersAtEnd).toHaveLength(usersAtStart.length);
    }));
    test("adding user with username.length < 3 fails with 400", () => __awaiter(void 0, void 0, void 0, function* () {
        const usersAtStart = yield test_helper_1.default.usersInDb();
        const newUser = {
            username: "a",
            password: "mypassword",
        };
        const result = yield api
            .post("/api/users")
            .send(newUser)
            .expect(400)
            .expect("Content-Type", /application\/json/);
        expect(result.body.error).toContain("username must be between 3 - 50 characters");
        const usersAtEnd = yield test_helper_1.default.usersInDb();
        expect(usersAtEnd).toHaveLength(usersAtStart.length);
    }));
    test("adding user with password.length < 3 fails with 400", () => __awaiter(void 0, void 0, void 0, function* () {
        const usersAtStart = yield test_helper_1.default.usersInDb();
        const newUser = {
            username: "new username",
            password: "a",
        };
        const result = yield api
            .post("/api/users")
            .send(newUser)
            .expect(400)
            .expect("Content-Type", /application\/json/);
        expect(result.body.error).toContain("password must be longer than 3 characters");
        const usersAtEnd = yield test_helper_1.default.usersInDb();
        expect(usersAtEnd).toHaveLength(usersAtStart.length);
    }));
});
afterAll(() => {
    void mongoose_1.default.connection.close();
});
