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
  test("註冊使用者", async () => {
    const uniqueEmail = `newuser+${Date.now()}@example.com`; // 加上時間戳避免重複
  
    const res = await request(server).post("/api/auth/register").send({
      email: uniqueEmail,
      password: "test1234",
      nickname: "新測試者",
      bio: "這是測試帳號",
    });
  
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("token");
    expect(res.body).toHaveProperty("userId");
  });

  test("登入取得 token", async () => {
    const res = await request(server).post("/api/auth/login").send({
      email: "newuser@example.com",
      password: "test1234",
    });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("token");
    expect(res.body).toHaveProperty("userId");
  });
});