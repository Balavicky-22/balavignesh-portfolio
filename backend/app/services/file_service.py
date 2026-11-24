import os
import uuid
from fastapi import UploadFile, HTTPException, status
from app.utils.utils import settings, BASE_DIR

ALLOWED_IMAGE_TYPES = {"image/jpeg", "image/png", "image/webp", "image/gif"}
ALLOWED_IMAGE_EXTENSIONS = {".jpg", ".jpeg", ".png", ".webp", ".gif"}
ALLOWED_DOC_TYPES = {"application/pdf"}
ALLOWED_DOC_EXTENSIONS = {".pdf"}

MAX_IMAGE_SIZE = 10 * 1024 * 1024   # 10 MB
MAX_DOC_SIZE = 20 * 1024 * 1024     # 20 MB


async def save_file(file: UploadFile, subfolder: str) -> str:
    """
    Save an uploaded file to uploads/{subfolder}/ and return the relative URL path.
    Validates file type and size based on whether it is an image or a PDF.
    """
    content = await file.read()
    file_size = len(content)

    # Determine file category by extension
    _, ext = os.path.splitext(file.filename or "")
    ext = ext.lower()

    if ext in ALLOWED_IMAGE_EXTENSIONS:
        if file_size > MAX_IMAGE_SIZE:
            raise HTTPException(
                status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
                detail="Image file size must be under 10 MB.",
            )
        if file.content_type and file.content_type not in ALLOWED_IMAGE_TYPES:
            raise HTTPException(
                status_code=status.HTTP_415_UNSUPPORTED_MEDIA_TYPE,
                detail=f"Unsupported image type: {file.content_type}. Allowed: jpg, png, webp, gif.",
            )
    elif ext in ALLOWED_DOC_EXTENSIONS:
        if file_size > MAX_DOC_SIZE:
            raise HTTPException(
                status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
                detail="PDF file size must be under 20 MB.",
            )
        if file.content_type and file.content_type not in ALLOWED_DOC_TYPES:
            raise HTTPException(
                status_code=status.HTTP_415_UNSUPPORTED_MEDIA_TYPE,
                detail=f"Unsupported document type: {file.content_type}. Allowed: pdf.",
            )
    else:
        raise HTTPException(
            status_code=status.HTTP_415_UNSUPPORTED_MEDIA_TYPE,
            detail=f"File type '{ext}' is not allowed. Allowed: jpg, png, webp, gif, pdf.",
        )

    # Build destination directory
    dest_dir = os.path.join(settings.UPLOAD_DIR, subfolder)
    os.makedirs(dest_dir, exist_ok=True)

    # Generate unique filename to avoid collisions
    unique_name = f"{uuid.uuid4().hex}{ext}"
    dest_path = os.path.join(dest_dir, unique_name)

    with open(dest_path, "wb") as f:
        f.write(content)

    # Return URL-style relative path
    return f"/uploads/{subfolder}/{unique_name}"


def delete_file(url: str) -> bool:
    """
    Delete a file given its relative URL path (e.g. /uploads/subfolder/filename).
    Returns True if deleted, False if file not found.
    """
    if not url:
        return False

    relative = url.lstrip("/")  # e.g. uploads/subfolder/filename or subfolder/filename
    if relative.startswith("uploads/"):
        relative_inside_uploads = relative[len("uploads/"):]
        file_path = os.path.join(settings.UPLOAD_DIR, relative_inside_uploads)
    else:
        file_path = os.path.join(settings.UPLOAD_DIR, relative)

    if not os.path.exists(file_path):
        # Fallback check relative to BASE_DIR
        fallback_path = os.path.join(BASE_DIR, relative)
        if os.path.exists(fallback_path):
            file_path = fallback_path

    if os.path.exists(file_path):
        try:
            os.remove(file_path)
            return True
        except OSError:
            return False
    return False
