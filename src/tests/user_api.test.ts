/* eslint-disable @typescript-eslint/no-unsafe-call */
import mongoose from "mongoose";
import supertest from "supertest";
import app from "../app";
import helper from "./test_helper";

const api = supertest(app);

// GET /api/users
describe("accessing full list of users", () => {
  let normalUserToken: string;
  let adminUserToken: string;
  beforeAll(async () => {
    await api.post("/api/testing/resetUsers");
    normalUserToken = await helper.createNormalUserToken();
    adminUserToken = await helper.createAdminUserToken();
  });

  test("as normal user fails with 401", async () => {
    await api
      .get("/api/users")
      .set("Authorization", `bearer ${normalUserToken}`)
      .expect(401);
  });

  test("as admin user succeeds", async () => {
    await api
      .get("/api/users")
      .set("Authorization", `bearer ${adminUserToken}`)
      .expect(200)
      .expect("content-type", /application\/json/);
  });
});

// POST /api/users
describe("when there is initially one user in db", () => {
  beforeEach(async () => {
    await api.post("/api/testing/resetUsers");
    await helper.createNormalUserToken();
  });

  test("adding new username succeeds", async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      username: "new username",
      password: "new password",
    };

    await api
      .post("/api/users")
      .send(newUser)
      .expect(201)
      .expect("content-type", /application\/json/);

    const usersAtEnd = await helper.usersInDb();
    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1);

    const usernames = usersAtEnd.map((u) => u.username);
    expect(usernames).toContain(newUser.username);
  });

  test("adding existing username fails with 400", async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      username: usersAtStart[0].username,
      password: "new password",
    };

    const result = await api
      .post("/api/users")
      .send(newUser)
      .expect(400)
      .expect("Content-Type", /application\/json/);

    expect(result.body.error).toContain("username must be unique");
    const usersAtEnd = await helper.usersInDb();
    expect(usersAtEnd).toHaveLength(usersAtStart.length);
  });

  test("adding user with username.length < 3 fails with 400", async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      username: "a",
      password: "mypassword",
    };

    const result = await api
      .post("/api/users")
      .send(newUser)
      .expect(400)
      .expect("Content-Type", /application\/json/);

    expect(result.body.error).toContain(
      "username must be between 3 - 50 characters"
    );

    const usersAtEnd = await helper.usersInDb();
    expect(usersAtEnd).toHaveLength(usersAtStart.length);
  });

  test("adding user with password.length < 3 fails with 400", async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      username: "new username",
      password: "a",
    };

    const result = await api
      .post("/api/users")
      .send(newUser)
      .expect(400)
      .expect("Content-Type", /application\/json/);

    expect(result.body.error).toContain(
      "password must be longer than 3 characters"
    );
    const usersAtEnd = await helper.usersInDb();
    expect(usersAtEnd).toHaveLength(usersAtStart.length);
  });
});

afterAll(() => {
  void mongoose.connection.close();
});
