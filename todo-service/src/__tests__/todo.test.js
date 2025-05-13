const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../app');
const Todo = require('../models/Todo');

let mongoServer;

// Mock auth middleware
jest.mock('../middleware/auth', () => (req, res, next) => {
  req.userId = 'test-user-id';
  next();
});

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

beforeEach(async () => {
  await Todo.deleteMany({});
});

describe('Todo API', () => {
  describe('POST /api/todos', () => {
    it('should create a new todo', async () => {
      const todoData = {
        title: 'Test Todo',
        description: 'Test Description'
      };

      const response = await request(app)
        .post('/api/todos')
        .send(todoData);

      expect(response.status).toBe(201);
      expect(response.body.title).toBe(todoData.title);
      expect(response.body.description).toBe(todoData.description);
      expect(response.body.userId).toBe('test-user-id');
    });

    it('should return 400 if title is missing', async () => {
      const response = await request(app)
        .post('/api/todos')
        .send({ description: 'Test Description' });

      expect(response.status).toBe(400);
    });
  });

  describe('GET /api/todos', () => {
    it('should get all todos for the user', async () => {
      // Create test todos
      await Todo.create([
        { title: 'Todo 1', description: 'Description 1', userId: 'test-user-id' },
        { title: 'Todo 2', description: 'Description 2', userId: 'test-user-id' }
      ]);

      const response = await request(app).get('/api/todos');

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(2);
      expect(response.body[0].title).toBe('Todo 1');
      expect(response.body[1].title).toBe('Todo 2');
    });
  });

  describe('GET /api/todos/:id', () => {
    it('should get a single todo', async () => {
      const todo = await Todo.create({
        title: 'Test Todo',
        description: 'Test Description',
        userId: 'test-user-id'
      });

      const response = await request(app).get(`/api/todos/${todo._id}`);

      expect(response.status).toBe(200);
      expect(response.body.title).toBe('Test Todo');
    });

    it('should return 404 for non-existent todo', async () => {
      const response = await request(app)
        .get(`/api/todos/${new mongoose.Types.ObjectId()}`);

      expect(response.status).toBe(404);
    });
  });

  describe('PATCH /api/todos/:id', () => {
    it('should update a todo', async () => {
      const todo = await Todo.create({
        title: 'Original Title',
        description: 'Original Description',
        userId: 'test-user-id'
      });

      const response = await request(app)
        .patch(`/api/todos/${todo._id}`)
        .send({ title: 'Updated Title' });

      expect(response.status).toBe(200);
      expect(response.body.title).toBe('Updated Title');
      expect(response.body.description).toBe('Original Description');
    });

    it('should return 404 for non-existent todo', async () => {
      const response = await request(app)
        .patch(`/api/todos/${new mongoose.Types.ObjectId()}`)
        .send({ title: 'Updated Title' });

      expect(response.status).toBe(404);
    });
  });

  describe('DELETE /api/todos/:id', () => {
    it('should delete a todo', async () => {
      const todo = await Todo.create({
        title: 'Test Todo',
        description: 'Test Description',
        userId: 'test-user-id'
      });

      const response = await request(app).delete(`/api/todos/${todo._id}`);

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Todo deleted successfully');

      const deletedTodo = await Todo.findById(todo._id);
      expect(deletedTodo).toBeNull();
    });

    it('should return 404 for non-existent todo', async () => {
      const response = await request(app)
        .delete(`/api/todos/${new mongoose.Types.ObjectId()}`);

      expect(response.status).toBe(404);
    });
  });
}); 