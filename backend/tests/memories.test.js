const request = require("supertest");
const app = require("../index");
const mongoose = require("mongoose");
const Memory = require("../models/memory");

describe("Memories API", () => {
  let server;
  let token;
  let userUuid;
  let memoryUuid;

  beforeAll(async () => {
    server = app.listen(4002);
  });

  afterAll(async () => {
    await mongoose.connection.close();
    server.close();
  });

  test("註冊使用者", async () => {
    const res = await request(server).post("/api/auth/register").send({
      email: "memtest@example.com",
      password: "test1234",
      nickname: "Memory測試者",
      bio: "測試用",
    });

    expect(res.statusCode).toBe(201);
    token = res.body.token;
    userUuid = res.body.userId;
  });

  test("新增一筆記憶", async () => {
    const res = await request(server)
      .post("/api/memories")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "測試標題",
        description: "這是描述",
        mood: "開心",
        intensity: 3,
        occurredAt: new Date(),
        imageUrl: "",
        location: { lat: 25.03, lng: 121.56 },
      });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("uuid");
    memoryUuid = res.body.uuid;
  });

  test("用 userUuid 查記憶清單", async () => {
    const res = await request(server).get(`/api/memories/user/${userUuid}`);
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body.memories)).toBe(true);
    expect(res.body.totalCount).toBeGreaterThan(0);
  });

  test("用 uuid 查單一記憶", async () => {
    const res = await request(server).get(`/api/memories/${memoryUuid}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.uuid).toBe(memoryUuid);
    expect(res.body.title).toBe("測試標題");
  });

  test("刪除記憶", async () => {
    const res = await request(server)
      .delete(`/api/memories/${memoryUuid}`)
      .set("Authorization", `Bearer ${token}`);
    expect(res.statusCode).toBe(204);

    const check = await Memory.findOne({ uuid: memoryUuid });
    expect(check).toBeNull();
  });
});
