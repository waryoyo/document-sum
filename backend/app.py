from contextlib import asynccontextmanager
from fastapi import FastAPI, Request
from starlette.middleware.cors import CORSMiddleware
from routes.upload import router as upload_router
from routes.summarize import router as summarize_router

from core.setup import setup_openai, start_beanie


@asynccontextmanager
async def lifespan(app: FastAPI):
    await start_beanie()
    setup_openai()
    yield


app = FastAPI(
    lifespan=lifespan, swagger_ui_parameters={"syntaxHighlight.theme": "obsidian"}
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health", tags=["health"])
async def health_check():
    return {"status": "ok"}


app.include_router(upload_router, prefix="/api/document", tags=["Document"])
app.include_router(summarize_router, prefix="/api/summarize", tags=["Summarize"])
