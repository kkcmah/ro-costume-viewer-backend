/* eslint-disable @typescript-eslint/no-unsafe-call */
import mongoose from "mongoose";
import supertest from "supertest";
import bcrypt from "bcrypt";
import app from "../app";
import User from "../models/user";
import helper from "./test_helper";

const api = supertest(app);

describe("when there is initially one user in db", () => {
  beforeEach(async () => {
    await User.deleteMany({});
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
      username: "",
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
      password: "",
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
