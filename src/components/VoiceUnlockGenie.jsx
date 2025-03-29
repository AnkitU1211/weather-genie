import React, { useState, useEffect } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';

export default function VoiceUnlockGenie({ onUnlock }) {
  const [isListening, setIsListening] = useState(false);
  const [noiseDetected, setNoiseDetected] = useState(false);
  const [tapCount, setTapCount] = useState(0);
  const { transcript, resetTranscript, browserSupportsSpeechRecognition } = useSpeechRecognition();

  useEffect(() => {
    const interval = setInterval(() => {
      if (transcript.trim().length > 0) {
        setNoiseDetected(true);
        const normalized = transcript.toLowerCase().replace(/[.,!?']/g, '').trim();
        const magicPhrases = ["unlock the future"];
        const matched = magicPhrases.some(phrase => normalized.includes(phrase));
        if (matched) {
          onUnlock();
          SpeechRecognition.stopListening();
        }
        setTimeout(() => setNoiseDetected(false), 800);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [transcript, onUnlock]);

  useEffect(() => {
    if (isListening) {
      resetTranscript();
      SpeechRecognition.startListening({ continuous: true, language: 'en-IN' });
    } else {
      SpeechRecognition.stopListening();
    }
  }, [isListening]);

  const handleTripleTap = () => {
    setTapCount(prev => {
      const newCount = prev + 1;
      if (newCount === 3) {
        setTimeout(() => setTapCount(0), 500);
        onUnlock();
      }
      return newCount;
    });
  };

  if (!browserSupportsSpeechRecognition) {
    return <p>🚫 Your browser does not support speech recognition.</p>;
  }

  return (
    <div onClick={handleTripleTap} style={{ textAlign: 'center', marginTop: '2rem' }}>
      <h2 style={{ fontSize: '1.8rem', color: '#38bdf8' }}>🧞 Voice + Tap Unlock Portal</h2>
      <p style={{ color: '#a5f3fc' }}>
        Say <strong>"Unlock the future"</strong> or <strong>tap 3 times</strong> anywhere to access Weather Genie.
      </p>

      <button
        onClick={() => setIsListening(prev => !prev)}
        style={{
          padding: '1rem 2rem',
          borderRadius: '30px',
          fontSize: '1.2rem',
          backgroundColor: isListening ? '#dc2626' : '#22c55e',
          color: '#fff',
          border: 'none',
          cursor: 'pointer',
          marginTop: '1rem',
          boxShadow: '0 0 10px rgba(0,0,0,0.3)'
        }}
      >
        {isListening ? '🎤 Listening...' : '🔓 Begin Voice Unlock'}
      </button>

      {isListening && (
        <>
          <p style={{ marginTop: '1rem', color: '#fbbf24' }}>
            Listening... <em>{transcript}</em>
          </p>
          {noiseDetected && (
            <p style={{ color: '#10b981', fontWeight: 'bold' }}>🔊 Detecting sound waves...</p>
          )}
        </>
      )}
    </div>
  );
}
