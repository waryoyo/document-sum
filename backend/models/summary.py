from datetime import datetime
from pydantic import BaseModel, Field
from typing import List, Optional
from beanie import Document
from beanie import PydanticObjectId as ObjectId

from models.file_document import FileDocument


class SummaryMetadata(BaseModel):
    total_input_tokens: int
    total_output_tokens: int


class Summary(Document):
    generation_model_name: str
    created_at: datetime
    summaries: List["SummaryChunk"]
    document_id: ObjectId

    title: str
    description: str
    summary_metadata: Optional[SummaryMetadata]


class SummaryChunk(BaseModel):
    start: int
    end: int
    text: str
