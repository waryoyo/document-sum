import io
import uuid
from fastapi import APIRouter, File, HTTPException, UploadFile
from pathlib import Path
import shutil

from fastapi.responses import FileResponse

from services.document_extractor import extract_text
from models.file_document import FileDocument
from beanie import PydanticObjectId as ObjectId

router = APIRouter()

UPLOAD_DIR = Path("uploads")
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)


@router.get("/{id}", response_model=FileDocument)
async def get_file(id: str):
    file_document = await FileDocument.get(id)
    if file_document is None:
        raise HTTPException(status_code=404, detail="File not found")
    return file_document


@router.get("/files/{file_id}")
async def serve_file(file_id: ObjectId):

    file_document = await FileDocument.get(file_id)
    if file_document is None:
        raise HTTPException(status_code=404, detail="File not found")

    file_path = Path(file_document.filepath)
    if not file_path.exists():
        raise HTTPException(
            status_code=404, detail="File not found in the server storage"
        )

    return FileResponse(str(file_path), media_type=file_document.content_type)


@router.post("/", response_model=FileDocument)
async def upload_file(file: UploadFile = File(...)):
    unique_id = uuid.uuid4()
    extension = file.filename.split(".")[-1]
    unique_filename = f"{unique_id}.{extension}"
    file_path = UPLOAD_DIR / unique_filename
    file_content = file.file.read()
    try:
        content = extract_text(file_content, file.filename)

        metadata = FileDocument(
            name=file.filename,
            filepath=str(file_path),
            content_type=file.content_type,
            size=file.size,
            content=content,
        )
        metadata = await metadata.insert()

        with open(file_path, "w+b") as buffer:
            buffer.write(file_content)

        return metadata
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"An error occurred while saving the file. {e}",
        ) from e
