from typing import List
from fastapi import APIRouter, HTTPException
from beanie import PydanticObjectId as ObjectId
from models.summary import Summary, SummaryChunk
from schemas.summary import SummaryResponse
from services.rolling_summarizer import RollingSummarizer
from models.file_document import FileDocument
from datetime import datetime
from pydantic import create_model

router = APIRouter()


# Consider using projections in future
@router.get("/", response_model=List[SummaryResponse])
async def get_summaries_list():
    try:
        DocumentNameProjection = create_model("documentName", name=(str, ...))

        summaries = await Summary.find_all().project(SummaryResponse).to_list()
        for summary in summaries:
            document = await FileDocument.find_one(
                FileDocument.id == summary.document_id
            ).project(DocumentNameProjection)
            summary.document_name = document.name

        return summaries
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal Server Error, {e}")


@router.get("/{id}", response_model=Summary)
async def get_summary(id: ObjectId):
    try:
        summary = await Summary.get(id)
        if not summary:
            raise HTTPException(status_code=404, detail="Summary not found")
        return summary
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal Server Error, {e}")


@router.get("/create/{document_id}", response_model=dict)
async def summarize_document(document_id: ObjectId):
    try:
        document = await FileDocument.get(document_id)
        if not document:
            raise HTTPException(status_code=404, detail="Document not found")

        rolling_summarizer = RollingSummarizer()

        summary = Summary(
            generation_model_name=rolling_summarizer.model,
            created_at=datetime.now(),
            summaries=[],
            document_id=document_id,
        )

        for start, end, chunk_summary in rolling_summarizer.summarize(document.content):
            summary.summaries.append(
                SummaryChunk(start=start, end=end, text=chunk_summary)
            )

        summary = await summary.insert()

        return {"summary_id": str(summary.id)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal Server Error, {e}")
