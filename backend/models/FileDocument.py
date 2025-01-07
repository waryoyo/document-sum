from typing import Annotated
from beanie import Document, Indexed
from pydantic import Field


class FileDocument(Document):
    name: Annotated[str, Indexed(unique=True)]
    filepath: str = Field(..., repr=False)
    content_type: str
    size: int
    content: str

    class Settings:
        name = "files"
