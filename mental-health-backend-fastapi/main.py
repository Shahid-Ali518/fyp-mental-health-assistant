from fastapi import FastAPI
from app.api import TTS_controller, STT_controller, heath_controller
from fastapi.middleware.cors import CORSMiddleware


app = FastAPI(title="ML Service: TTS & STT", version="1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # React dev server
    allow_credentials=True,
    allow_methods=["*"],  # ["GET", "POST"] if you want to be strict
    allow_headers=["*"],  # ["Content-Type", "Authorization"]
)


# Register routers
app.include_router(heath_controller.router, prefix="/health", tags=["Health"])
app.include_router(TTS_controller.router, prefix="/api/tts", tags=["TTS"])
app.include_router(STT_controller.router, prefix="/api/stt", tags=["STT"])
