const request = require('supertest');
const app = require('../index'); // 假設你的 Express app 是在這個檔案 export 出來的
const mongoose = require('mongoose');

describe('Auth API', () => {
  let server;

  beforeAll(() => {
    server = app.listen(4001); // 避免衝突，開不同 port
  });

  afterAll(async () => {
    await mongoose.connection.close();
    server.close();
  });

  test('Register new user and return token', async () => {
    const res = await request(server)
      .post('/api/auth/register')
      .send({
        email: 'testuser@example.com',
        password: 'test1234',
        nickname: '測試用戶',
        bio: '我是用來測試的'
      });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('token');
    expect(res.body).toHaveProperty('userId');
  });

  test('Login with valid credentials', async () => {
    const res = await request(server)
      .post('/api/auth/login')
      .send({
        email: 'testuser@example.com',
        password: 'test1234'
      });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('token');
  });
});
