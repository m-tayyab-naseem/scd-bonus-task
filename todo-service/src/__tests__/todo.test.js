const request = require('supertest');
const express = require('express');
const app = express();

// Mock todo routes
app.use(express.json());
app.post('/api/todos', (req, res) => {
  res.status(201).json({ message: 'Todo created' });
});
app.get('/api/todos', (req, res) => {
  res.status(200).json([{ id: 1, title: 'Test Todo' }]);
});
app.get('/api/todos/:id', (req, res) => {
  res.status(200).json({ id: req.params.id, title: 'Test Todo' });
});
app.patch('/api/todos/:id', (req, res) => {
  res.status(200).json({ id: req.params.id, title: 'Updated Todo' });
});
app.delete('/api/todos/:id', (req, res) => {
  res.status(200).json({ message: 'Todo deleted' });
});

let server;

beforeAll(() => {
  server = app.listen(0); // Random port
});

afterAll((done) => {
  server.close(done);
});

describe('Todo API', () => {
  it('should create a new todo', async () => {
    const response = await request(server)
      .post('/api/todos')
      .send({ title: 'Test Todo', description: 'Test Description' });
    expect(response.status).toBe(201);
    expect(response.body.message).toBe('Todo created');
  });

  it('should get all todos', async () => {
    const response = await request(server).get('/api/todos');
    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(1);
    expect(response.body[0].title).toBe('Test Todo');
  });

  it('should get a single todo', async () => {
    const response = await request(server).get('/api/todos/1');
    expect(response.status).toBe(200);
    expect(response.body.title).toBe('Test Todo');
  });

  it('should update a todo', async () => {
    const response = await request(server)
      .patch('/api/todos/1')
      .send({ title: 'Updated Todo' });
    expect(response.status).toBe(200);
    expect(response.body.title).toBe('Updated Todo');
  });

  it('should delete a todo', async () => {
    const response = await request(server).delete('/api/todos/1');
    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Todo deleted');
  });
}); 