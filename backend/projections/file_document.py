from pydantic import BaseModel


class FileDocumentNameView(BaseModel):
    name: str
