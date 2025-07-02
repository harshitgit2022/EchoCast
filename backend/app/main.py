
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import os

from app.database import init_database
from app.routes import auth, sessions, upload

# Initialize database (create tables if they don't exist)
init_database()

# Create FastAPI application
app = FastAPI(
    title="EchoCast API",
    description="Backend API for EchoCast podcast recording platform",
    version="1.0.0"
)

# Configure CORS (Cross-Origin Resource Sharing)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Serve uploaded files statically
if not os.path.exists("uploads"):
    os.makedirs("uploads")
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

# Include API routers
app.include_router(auth.router)
app.include_router(sessions.router)
app.include_router(upload.router)

# Root endpoint
@app.get("/")
async def root():
    return {
        "message": "EchoCast API is running!",
        "version": "1.0.0",
        "docs": "/docs",
        "endpoints": {
            "auth": "/auth",
            "sessions": "/sessions", 
            "upload": "/upload"
        }
    }

# Health check endpoint
@app.get("/health")
async def health_check():
    return {"status": "healthy", "database": "connected"}

# Welcome message for developers
@app.get("/welcome")
async def welcome():
    return {
        "message": "Welcome to EchoCast API!",
        "getting_started": [
            "1. Register a new account: POST /auth/signup",
            "2. Login to get token: POST /auth/login", 
            "3. Create a session: POST /sessions/create",
            "4. Upload audio file: POST /upload",
            "5. View your sessions: GET /sessions"
        ],
        "documentation": "Visit /docs for interactive API documentation"
    }
