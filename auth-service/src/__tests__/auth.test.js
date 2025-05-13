const request = require('supertest');
const app = require('../app');

describe('Auth API', () => {
  describe('POST /api/auth/register', () => {
    it('should return 201 for valid registration', async () => {
      const userData = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123'
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData);

      expect(response.status).toBe(201);
    });
  });

  describe('POST /api/auth/login', () => {
    it('should return 200 for valid login', async () => {
      const loginData = {
        email: 'test@example.com',
        password: 'password123'
      };

      const response = await request(app)
        .post('/api/auth/login')
        .send(loginData);

      expect(response.status).toBe(200);
    });
  });
}); 