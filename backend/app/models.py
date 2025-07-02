
from typing import Optional, Dict, Any
from datetime import datetime

# Simple data classes to represent our models (no SQLAlchemy needed)

class User:
    def __init__(self, id: int, email: str, hashed_password: str, 
                 created_at: str, updated_at: Optional[str] = None):
        self.id = id
        self.email = email
        self.hashed_password = hashed_password
        self.created_at = created_at
        self.updated_at = updated_at
    
    @classmethod
    def from_row(cls, row: Dict[str, Any]) -> 'User':
        """Create User instance from database row"""
        return cls(
            id=row['id'],
            email=row['email'],
            hashed_password=row['hashed_password'],
            created_at=row['created_at'],
            updated_at=row.get('updated_at')
        )

class Session:
    def __init__(self, id: int, title: str, user_id: int, 
                 description: Optional[str] = None, file_path: Optional[str] = None,
                 filename: Optional[str] = None, file_size: Optional[int] = None,
                 duration: Optional[int] = None, created_at: Optional[str] = None,
                 updated_at: Optional[str] = None):
        self.id = id
        self.title = title
        self.description = description
        self.file_path = file_path
        self.filename = filename
        self.file_size = file_size
        self.duration = duration
        self.user_id = user_id
        self.created_at = created_at
        self.updated_at = updated_at
    
    @classmethod
    def from_row(cls, row: Dict[str, Any]) -> 'Session':
        """Create Session instance from database row"""
        return cls(
            id=row['id'],
            title=row['title'],
            description=row.get('description'),
            file_path=row.get('file_path'),
            filename=row.get('filename'),
            file_size=row.get('file_size'),
            duration=row.get('duration'),
            user_id=row['user_id'],
            created_at=row.get('created_at'),
            updated_at=row.get('updated_at')
        )

# Base class for compatibility (empty, just for imports)
class Base:
    pass
