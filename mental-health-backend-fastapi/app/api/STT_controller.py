from fastapi import APIRouter, UploadFile, HTTPException
from app.service.stt_service import speech_to_text

router = APIRouter()

@router.post("/")
async def stt_from_audio(file: UploadFile):
    try:
        result = await speech_to_text(file)
        return {"text": result["text"]}   
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
