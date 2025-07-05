const request = require("supertest");
const app = require("../index");
const mongoose = require("mongoose");

describe("Memories API", () => {
  let server;
  let token;
  let memoryUuid;

  const testUser = {
    email: `memo_${Date.now()}@test.com`,
    password: "test1234",
    nickname: "MemoTester",
    bio: "Memory test user"
  };

  beforeAll(async () => {
    server = app.listen(4002);
    await request(server).post("/api/auth/register").send(testUser);
    const loginRes = await request(server).post("/api/auth/login").send({
      email: testUser.email,
      password: testUser.password
    });
    token = loginRes.body.token;
  });

  afterAll(async () => {
    await mongoose.connection.close();
    server.close();
  });

  test("Create a new memory", async () => {
    const res = await request(server)
      .post("/api/memories")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Test Memory",
        content: "This is a test note.",
        lat: 25.03,
        lng: 121.56
      });
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("uuid");
    memoryUuid = res.body.uuid;
  });

  test("Get paginated memories", async () => {
    const res = await request(server)
      .get("/api/memories/me?page=1")
      .set("Authorization", `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test("Get memory by UUID", async () => {
    const res = await request(server)
      .get(`/api/memories/${memoryUuid}`)
      .set("Authorization", `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("uuid", memoryUuid);
  });

  test("Update a memory", async () => {
    const res = await request(server)
      .put(`/api/memories/${memoryUuid}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Updated Memory",
        content: "Updated content."
      });
    expect(res.statusCode).toBe(200);
    expect(res.body.title).toBe("Updated Memory");
  });

  test("Delete a memory", async () => {
    const res = await request(server)
      .delete(`/api/memories/${memoryUuid}`)
      .set("Authorization", `Bearer ${token}`);
    expect(res.statusCode).toBe(204);
  });
});
