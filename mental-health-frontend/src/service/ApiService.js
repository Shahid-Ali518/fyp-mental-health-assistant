
import axios from "axios";

export class ApiService {
    BASE_URL = "http://localhost:8000";

    /**
     * Upload PDF and get back an audio file (MP3).
     * @param {File} pdfFile
     * @returns {Promise<Blob>} MP3 file as blob
     */
    async convertPdfToAudio(pdfFile) {
        try {
            const formData = new FormData();
            formData.append("file", pdfFile);

            const response = await axios.post(
                `${this.BASE_URL}/api/tts/`,
                formData,
                {
                    headers: { "Content-Type": "multipart/form-data" },
                    responseType: "blob", // so axios doesn't try to parse as JSON
                }
            );

            return response.data; // Blob (audio/mp3)
        } catch (error) {
            console.error("Error converting PDF to audio:", error);
            throw error;
        }
    }

    /**
  .   * Upload Audio and get back extracted text
     * @param {File} audioFile
     * @returns {Promise<string>} 
     */
    async convertAudioToText(audioFile) {
        try {
            const formData = new FormData();
            formData.append("file", audioFile);

            const response = await axios.post(
                `${this.BASE_URL}/api/stt/`,
                formData,
                {
                    headers: { "Content-Type": "multipart/form-data" },
                }
            );
            // console.log(response.data.text)

            return response.data.text;
        } catch (error) {
            console.error("Error converting audio to text:", error);
            throw error;
        }
    }

    // method to convert text to audio simply   
    async convertTextToAudio(text) {
        try {
            const response = await axios.post(
                `${this.BASE_URL}/api/tts/text-to-speech/`,
                { text }, // send JSON
                { responseType: "blob" } // we expect an audio file
            );

            return response.data; // Blob (MP3)
        } catch (error) {
            console.error("Error converting text to audio:", error);
            throw error;
        }
    }

}
