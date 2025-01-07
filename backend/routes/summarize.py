from fastapi import APIRouter

router = APIRouter()


@router.post("/")
async def summarize_document(content: str):
    pass
