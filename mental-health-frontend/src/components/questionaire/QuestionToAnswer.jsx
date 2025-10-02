import React, { useState } from "react";
import "./QuestionToAnswer.css";
import { ApiService } from "../../service/ApiService";
import RecordRTC from "recordrtc";


const QuestionToAnswer = () => {
    const [questions, setQuestions] = useState([]);
    const [newQuestion, setNewQuestion] = useState("");
    const [recordedAnswer, setRecordedAnswer] = useState(null);
    const [answers, setAnswers] = useState({});
    const [recordingIndex, setRecordingIndex] = useState(null);
    const [mediaRecorder, setMediaRecorder] = useState(null);


    const apiService = new ApiService();

    let recorder;

    const addQuestion = () => {
        if (newQuestion.trim()) {
            setQuestions([...questions, newQuestion]);
            setNewQuestion("");
        }
    };

    const handlePlay = async (question) => {
        try {

            const res = await apiService.convertTextToAudio(question);
            const blob = await res;
            const url = URL.createObjectURL(blob);
            const audio = new Audio(url);
            audio.play();
        } catch (err) {
            console.error("TTS error:", err);
        }
    };

    const startRecording = async (index) => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const recorder = new MediaRecorder(stream);
            let chunks = [];

            recorder.ondataavailable = (e) => {
                if (e.data.size > 0) chunks.push(e.data);
            };

            recorder.onstop = async () => {
                const blob = new Blob(chunks, { type: "audio/wav" });
                const audioFile = new File([blob], "answer.wav", { type: "audio/wav" });

                const url = URL.createObjectURL(audioFile);
                setRecordedAnswer(url);

                try {
                    const text = await apiService.convertAudioToText(audioFile);

                    setAnswers((prev) => ({
                        ...prev,
                        [index]: text || "(no text detected)",
                    }));
                } catch (err) {
                    console.error("STT error:", err);
                }
            };



            recorder.start();
            setRecordingIndex(index);
            setMediaRecorder(recorder);
        } catch (err) {
            console.error("Mic error:", err);
        }
    };

    const stopRecording = () => {
        if (mediaRecorder) {
            mediaRecorder.stop();
            setRecordingIndex(null);
        }
    };

    return (
        <div className="assistant-container">
            <h1 className="assistant-title">Mental Health AI Assistant</h1>

            <div className="question-input-container">
                <input
                    type="text"
                    placeholder="Type your question..."
                    value={newQuestion}
                    onChange={(e) => setNewQuestion(e.target.value)}
                    className="question-input"
                />
                <button onClick={addQuestion} className="add-button">
                    Add
                </button>
            </div>

            {questions.map((q, idx) => (
                <div key={idx} className="question-card">
                    <div className="question-header">
                        <p className="question-text">{q}</p>
                        <button onClick={() => handlePlay(q)} className="play-button">
                            ▶ Play
                        </button>
                    </div>

                    <div className="answer-controls">
                        {recordingIndex === idx ? (
                            <button onClick={stopRecording} className="stop-button">
                                ⏹ Stop Recording
                            </button>
                        ) : (
                            <button
                                onClick={() => startRecording(idx)}
                                className="record-button"
                            >
                                🎤 Answer
                            </button>
                        )}

                    </div>
                    <div className="answer-audio">
                        {recordedAnswer && (
                            <audio controls src={recordedAnswer}></audio>
                        )}
                    </div>

                    {answers[idx] && (
                        <p className="answer-text">
                            <strong>Answer:</strong> {answers[idx]}
                        </p>
                    )}
                </div>
            ))}
        </div>
    );
};

export default QuestionToAnswer;
