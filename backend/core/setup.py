from beanie import init_beanie
from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase
from models.summary import Summary
from models.file_document import FileDocument
from config import MONGO_CONNECTION_STRING


async def start_beanie():
    client = AsyncIOMotorClient(MONGO_CONNECTION_STRING)

    await init_beanie(
        database=client.documentAi,
        document_models=[FileDocument, Summary],
    )


def setup_openai():
    import openai

    openai.api_key = "REMOVED"
    openai.base_url = "https://api.groq.com/openai"
