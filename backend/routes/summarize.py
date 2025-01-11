from typing import List
from fastapi import APIRouter, HTTPException
from beanie import PydanticObjectId as ObjectId
from projections.file_document import FileDocumentNameView
from projections.summary import SummaryShortView
from models.summary import Summary, SummaryChunk, SummaryMetadata
from schemas.summary import SummaryResponse
from services.rolling_summarizer import RollingSummarizer
from models.file_document import FileDocument
from datetime import datetime

router = APIRouter()


# Consider using projections in future
@router.get("/", response_model=List[SummaryResponse])
async def get_summaries_list():
    try:
        summaries: List[SummaryResponse] = []
        summaries_views = await Summary.find_all().project(SummaryShortView).to_list()

        for summary_view in summaries_views:
            document = await FileDocument.find_one(
                FileDocument.id == summary_view.document_id
            ).project(FileDocumentNameView)

            summary = SummaryResponse(
                **summary_view.model_dump(exclude={"generation_model_name"}),
                document_name=document.name,
                model_name=summary_view.generation_model_name,
            )
            summaries.append(summary)

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
        summary_chunks = []

        for start, end, chunk_summary in rolling_summarizer.summarize(document.content):
            summary_chunks.append(
                SummaryChunk(start=start, end=end, text=chunk_summary)
            )
        summary_details = rolling_summarizer.obtain_title_description()
        summary = Summary(
            generation_model_name=rolling_summarizer.model,
            created_at=datetime.now(),
            summaries=summary_chunks,
            document_id=document_id,
            title=summary_details.title,
            description=summary_details.description,
            summary_metadata=SummaryMetadata(
                total_input_tokens=rolling_summarizer.total_input_tokens,
                total_output_tokens=rolling_summarizer.total_output_tokens,
            ),
        )
        summary = await summary.insert()

        return {"summary_id": str(summary.id)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal Server Error, {e}")
