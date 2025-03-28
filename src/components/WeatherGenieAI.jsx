import React, { useEffect, useRef, useState } from 'react';

export default function WeatherGenieAI() {
  const [weather, setWeather] = useState('');
  const [city, setCity] = useState('');
  const [temp, setTemp] = useState('');
  const [mood, setMood] = useState('');
  const [suggestion, setSuggestion] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        const res = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${coords.latitude}&lon=${coords.longitude}&appid=${import.meta.env.VITE_OPENWEATHER_API_KEY}&units=metric`
        );
        const data = await res.json();
        setWeather(data.weather[0].description);
        setCity(data.name);
        setTemp(data.main.temp);
      },
      () => setError('📍 Location permission denied.')
    );
  }, []);

  const openCameraAndDetectMood = async () => {
    setError('');
    setLoading(true);
    setSuggestion('');
    setMood('');

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      videoRef.current.srcObject = stream;

      videoRef.current.onloadedmetadata = () => {
        setTimeout(async () => {
          const video = videoRef.current;
          const canvas = canvasRef.current;

          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
          canvas.getContext('2d').drawImage(video, 0, 0);

          const imageBase64 = canvas.toDataURL('image/jpeg');
          stream.getTracks().forEach(track => track.stop());

          const detectedMood = await detectMoodFromImage(imageBase64);
          setMood(detectedMood);

          const movieList = await getMoviesSuggestion(detectedMood);
          setSuggestion(movieList);
          setLoading(false);
        }, 2000); // 2-second camera open
      };
    } catch {
      setError('🚫 Camera access denied.');
      setLoading(false);
    }
  };

  const detectMoodFromImage = async () => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
  
    const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/jpeg'));
    const imageBuffer = await blob.arrayBuffer();
  
    const res = await fetch('https://api-inference.huggingface.co/models/trpakov/vit-face-expression', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${import.meta.env.VITE_HF_API_KEY}`,
        'Content-Type': 'application/octet-stream',
      },
      body: imageBuffer,
    });
  
    if (!res.ok) {
      console.error("API error:", await res.text());
      return 'happy'; // fallback mood
    }
  
    const predictions = await res.json();
    console.log("Predictions:", predictions);
  
    const topEmotion = predictions[0]?.label.toLowerCase();
    
    if (topEmotion.includes('happy')) return 'happy';
    if (topEmotion.includes('sad')) return 'sad';
    if (topEmotion.includes('romantic') || topEmotion.includes('neutral')) return 'romantic';
  
    return 'happy'; // default
  };
  

  const getMoviesSuggestion = async (mood) => {
    const prompt = `Suggest 3 highly-rated movies for someone feeling "${mood}" during "${weather}" weather. Format: Title (Year) - Genre - Short summary.`;
    const res = await fetch('https://api-inference.huggingface.co/models/tiiuae/falcon-7b-instruct', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${import.meta.env.VITE_HF_API_KEY}`,
      },
      body: JSON.stringify({ inputs: prompt }),
    });
    const data = await res.json();
    return data[0]?.generated_text.replace(prompt, '').trim();
  };

  return (
    <div className="bg-gradient-to-b from-gray-950 to-black text-white p-5 min-h-screen text-center">
      <h1 className="text-4xl font-bold mb-4">🌦️ Weather Genie AI 🧞</h1>

      <p className="mb-2 text-lg">
        Weather: {weather ? `${weather} in ${city}, ${temp}°C` : 'Detecting...'}
      </p>

      {error && <p className="text-red-500 font-semibold">{error}</p>}

      {!loading && (
        <button
          onClick={openCameraAndDetectMood}
          className="bg-indigo-800 text-5xl rounded-full w-32 h-32 mx-auto my-4 shadow-lg transition-transform transform hover:scale-110"
        >
          👍
        </button>
      )}

      {loading && <p className="mt-4">📸 Detecting mood...</p>}

      <video ref={videoRef} autoPlay style={{ display: 'none' }}></video>
      <canvas ref={canvasRef} style={{ display: 'none' }}></canvas>

      {mood && suggestion && (
  <div className="mt-6 relative bg-indigo-900 p-5 rounded-xl shadow-2xl inline-block overflow-hidden transform transition-all duration-500 hover:scale-105 hover:shadow-indigo-500/50">
    {/* Gradient Border Effect */}
    <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500 animate-gradient-border opacity-75" />
    
    {/* Content */}
    <div className="relative z-10">
      <h2 className="text-2xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-yellow-300 to-orange-500 animate-pulse">
        Mood: {mood.toUpperCase()}
      </h2>
      <div className="suggestion-container text-left text-gray-200 max-w-md">
        {suggestion.split('\n').map((item, index) => (
          <div
            key={index}
            className="suggestion-item p-3 mb-2 bg-indigo-800 bg-opacity-60 rounded-md transition-all duration-300 hover:bg-opacity-90 hover:translate-x-2"
          >
            <span className="block text-sm leading-relaxed break-words">{item}</span>
          </div>
        ))}
      </div>
    </div>
  </div>
)}
    </div>
  );
}
