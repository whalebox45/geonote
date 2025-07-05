const request = require("supertest");
const app = require("../index");
const mongoose = require("mongoose");

describe("Auth API", () => {
  let server;

  beforeAll(() => {
    server = app.listen(4001);
  });

  afterAll(async () => {
    await mongoose.connection.close();
    server.close();
  });

  const testUser = {
    email: `user_${Date.now()}@test.com`,
    password: "test1234",
    nickname: "Tester",
    bio: "Testing account"
  };

  test("Register a new user", async () => {
    const res = await request(server).post("/api/auth/register").send(testUser);
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("token");
    expect(res.body).toHaveProperty("userId");
  });

  test("Login with correct credentials", async () => {
    const res = await request(server).post("/api/auth/login").send({
      email: testUser.email,
      password: testUser.password
    });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("token");
  });

  test("Login with incorrect password", async () => {
    const res = await request(server).post("/api/auth/login").send({
      email: testUser.email,
      password: "wrongpass"
    });
    expect(res.statusCode).toBe(401);
  });
});
