import uuid
from fastapi import APIRouter, File, HTTPException, UploadFile
from pathlib import Path
import shutil

from services.document_extractor import extract_text
from models.file_document import FileDocument

router = APIRouter()

UPLOAD_DIR = Path("uploads")
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)


@router.get("/{id}", response_model=FileDocument)
async def get_file(id: str):
    file_document = await FileDocument.get(id)
    if file_document is None:
        raise HTTPException(status_code=404, detail="File not found")
    return file_document


@router.post("/", response_model=FileDocument)
async def upload_file(file: UploadFile = File(...)):
    unique_id = uuid.uuid4()
    extension = file.filename.split(".")[-1]
    unique_filename = f"{unique_id}.{extension}"
    file_path = UPLOAD_DIR / unique_filename

    try:
        content = extract_text(file.file.read(), file.filename)

        metadata = FileDocument(
            name=file.filename,
            filepath=str(file_path),
            content_type=file.content_type,
            size=file.size,
            content=content,
        )
        metadata = await metadata.insert()

        with file_path.open("wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        return metadata
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"An error occurred while saving the file. {e}",
        ) from e
