# Secure Record Storage – Notes API

A secure REST API for managing personal notes with full CRUD operations.  
Implements **ownership-based authorization** so users can only access, modify, or delete notes they created.

## Features

- User authentication with **JWT** (JSON Web Tokens)
- Password hashing with **bcrypt**
- **Ownership checks** on all note endpoints (GET, POST, PUT, DELETE)
- Only authenticated users can access the API
- Users can only see / update / delete **their own notes**

## Tech Stack

- **Node.js** + **Express** – server framework
- **MongoDB** + **Mongoose** – database and ODM
- **JSON Web Token (JWT)** – authentication
- **bcrypt** – password hashing
- **ES Modules** (`import/export`) – modern JavaScript syntax

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- MongoDB (local or Atlas)

### Installation

1. Clone the repository:

```bash
   git clone https://github.com/your-username/secure-record-storage.git
   cd secure-record-storage
Install dependencies:

```bash
npm install
```
Create a .env file in the root directory:

```text
MONGO_URI=mongodb://127.0.0.1:27017/notesdb
JWT_SECRET=your_super_secret_key_change_this
```

Start the server:

```bash
npm start
```

For development with auto‑restart:

```bash
npm run dev
```

The API will be available at http://localhost:3001.

API Endpoints
Authentication
Method	Endpoint	Description
POST	/api/users/register	Create a new user account
POST	/api/users/login	Log in and receive a JWT
Request body (register / login):

json
{
  "username": "alice",
  "email": "alice@example.com",
  "password": "password123"
}
Response (register / login):

json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": { "username": "alice", "email": "alice@example.com", ... }
}
All note endpoints require the token in the Authorization header:
Authorization: Bearer <your_token>

Notes (Protected)
Method	Endpoint	Description	Authorization
GET	/api/notes	Get all notes owned by the authenticated user	Required
GET	/api/notes/:id	Get a single note (if owner)	Required
POST	/api/notes	Create a new note (automatically owned by the user)	Required
PUT	/api/notes/:id	Update a note – only if owner	Required
DELETE	/api/notes/:id	Delete a note – only if owner	Required
Example: Create a note

```bash
curl -X POST http://localhost:3001/api/notes \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"title":"My Secret","content":"This is private"}'
```

Example: Update a note (owner only)

```bash
curl -X PUT http://localhost:3001/api/notes/<note_id> \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"title":"Updated Title"}'
```

Example: Delete a note (owner only)

```bash
curl -X DELETE http://localhost:3001/api/notes/<note_id> \
  -H "Authorization: Bearer <token>"
```

Security Implementation
  
1. Authentication Middleware
All /api/notes routes are protected by authMiddleware.
The middleware extracts the JWT from the Authorization header, verifies it, and attaches req.user (the decoded user data).

2. Ownership Checks
Each note document contains a user field (ObjectId reference to User).
GET /: Note.find({ user: req.user._id }) – only returns notes owned by the user.
POST /: Note.create({ ...req.body, user: req.user._id }) – assigns the owner.
PUT /:id and DELETE /:id:
Fetch the note, compare note.user with req.user._id (using .equals() for ObjectIds).
If mismatch → 403 Forbidden.

3. Password Security
Passwords are hashed with bcrypt (10 salt rounds) before saving.
The pre('save') hook uses an async function without next for Mongoose 7+ compatibility.
Testing
A comprehensive test script is included (test.js). It:
Registers two users (Alice and Bob).
Creates a note as Alice.
Verifies Alice can update and delete her own note.
Verifies Bob cannot update or delete Alice’s note (returns 403).
Confirms notes are isolated per user.
Run the test (server must be running):

```bash
node test.js
```

Expected output: all tests pass with ✅ indicators.

Project Structure
```bash
Project
├── config/
│   └── connection.js          # MongoDB connection
├── models/
│   ├── User.js                # User schema + password hashing
│   ├── Note.js                # Note schema with `user` reference
│   └── index.js               # Exports User & Note
├── routes/
│   ├── api/
│   │   ├── index.js           # Mounts userRoutes & noteRoutes
│   │   ├── userRoutes.js      # /register and /login
│   │   └── noteRoutes.js      # CRUD with ownership checks
│   └── index.js               # Main router
├── utils/
│   └── auth.js                # JWT middleware & token signing
├── .env                       # Environment variables
├── server.js                  # Entry point
├── test.js                    # Automated test suite
└── package.json
```

License
This project was created for educational purposes as part of a secure coding lab.