
# EchoCast Backend API

A FastAPI-based backend for the EchoCast podcast recording platform.

## Features

- 🔐 User authentication (signup/login) with JWT tokens
- 📁 File upload for audio/video recordings
- 💾 Session management with SQLite database
- 🔒 Protected API endpoints
- 📚 Interactive API documentation

## Quick Start

1. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

2. **Run the server:**
   ```bash
   uvicorn main:app --reload
   ```

3. **Access the API:**
   - API: http://127.0.0.1:8000
   - Documentation: http://127.0.0.1:8000/docs

## API Endpoints

### Authentication
- `POST /auth/signup` - Register new user
- `POST /auth/login` - Login and get JWT token
- `GET /auth/me` - Get current user info (protected)

### Sessions
- `POST /sessions/create` - Create new recording session (protected)
- `GET /sessions/` - Get all user sessions (protected)
- `GET /sessions/{id}` - Get specific session (protected)
- `DELETE /sessions/{id}` - Delete session (protected)

### File Upload
- `POST /upload/` - Upload audio/video file (protected)
- `POST /upload/session/{id}` - Upload file to specific session (protected)

## Testing with curl

### 1. Register a new user:
```bash
curl -X POST "http://127.0.0.1:8000/auth/signup" \
     -H "Content-Type: application/json" \
     -d '{"email": "test@example.com", "password": "testpass123"}'
```

### 2. Login to get token:
```bash
curl -X POST "http://127.0.0.1:8000/auth/login" \
     -H "Content-Type: application/x-www-form-urlencoded" \
     -d "username=test@example.com&password=testpass123"
```

### 3. Create a session (replace YOUR_TOKEN):
```bash
curl -X POST "http://127.0.0.1:8000/sessions/create" \
     -H "Authorization: Bearer YOUR_TOKEN" \
     -H "Content-Type: application/json" \
     -d '{"title": "My First Recording", "description": "Test session"}'
```

### 4. Upload a file:
```bash
curl -X POST "http://127.0.0.1:8000/upload/" \
     -H "Authorization: Bearer YOUR_TOKEN" \
     -F "file=@your-audio-file.mp3" \
     -F "session_id=1"
```

## Project Structure

```
backend/
├── app/
│   ├── __init__.py
│   ├── database.py      # Database configuration
│   ├── models.py        # SQLAlchemy models
│   ├── schemas.py       # Pydantic schemas
│   ├── utils.py         # Utility functions
│   └── routes/
│       ├── __init__.py
│       ├── auth.py      # Authentication routes
│       ├── sessions.py  # Session management routes
│       └── upload.py    # File upload routes
├── main.py              # FastAPI app entry point
├── requirements.txt     # Python dependencies
└── README.md           # This file
```

## Database

The app uses SQLite database (`echocast.db`) with two main tables:
- `users` - User accounts
- `sessions` - Recording sessions with file metadata

## File Storage

Uploaded files are stored in the `uploads/` directory and served statically at `/uploads/`.

## Security Notes

⚠️ **For Production:**
- Change the SECRET_KEY in `utils.py`
- Use environment variables for sensitive data
- Consider using a more robust database (PostgreSQL)
- Add rate limiting
- Implement proper logging

## Learning Resources

This backend demonstrates:
- RESTful API design
- JWT authentication
- File upload handling
- Database relationships
- Error handling
- API documentation

Great for learning web backend development concepts!
