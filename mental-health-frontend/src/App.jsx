import { useState } from 'react'
import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import TextToSpeech from './components/text_to_speech/TextToSpeech'
import SpeechToText from './components/speech_to_text/SpeechToText'
import QuestionToAnswer from './components/questionaire/QuestionToAnswer'

function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/pdf-to-audio' element={<TextToSpeech />} />
          <Route path='/audio-to-text' element={<SpeechToText />} />
          <Route path='/questionaire' element={<QuestionToAnswer />} />
        </Routes>
      
      </BrowserRouter>
    </>
  )
}

export default App
