from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse, Response

from starlette.middleware.cors import CORSMiddleware
from starlette.datastructures import MutableHeaders

from routes.upload import router as upload_router

app = FastAPI(swagger_ui_parameters={"syntaxHighlight.theme": "obsidian"})

# TODO: MAKE allowed origin only the frontend
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


app.include_router(upload_router, prefix="/api/upload", tags=["Upload"])

if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000)
