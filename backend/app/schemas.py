
from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime

# Pydantic models for request/response validation
# These define the structure of data going in and out of our API

# User registration request
class UserCreate(BaseModel):
    email: EmailStr  # Validates email format
    password: str

# User login request  
class UserLogin(BaseModel):
    email: EmailStr
    password: str

# User response (what we send back - no password!)
class UserResponse(BaseModel):
    id: int
    email: str
    created_at: datetime
    
    class Config:
        from_attributes = True  # Allows conversion from SQLAlchemy models

# JWT Token response
class Token(BaseModel):
    access_token: str
    token_type: str

# Session creation request
class SessionCreate(BaseModel):
    title: str
    description: Optional[str] = None

# Session response
class SessionResponse(BaseModel):
    id: int
    title: str
    description: Optional[str]
    filename: Optional[str]
    file_path: Optional[str]
    file_size: Optional[int]
    duration: Optional[int]
    user_id: int
    created_at: datetime
    updated_at: Optional[datetime]
    
    class Config:
        from_attributes = True

# File upload response
class FileUploadResponse(BaseModel):
    message: str
    filename: str
    file_path: str
    file_size: int
    session_id: Optional[int] = None
