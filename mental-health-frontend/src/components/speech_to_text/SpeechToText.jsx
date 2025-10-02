import React, { useState } from "react";
import "./SpeechToText.css";
import jsPDF from "jspdf";
import { ApiService } from "../../service/ApiService";

const SpeechToText = () => {
    const [audioFile, setAudioFile] = useState(null);
    const [transcript, setTranscript] = useState("");
    const [isProcessing, setIsProcessing] = useState(false);

    // Handle file upload
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file && file.type.startsWith("audio/")) {
            setAudioFile(file);
            setTranscript("");
        } else {
            alert("Please upload a valid audio file.");
        }
    };

    // Upload audio & get transcript from FastAPI backend
    const handleTranscribe = async () => {
        if (!audioFile) return;
        setIsProcessing(true);

        try {
            const api = new ApiService();
            const response = await api.convertAudioToText(audioFile);

            const fullTranscript = response || "";
            const words = fullTranscript.split(" ");
            setTranscript("");

            let i = 0;

            // Create one utterance for the full text
            const utterance = new SpeechSynthesisUtterance(fullTranscript);

            // Triggered after each word is spoken
            utterance.onboundary = (event) => {
                if (event.name === "word" || event.charIndex !== undefined) {
                    if (i < words.length - 1) {
                        setTranscript((prev) => prev + words[i] + " ");
                        i++;
                    }
                }
            };

            // When speech ends
            utterance.onend = () => {
                setIsProcessing(false);
            };

            // Start speaking
            speechSynthesis.speak(utterance);

        } catch (err) {
            console.error(err);
            setIsProcessing(false);
        }
    };



    // Download transcript as PDF
    const downloadPDF = () => {
        const doc = new jsPDF();
        doc.setFont("Helvetica");
        doc.setFontSize(12);
        doc.text(transcript || "No transcript available.", 10, 10);
        doc.save("transcript.pdf");
    };

    return (
        <div className="speech-container">
            <h2>Audio to Text Converter</h2>

            <input
                type="file"
                accept="audio/*"
                onChange={handleFileChange}
                className="file-input1"
            />

            {audioFile && (
                <div className="audio-section">
                    <audio controls src={URL.createObjectURL(audioFile)}></audio>
                    <button onClick={handleTranscribe} disabled={isProcessing}>
                        {isProcessing ? "Transcribing..." : "Convert to Text"}
                    </button>
                </div>
            )}

            <div className="transcript-section">
                <h3>Transcript</h3>
                <p className="transcript">{transcript}</p>
            </div>

            {transcript && !isProcessing && (
                <button onClick={downloadPDF} className="download-btn">
                    Download as PDF
                </button>
            )}
        </div>
    );
};

export default SpeechToText;
