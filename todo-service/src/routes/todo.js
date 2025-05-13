const express = require('express');
const { body } = require('express-validator');
const todoController = require('../controllers/todoController');
const auth = require('../middleware/auth');

const router = express.Router();

// Validation middleware
const todoValidation = [
  body('title').notEmpty().withMessage('Title is required'),
  body('description').optional()
];

// All routes require authentication
router.use(auth);

// Routes
router.post('/', todoValidation, todoController.createTodo);
router.get('/', todoController.getTodos);
router.get('/:id', todoController.getTodo);
router.patch('/:id', todoValidation, todoController.updateTodo);
router.delete('/:id', todoController.deleteTodo);

module.exports = router; 