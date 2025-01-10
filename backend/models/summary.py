from datetime import datetime
from pydantic import BaseModel, Field
from typing import List
from beanie import Document
from beanie import PydanticObjectId as ObjectId

from models.file_document import FileDocument


class Summary(Document):
    generation_model_name: str
    created_at: datetime
    summaries: List["SummaryChunk"]
    document_id: ObjectId


class SummaryChunk(BaseModel):
    start: int
    end: int
    text: str
