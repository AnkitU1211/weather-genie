import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as faceapi from 'face-api.js';

export default function WeatherGenieAI() {
  const [weather, setWeather] = useState('');
  const [city, setCity] = useState('');
  const [temp, setTemp] = useState('');
  const [mood, setMood] = useState('');
  const [suggestion, setSuggestion] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [paymentStatus, setPaymentStatus] = useState('');

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const blinkAnimationRef = useRef(null);
  const stopBlinkDetection = useRef(false);

  const computeEAR = (eye) => {
    const dist = (p1, p2) => Math.hypot(p1.x - p2.x, p1.y - p2.y);
    return (dist(eye[1], eye[5]) + dist(eye[2], eye[4])) / (2 * dist(eye[0], eye[3]));
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.srcObject = null;
    }
    stopBlinkDetection.current = true;
    cancelAnimationFrame(blinkAnimationRef.current);
  };

  const detectBlink = useCallback(async () => {
    if (stopBlinkDetection.current) return;

    const detection = await faceapi
      .detectSingleFace(videoRef.current, new faceapi.TinyFaceDetectorOptions())
      .withFaceLandmarks();

    if (detection) {
      const leftEye = detection.landmarks.getLeftEye();
      const rightEye = detection.landmarks.getRightEye();
      const ear = (computeEAR(leftEye) + computeEAR(rightEye)) / 2.0;

      if (ear < 0.25 && !videoRef.current.eyeClosed) {
        videoRef.current.eyeClosed = true;
      } else if (ear > 0.25 && videoRef.current.eyeClosed) {
        videoRef.current.blinkCount = (videoRef.current.blinkCount || 0) + 1;
        videoRef.current.eyeClosed = false;
      }

      if (videoRef.current.blinkCount >= 2) {
        stopBlinkDetection.current = true;
        await fetchWeatherAndMood();
        return;
      }
    }

    blinkAnimationRef.current = requestAnimationFrame(detectBlink);
  }, []);

  const fetchWeatherAndMood = async () => {
    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        try {
          const res = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${coords.latitude}&lon=${coords.longitude}&appid=${import.meta.env.VITE_OPENWEATHER_API_KEY}&units=metric`
          );
          const data = await res.json();
          setWeather(data.weather[0].description);
          setCity(data.name);
          setTemp(data.main.temp);

          const canvas = canvasRef.current;
          canvas.width = videoRef.current.videoWidth;
          canvas.height = videoRef.current.videoHeight;
          canvas.getContext('2d').drawImage(videoRef.current, 0, 0);

          stopCamera();

          const imageBase64 = canvas.toDataURL('image/jpeg');
          const detectedMood = await detectMoodFromImage(imageBase64);
          setMood(detectedMood);

          const movieList = await getMoviesSuggestion(detectedMood, data.weather[0].description);
          setSuggestion(movieList);
          setLoading(false);
        } catch (err) {
          stopCamera();
          setError('❌ Error fetching weather or mood');
          setLoading(false);
        }
      },
      () => {
        stopCamera();
        setError('📍 Location permission denied.');
        setLoading(false);
      }
    );
  };

  const detectMoodFromImage = async () => 'happy'; // Placeholder mood detection

  const getMoviesSuggestion = async (mood, weather) =>
    `1. Movie A (2021) - Drama - Perfect for ${mood} during ${weather}.
2. Movie B (2019) - Romance - Ideal for ${mood}.
3. Movie C (2020) - Comedy - Great for ${weather} weather.`;

  const openRazorpay = () => {
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID, // 👈 .env file mein define kar
      amount: 49900, // ₹499.00 in paisa
      currency: 'INR',
      name: 'Weather Genie AI',
      description: 'Support this magical project!',
      image: 'https://your-logo-url.com/logo.png',
      handler: function (response) {
        setPaymentStatus(`✅ Payment successful! Payment ID: ${response.razorpay_payment_id}`);
      },
      prefill: {
        name: 'Weather Genie User',
        email: 'user@example.com',
        contact: '9999999999'
      },
      notes: {
        address: 'Weather Genie App Support'
      },
      theme: {
        color: '#3399cc'
      }
    };

    const rzp = new window.Razorpay(options);
    rzp.open();

    rzp.on('payment.failed', function (response) {
      setPaymentStatus(`❌ Payment failed: ${response.error.description}`);
    });
  };

  useEffect(() => {
    const initApp = async () => {
      setLoading(true);
      stopBlinkDetection.current = false;
      try {
        await Promise.all([
          faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
          faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
        ]);

        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        streamRef.current = stream;
        videoRef.current.srcObject = stream;
        await videoRef.current.play();

        detectBlink();

        setTimeout(() => {
          if (!stopBlinkDetection.current) {
            stopCamera();
            setLoading(false);
            setError('⌛ Timeout: Please blink twice within 5 seconds.');
          }
        }, 5000);
      } catch (err) {
        stopCamera();
        setError('🚫 Camera or model loading issue!');
        setLoading(false);
      }
    };

    initApp();
    return () => stopCamera();
  }, [detectBlink]);

  return (
    <div className="app">
      <h1>🌦️ Weather Genie AI 🧞</h1>
      {loading && <p>📸 Detecting blink and mood...</p>}
      {error && <p>{error}</p>}
      {!loading && !error && mood && suggestion && (
        <div>
          <p>📍 Weather: {weather} in {city}, {temp}°C</p>
          <p>😊 Mood: {mood}</p>
          <pre style={{ whiteSpace: 'pre-wrap' }}>{suggestion}</pre>
        </div>
      )}

      {/* 👇 Hidden Video - required for face-api.js */}
      <video ref={videoRef} style={{ display: 'none' }} autoPlay muted />
      <canvas ref={canvasRef} style={{ display: 'none' }} />

      <hr style={{ margin: '20px 0' }} />

      <button onClick={openRazorpay} style={{ padding: '10px 20px', fontSize: '16px' }}>
        💸 Support Weather Genie
      </button>

      {paymentStatus && <p style={{ marginTop: '10px' }}>{paymentStatus}</p>}
    </div>
  );
}
