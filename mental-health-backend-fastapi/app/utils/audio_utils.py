# In case you need helper methods for audio save/convert
from pydub import AudioSegment
import tempfile

def convert_to_wav(input_path, output_path):
    audio = AudioSegment.from_file(input_path)
    audio.export(output_path, format="wav")



def save_audio_temp(suffix=".mp3"):
    return tempfile.mktemp(suffix=suffix)
