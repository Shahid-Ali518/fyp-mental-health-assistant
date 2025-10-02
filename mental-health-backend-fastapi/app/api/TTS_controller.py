from fastapi import APIRouter, UploadFile, HTTPException
from fastapi.responses import FileResponse
from pydantic import BaseModel

from app.service.tts_service import pdf_to_speech, text_to_speech

router = APIRouter()

class TTSRequest(BaseModel):
    text: str


@router.post("/")
async def tts_from_pdf(file: UploadFile):
    try:
        output_path = await pdf_to_speech(file)
        return FileResponse(output_path, media_type="audio/mp3", filename="output.mp3")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/text-to-speech")
async def tts_from_text(request: TTSRequest):
    try:
        audio_file = await text_to_speech(request.text)
        return FileResponse(audio_file, media_type="audio/mp3", filename="audio.mp3")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
