const request = require('supertest');
const express = require('express');
const app = express();

// Mock auth routes
app.use(express.json());
app.post('/api/auth/register', (req, res) => {
  res.status(201).json({ message: 'User registered' });
});

app.post('/api/auth/login', (req, res) => {
  res.status(200).json({ message: 'User logged in' });
});

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
      expect(response.body.message).toBe('User registered');
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
      expect(response.body.message).toBe('User logged in');
    });
  });
}); 