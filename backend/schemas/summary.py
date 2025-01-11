from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime
from beanie import PydanticObjectId as ObjectId


class SummaryResponse(BaseModel, extra="ignore"):
    id: ObjectId
    title: str
    description: str
    model_name: str
    created_at: datetime
    document_id: ObjectId
    document_name: str
