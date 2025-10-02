import React, { useState, useRef } from "react";
import "./TextToSpeech.css";
import { ApiService } from "../../service/ApiService";

const api = new ApiService

const TextToSpeech = () => {
    const [pdfFile, setPdfFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [audioUrl, setAudioUrl] = useState(null);
    const [downloadName, setDownloadName] = useState("output.mp3");
    const audioRef = useRef(null);

    const onPdfChange = (e) => {
        setError("");
        setAudioUrl(null);
        const file = e.target.files?.[0] ?? null;
        if (file && !file.name.toLowerCase().endsWith(".pdf")) {
            setError("Please select a PDF file.");
            setPdfFile(null);
            return;
        }
        setPdfFile(file);
        if (file) setDownloadName(`${file.name.replace(/\.pdf$/i, "")}.mp3`);
    };

    const uploadPdf = async () => {
        setError("");
        if (!pdfFile) {
            setError("Please choose a PDF to convert.");
            return;
        }

        try {
            setLoading(true);

            const api = new ApiService();
            const audioBlob = await api.convertPdfToAudio(pdfFile);
            const url = URL.createObjectURL(audioBlob);
            setAudioUrl(url);

            setTimeout(() => audioRef.current?.play(), 200);
        } catch (err) {
            console.error(err);
            setError(
                err?.response?.data?.detail ||
                err?.message ||
                "Failed to convert PDF to speech."
            );
        } finally {
            setLoading(false);
        }
    };

    const handleDownload = () => {
        if (!audioUrl) return;
        const link = document.createElement("a");
        link.href = audioUrl;
        link.download = downloadName;
        document.body.appendChild(link);
        link.click();
        link.remove();
    };

    return (
        <div className="tts-container">
            <h2 className="tts-title">PDF → Speech</h2>

            <label className="file-label" htmlFor="pdf-input">
                Choose PDF
                <input
                    id="pdf-input"
                    type="file"
                    accept=".pdf"
                    onChange={onPdfChange}
                    className="file-input"
                />
            </label>

            {pdfFile && <div className="file-info">Selected: {pdfFile.name}</div>}

            {error && <div className="tts-error">{error}</div>}

            <div className="tts-actions">
                <button
                    className="btn primary"
                    onClick={uploadPdf}
                    disabled={loading || !pdfFile}
                >
                    {loading ? (
                        <span className="spinner" aria-hidden="true"></span>
                    ) : (
                        "Convert to Audio"
                    )}
                </button>

                <button
                    className="btn secondary"
                    onClick={() => {
                        setPdfFile(null);
                        setAudioUrl(null);
                        setError("");
                        document.getElementById("pdf-input").value = "";
                    }}
                    disabled={loading}
                >
                    Reset
                </button>
            </div>

            {audioUrl && (
                <div className="player-wrap">
                    <audio controls ref={audioRef} src={audioUrl} className="audio-player" />
                    <div className="download-row">
                        <button className="btn download" onClick={handleDownload}>
                            Download MP3
                        </button>
                        <a className="raw-link" href={audioUrl} target="_blank" rel="noreferrer">
                            Open in new tab
                        </a>
                    </div>
                </div>
            )}

            <p className="note">
                Tip: For large PDFs consider converting in background (Celery/queue). This demo does
                synchronous conversion.
            </p>
        </div>
    );
};

export default TextToSpeech;
