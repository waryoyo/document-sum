from pydantic import BaseModel, Field
from beanie import PydanticObjectId as ObjectId
from datetime import datetime
from typing import Optional


class SummaryShortView(BaseModel):
    id: ObjectId = Field(alias="_id")
    generation_model_name: str
    created_at: datetime
    document_id: ObjectId
    title: str
    description: str
