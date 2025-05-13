# Microservices Example: Auth + Todo

This project demonstrates a simple microservices architecture with two services:
1. Authentication Service (Port 3001)
2. Todo Service (Port 3002)

## Prerequisites

- Node.js (v14 or higher)
- MongoDB
- npm or yarn

## Setup

1. Clone the repository
2. Install dependencies for both services:
```bash
# Auth Service
cd auth-service
npm install

# Todo Service
cd ../todo-service
npm install
```

3. Create `.env` files in both service directories:

For auth-service/.env:
```
PORT=3001
MONGODB_URI=mongodb://localhost:27017/auth-service
JWT_SECRET=your-secret-key
```

For todo-service/.env:
```
PORT=3002
MONGODB_URI=mongodb://localhost:27017/todo-service
JWT_SECRET=your-secret-key
```

## Running the Services

Start both services in separate terminals:

```bash
# Auth Service
cd auth-service
npm run dev

# Todo Service
cd todo-service
npm run dev
```

## API Endpoints

### Auth Service (Port 3001)

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe"
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

### Todo Service (Port 3002)

All Todo endpoints require authentication. Include the JWT token in the Authorization header:
```http
Authorization: Bearer <your-jwt-token>
```

#### Create Todo
```http
POST /api/todos
Content-Type: application/json

{
  "title": "My Todo",
  "description": "Todo description"
}
```

#### Get All Todos
```http
GET /api/todos
```

#### Get Single Todo
```http
GET /api/todos/:id
```

#### Update Todo
```http
PATCH /api/todos/:id
Content-Type: application/json

{
  "title": "Updated Todo",
  "completed": true
}
```

#### Delete Todo
```http
DELETE /api/todos/:id
```

## Error Handling

Both services include error handling for:
- Invalid input validation
- Authentication errors
- Database errors
- Not found resources

## Security Features

- Password hashing using bcrypt
- JWT-based authentication
- Input validation
- CORS enabled
- Secure password storage 