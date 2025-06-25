const request = require("supertest");
const app = require("../index");
const mongoose = require("mongoose");

describe("Memories API", () => {
  let server;
  let token;
  let memoryUuid;

  beforeAll(async () => {
    server = app.listen(4002);

    await request(server).post("/api/auth/register").send({
      email: "memo@example.com",
      password: "test1234",
      nickname: "記憶者",
      bio: "記憶測試帳號",
    });

    const loginRes = await request(server).post("/api/auth/login").send({
      email: "memo@example.com",
      password: "test1234",
    });

    token = loginRes.body.token;
  });

  afterAll(async () => {
    await mongoose.connection.close();
    server.close();
  });

  test("新增記憶", async () => {
    const res = await request(server)
      .post("/api/memories")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "記憶測試",
        description: "這是一個測試記憶",
        mood: "感動",
        intensity: 4,
        occurredAt: new Date().toISOString(),
        location: {
          lat: 23.0,
          lng: 120.2,
        },
        locationName: "台南",
      });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("uuid");
    memoryUuid = res.body.uuid;
  });

  test("取得使用者自己的記憶列表", async () => {
    const res = await request(server)
      .get("/api/memories/me")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body.memories)).toBe(true);
    expect(res.body).toHaveProperty("totalCount");
    expect(res.body).toHaveProperty("totalPages");
  });

  test("查詢單一記憶", async () => {
    const res = await request(server)
      .get(`/api/memories/${memoryUuid}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("uuid", memoryUuid);
  });
});
