# BlogAPI Backend

## Overview

The BlogAPI Backend serves as the central server for the BlogAPI ecosystem.

It provides authentication, authorization, database management, user management, and blog post operations for both the Viewer Frontend and Author Frontend.

---

## Related Repositories

### Viewer Frontend

Repository:

`https://github.com/Saron-A/blogAPI-Viewer_Frontend`

Allows users to browse and read published blog posts.

### Author Frontend

Repository:

`https://github.com/Saron-A/blogAPI-Author_Frontend`

Allows users to create and manage blog content.

---

## System Architecture

```txt
Viewer Frontend
        │
        │ HTTP Requests
        ▼
   BlogAPI Backend
        ▲
        │
        │ HTTP Requests
        │
Author Frontend
        │
        ▼
 PostgreSQL Database
```

The backend acts as the communication layer between both frontends and the database.

---

## Technologies Used

### Runtime

* Node.js

### Framework

* Express.js

### Database

* PostgreSQL
* Supabase PostgreSQL

### Authentication

* JSON Web Tokens (JWT)
* bcrypt

### Other Tools

* dotenv
* cors
* nodemon
* pg

---

## Features

### User Management

* Create User
* Login User
* Get User Profile
* Retrieve User Information

### Authentication

* JWT Token Generation
* JWT Verification
* Protected Routes
* Authorization Middleware

### Post Management

* Create Posts
* Publish Posts
* Retrieve Posts
* Retrieve User Posts
* Retrieve Individual Posts

---

## API Endpoints

### Authentication

```http
POST /api/signup
POST /api/login
POST /api/logout
```

### Dashboard

```http
GET /api/dashboardA
GET /api/dashboardV
```

### User

```http
GET /api/profile
```

### Posts

```http
GET /api/posts
GET /api/posts/:postId

POST /api/posts

PUT /api/posts/:postId/publish
```

---

## Environment Variables

Create a `.env` file:

```env
DB_CONNECTION_STRING=your_database_url
JWT_SECRET=your_secret_key
PORT=5000
```

---

## Installation

Clone repository:

```bash
git clone https://github.com/Saron-A/blogAPI-backend
```

Install dependencies:

```bash
npm install
```

Run development server:

```bash
npm run dev
```

or

```bash
nodemon app.js
```

---

## Database Schema

### Users

```txt
users
├── id
├── username
├── email
├── password
└── created_at
```

### Posts

```txt
posts
├── id
├── title
├── body
├── user_id
├── is_published
└── created_at
```

---

## Authentication Flow

### Signup

1. User submits registration form.
2. Password is hashed.
3. User record is stored.
4. Success response is returned.

### Login

1. User submits credentials.
2. Password is verified.
3. JWT token is generated.
4. Token is returned to frontend.
5. Frontend stores token in localStorage.

### Protected Requests

1. Frontend sends:

```http
Authorization: Bearer <token>
```

2. Middleware verifies token.
3. User gains access to protected resources.

---

## Future Improvements

* Refresh Tokens
* Role-Based Access Control
* Post Editing
* Post Deletion
* Comments System
* Reactions and Likes
* API Documentation
* Unit Testing
* Deployment Pipeline

---

## Author

Built as a full-stack software engineering project to practice:

* Backend Development
* REST API Design
* PostgreSQL
* Authentication
* Authorization
* Database Design
* Software Architecture
