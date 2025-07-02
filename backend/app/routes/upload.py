
from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File, Form
from sqlalchemy.orm import Session
import os
import shutil
from typing import Optional

from ..database import get_db
from .. import models, schemas, utils
from .auth import get_current_user

# Create router for file upload endpoints
router = APIRouter(
    prefix="/upload",
    tags=["File Upload"]
)

@router.post("/", response_model=schemas.FileUploadResponse)
async def upload_file(
    file: UploadFile = File(...),
    session_id: Optional[int] = Form(None),
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Upload audio/video file
    """
    # Validate file type (basic validation)
    allowed_extensions = {'.mp3', '.wav', '.m4a', '.mp4', '.webm', '.ogg'}
    file_extension = os.path.splitext(file.filename)[1].lower()
    
    if file_extension not in allowed_extensions:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"File type {file_extension} not allowed. Allowed types: {', '.join(allowed_extensions)}"
        )
    
    # Ensure upload directory exists
    upload_dir = utils.ensure_upload_directory()
    
    # Create unique filename to avoid conflicts
    import uuid
    unique_filename = f"{uuid.uuid4()}_{file.filename}"
    file_path = os.path.join(upload_dir, unique_filename)
    
    try:
        # Save file to disk
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        
        # Get file size
        file_size = utils.get_file_size(file_path)
        
        # If session_id provided, update the session with file info
        if session_id:
            session = db.query(models.Session).filter(
                models.Session.id == session_id,
                models.Session.user_id == current_user.id
            ).first()
            
            if not session:
                # Clean up uploaded file if session not found
                os.remove(file_path)
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="Session not found"
                )
            
            # Update session with file information
            session.filename = file.filename
            session.file_path = file_path
            session.file_size = file_size
            db.commit()
        
        return schemas.FileUploadResponse(
            message="File uploaded successfully",
            filename=file.filename,
            file_path=file_path,
            file_size=file_size,
            session_id=session_id
        )
        
    except Exception as e:
        # Clean up file if there was an error
        if os.path.exists(file_path):
            os.remove(file_path)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error uploading file: {str(e)}"
        )

@router.post("/session/{session_id}", response_model=schemas.SessionResponse)
async def upload_to_session(
    session_id: int,
    file: UploadFile = File(...),
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Upload file directly to a specific session
    """
    # Find the session
    session = db.query(models.Session).filter(
        models.Session.id == session_id,
        models.Session.user_id == current_user.id
    ).first()
    
    if not session:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Session not found"
        )
    
    # Upload the file
    upload_response = await upload_file(file, session_id, current_user, db)
    
    # Return updated session
    db.refresh(session)
    return session
