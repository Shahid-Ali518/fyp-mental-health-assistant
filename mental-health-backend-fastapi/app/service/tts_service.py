import pyttsx3
import PyPDF2
import tempfile
from app.utils.audio_utils import save_audio_temp

async def pdf_to_speech(file):
    # Extract text from PDF
    reader = PyPDF2.PdfReader(file.file)
    text = ""
    for page in reader.pages:
        text += page.extract_text() + " "

    # Initialize TTS engine
    engine = pyttsx3.init()
    temp_path = tempfile.mktemp(suffix=".mp3")

    # Save audio
    engine.save_to_file(text, temp_path)
    engine.runAndWait()
    return temp_path

 # method to convert text to speech
async  def text_to_speech(text):
    engine = pyttsx3.init()
    temp_path = tempfile.mktemp(suffix=".mp3")
    engine.save_to_file(text, temp_path)
    engine.runAndWait()
    return temp_path