/* eslint-disable @typescript-eslint/no-unsafe-call */
import mongoose from "mongoose";
import supertest from "supertest";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import app from "../app";
import User from "../models/user";
import helper from "./test_helper";
import { UserToken, UserType } from "../types";

const api = supertest(app);

// GET /api/users
describe("accessing full list of users", () => {
  let normalUserToken: string;
  let adminUserToken: string;
  beforeEach(async () => {
    await api.post("/api/testing/resetUsers");
    const passwordHash = await bcrypt.hash("secretpass", 3);
    const normalUser = new User({ username: "normal", passwordHash });
    await normalUser.save();
    const normalUserForToken: UserToken = {
      username: normalUser.username,
      id: normalUser._id.toString(),
    };
    normalUserToken = jwt.sign(
      normalUserForToken,
      process.env.SECRET as string,
      {
        expiresIn: "1d",
      }
    );

    const adminUser = new User({
      username: "admin",
      passwordHash,
      userType: UserType.Admin,
    });
    await adminUser.save();
    const adminUserForToken: UserToken = {
      username: adminUser.username,
      id: adminUser._id.toString(),
    };
    adminUserToken = jwt.sign(adminUserForToken, process.env.SECRET as string, {
      expiresIn: "1d",
    });
  });

  test("as normal user fails with 401", async () => {
    await api
      .get("/api/users")
      .set("Authorization", `bearer ${normalUserToken}`)
      .expect(401);
  });

  test("as admin user succeeds", async () => {
    console.log("here", adminUserToken);
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
    const passwordHash = await bcrypt.hash("secretpass", 10);
    const user = new User({ username: "root", passwordHash });

    await user.save();
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
      username: "root",
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
