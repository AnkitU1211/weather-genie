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
  const blinkTimeoutRef = useRef(null);
  const speechRef = useRef(null);

  const isMobile = /Mobi|Android/i.test(navigator.userAgent);
  const options = new faceapi.TinyFaceDetectorOptions({ inputSize: 160, scoreThreshold: 0.5 });
  let lastDetectionTime = Date.now();
  let lastBlinkTime = 0;

  const computeEyeRatio = (eye) => {
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

  const stopSpeech = () => {
    if (window.speechSynthesis && speechRef.current) {
      window.speechSynthesis.cancel();
      speechRef.current = null;
    }
  };

  const detectBlink = useCallback(async () => {
    if (stopBlinkDetection.current) return;

    const now = Date.now();
    if (now - lastDetectionTime < 150) {
      blinkAnimationRef.current = requestAnimationFrame(detectBlink);
      return;
    }
    lastDetectionTime = now;

    const detection = await faceapi
      .detectSingleFace(videoRef.current, options)
      .withFaceLandmarks();

    if (detection) {
      const leftEye = detection.landmarks.getLeftEye();
      const rightEye = detection.landmarks.getRightEye();
      const eyeRatio = (computeEyeRatio(leftEye) + computeEyeRatio(rightEye)) / 2.0;

      if (eyeRatio < 0.28 && !videoRef.current.eyeClosed) {
        videoRef.current.eyeClosed = true;
      } else if (eyeRatio > 0.28 && videoRef.current.eyeClosed) {
        const now = Date.now();
        if (now - lastBlinkTime > 400) {
          videoRef.current.blinkCount = (videoRef.current.blinkCount || 0) + 1;
          lastBlinkTime = now;
        }
        videoRef.current.eyeClosed = false;
      }

      if (videoRef.current.blinkCount >= 2) {
        stopBlinkDetection.current = true;

        if (blinkTimeoutRef.current) {
          clearTimeout(blinkTimeoutRef.current);
          blinkTimeoutRef.current = null;
        }

        stopSpeech();
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

  const detectMoodFromImage = async () => 'happy';

  const getMoviesSuggestion = async (mood, weather) =>
    `1. Movie A (2021) - Drama - Perfect for ${mood} during ${weather}.
2. Movie B (2019) - Romance - Ideal for ${mood}.
3. Movie C (2020) - Comedy - Great for ${weather} weather.`;

  const openRazorpay = () => {
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: 49900,
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

      const synth = window.speechSynthesis;

      const speakGenieInstruction = (lang = 'hi-IN') => {
        const messages = {
          'hi-IN': [
            "Namaste! Kripya apni aankhen do baar jhapkaayein. Weather Genie aapka intezaar kar raha hai!",
            "Shubh din! Do baar aankhen jhapkaayein aur Weather Genie ke jaadu ka anubhav karein!",
            "Namaste dost! Aankhen do baar jhapkaayein, Weather Genie aapke liye taiyaar hai!"
          ],
          'en-US': [
            "Hello! Please blink twice. Weather Genie is waiting for you!",
            "Greetings! Blink twice to experience the magic of Weather Genie!",
            "Hi there! Blink twice, and let Weather Genie work its magic!"
          ]
        };

        const messageList = messages[lang] || messages['hi-IN'];
        const message = messageList[Math.floor(Math.random() * messageList.length)];

        const utter = new SpeechSynthesisUtterance(message);
        speechRef.current = utter;
        utter.lang = lang;
        utter.pitch = 1.3;
        utter.rate = 0.9;
        utter.volume = 1;

        const playChime = () => {
          const audio = new Audio('https://www.soundjay.com/buttons/sounds/button-1.mp3');
          audio.play().catch(err => console.log('Sound play error:', err));
        };
        playChime();

        synth.speak(utter);

        utter.onend = () => {
          const playEndSound = () => {
            const audio = new Audio('https://www.soundjay.com/buttons/sounds/button-2.mp3');
            audio.play().catch(err => console.log('Sound play error:', err));
          };
          playEndSound();
        };
      };

      if (!mood && !suggestion && navigator.userActivation?.hasBeenActive) {
        speakGenieInstruction('hi-IN');
      }

      try {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
          setError('🚫 Your browser does not support camera access.');
          return;
        }

        await Promise.all([
          faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
          faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
        ]);

        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: 'user',
            width: { ideal: 320 },
            height: { ideal: 240 }
          }
        });

        streamRef.current = stream;
        videoRef.current.srcObject = stream;
        await videoRef.current.play();

        detectBlink();

        const timeoutDuration = isMobile ? 15000 : 10000;
        blinkTimeoutRef.current = setTimeout(() => {
          if (!stopBlinkDetection.current) {
            stopCamera();
            setLoading(false);
            setError('⌛ Timeout: Please blink twice within time.');
          }
        }, timeoutDuration);
      } catch (err) {
        stopCamera();
        setError('🚫 Camera or model loading issue!');
        setLoading(false);
      }
    };

    initApp();
    return () => {
      stopCamera();
      stopSpeech();
      if (blinkTimeoutRef.current) clearTimeout(blinkTimeoutRef.current);
    };
  }, [detectBlink]);

  return (
    <div className="app">
      <h1>🌦️ Weather Genie AI 🧞</h1>
      {loading && !error && (
        <div style={{
          textAlign: 'center',
          marginTop: '40px',
          animation: 'pulse 2s infinite',
          fontSize: '1.3rem',
          fontWeight: 'bold',
          color: '#0077ff'
        }}>
          👀 Please blink your eyes <span style={{ color: '#ff0080' }}>twice</span> to continue...
        </div>
      )}
      {error && <p>{error}</p>}
      {!loading && !error && mood && suggestion && (
        <div>
          <p>📍 Weather: {weather} in {city}, {temp}°C</p>
          <p>😊 Mood: {mood}</p>
          <pre style={{ whiteSpace: 'pre-wrap' }}>{suggestion}</pre>
        </div>
      )}
      <video ref={videoRef} style={{ display: 'none' }} autoPlay muted />
      <canvas ref={canvasRef} style={{ display: 'none' }} />
      <hr style={{ margin: '20px 0' }} />
      <button onClick={openRazorpay} style={{ padding: '10px 20px', fontSize: '16px' }}>
        💸 Support Weather Genie
      </button>
      {paymentStatus && <p style={{ marginTop: '10px' }}>{paymentStatus}</p>}
      <style>{`
        @keyframes pulse {
          0% { opacity: 0.7; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.05); }
          100% { opacity: 0.7; transform: scale(1); }
        }
      `}</style>
    </div>
  );
}
