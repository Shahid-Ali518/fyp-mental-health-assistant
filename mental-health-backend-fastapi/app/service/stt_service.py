        # app/service/stt_service.py
import whisper
import tempfile

from fastapi import HTTPException
from pydub import AudioSegment
import os
from pydub.utils import which
import noisereduce as nr
import librosa
import soundfile as sf


# method to clean the voice of audio or enhance audio quality

def denoise_audio(input_path, output_path="denoised.wav"):
    y, sr = librosa.load(input_path, sr=16000)
    reduced_noise = nr.reduce_noise(y=y, sr=sr)
    sf.write(output_path, reduced_noise, sr)
    return output_path

# Load Whisper model once at startup
model = whisper.load_model("small.en")

# this force to use ffmpeg to converts mp3 to wav files
AudioSegment.converter = which("ffmpeg")

async def speech_to_text(file):
    """
    Convert uploaded audio file (MP3/WAV) to text using Whisper
    """
# Save uploaded file temporarily
    temp_input = tempfile.mktemp(suffix=os.path.splitext(file.filename)[1])
    print("temp_input", temp_input)
    temp_wav = tempfile.mktemp(suffix=".wav")
    print("temp_wav", temp_wav)

    with open(temp_input, "wb") as f:
        f.write(await file.read())

    try:
        # Convert MP3 to WAV if needed
        if temp_input.lower().endswith((".mp3", ".wav", ".m4a", ".webm")):
            audio = AudioSegment.from_file(temp_input)  # auto-detect
            # Force mono + 16kHz sample rate
            audio = audio.set_channels(1)
            audio = audio.set_frame_rate(16000)

            # Optional: Normalize volume
            audio = audio.apply_gain(-audio.max_dBFS)

            if len(audio) == 0:
                raise HTTPException(status_code=400, detail="Uploaded audio is empty")
            audio.export(temp_wav, format="wav")
            input_path = temp_wav

        else:
            raise HTTPException(status_code=400, detail="Unsupported file type")

        print("input_path", input_path)
        # first get clean voice file
        clean_file = denoise_audio(temp_wav, temp_wav)

        result = model.transcribe(clean_file, language="en")
        # Transcribe audio with Whisper
        # result = model.transcribe(input_path, language="en")
        # {'text': '', 'segments': [], 'language': 'en'} this value is retuned how to
        # print(result)
        print(result["text"])
        return {"text": result["text"]}

    except Exception as e:
        print("Error converting audio to text:", e)
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        # Cleanup temporary files
        if os.path.exists(temp_input):
            os.remove(temp_input)
        if os.path.exists(temp_wav):
            os.remove(temp_wav)
            print()
