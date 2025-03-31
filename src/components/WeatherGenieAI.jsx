import React, { useEffect, useRef, useState } from 'react';
// Optional: import axios from 'axios';
import * as faceapi from 'face-api.js'; // Import face-api.js

// --- HUGGING FACE CONFIGURATION ---
// Using gpt2 model - it's generally available and decent for simple generation.
// You could try others like 'distilgpt2' (smaller/faster) or newer ones if needed.
const HUGGINGFACE_MODEL_URL = "https://api-inference.huggingface.co/models/distilgpt2";
// --- END HUGGING FACE CONFIGURATION ---

export default function WeatherGenieAI() {
  const [weather, setWeather] = useState('');
  const [city, setCity] = useState('');
  const [temp, setTemp] = useState('');
  const [mood, setMood] = useState('');
  const [suggestion, setSuggestion] = useState(''); // Re-added for suggestions
  const [suggestionLoading, setSuggestionLoading] = useState(false); // Separate loading for suggestions
  const [suggestionError, setSuggestionError] = useState(''); // Separate error for suggestions
  const [loading, setLoading] = useState(true); // Main loading for camera/weather
  const [error, setError] = useState(''); // Main error
  const [paymentStatus, setPaymentStatus] = useState('');

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const faceDetectionInterval = useRef(null); // Ref for the interval

  // --- Camera Stop Function (no changes needed) ---
  const stopCamera = () => {
    console.log('Attempting to stop camera...'); // Debug log
    if (streamRef.current) {
      const tracks = streamRef.current.getTracks();
      console.log(`Found ${tracks.length} tracks to stop.`); // Debug log
      tracks.forEach(track => {
        console.log(`Stopping track: ${track.label} (${track.kind}, ${track.id})`); // Debug log
        track.stop();
      });
      streamRef.current = null; // Clear the ref
      console.log('Stream tracks stopped and streamRef cleared.'); // Debug log
    } else {
      console.log('No active stream found in streamRef to stop.'); // Debug log
    }

    if (videoRef.current) {
      if (videoRef.current.srcObject) {
        videoRef.current.srcObject = null; // Release the stream
        console.log('Video source object cleared.'); // Debug log
      } else {
        console.log('No source object found on video element.'); // Debug log
      }
      videoRef.current.pause(); // Pause video playback
    } else {
      console.log('Video ref not found.'); // Debug log
    }
    console.log('Camera stop sequence completed.'); // Debug log
  };

  // --- Weather Fetch Function (no changes needed) ---
  const fetchWeather = async () => {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        async ({ coords }) => {
          try {
            const res = await fetch(
              `https://api.openweathermap.org/data/2.5/weather?lat=${coords.latitude}&lon=${coords.longitude}&appid=${import.meta.env.VITE_OPENWEATHER_API_KEY}&units=metric`
            );
            if (!res.ok) {
              throw new Error(`Weather API request failed with status ${res.status}`);
            }
            const data = await res.json();
            if (!data || !data.main || !data.weather || !data.weather[0]) {
              throw new Error('❌ Invalid weather data format received');
            }
            resolve({
              city: data.name || 'Unknown City',
              temperature: data.main.temp,
              weather: data.weather[0].description
            });
          } catch (fetchError) {
            console.error("Weather fetch error:", fetchError);
            reject(`❌ Weather fetch error: ${fetchError.message}`);
          }
        },
        (geoError) => {
          console.error("Geolocation error:", geoError);
          reject(`📍 Location permission denied or error: ${geoError.message}`)
        }
      );
    });
  };

  // --- Function to get Movie Suggestions from Hugging Face ---
  const getHuggingFaceMoviesSuggestion = async (currentMood, currentWeather) => {
    const HF_TOKEN = import.meta.env.VITE_HUGGINGFACE_API_TOKEN;

    if (!HF_TOKEN) {
      console.error("Hugging Face API Token (VITE_HUGGINGFACE_API_TOKEN) is missing in .env.local");
      throw new Error("Movie suggestion service is not configured."); // Throw error to be caught
    }

    // Construct a prompt for the model
    const prompt = `Suggest 3 diverse movies (title and year, e.g., Movie Title (YYYY)) suitable for someone feeling ${currentMood} during ${currentWeather} weather. Be brief. Suggestions:\n1.`;

    console.log("Sending prompt to Hugging Face:", prompt); // Debug log

    try {
      // --- Using fetch (built-in) ---
      const response = await fetch(HUGGINGFACE_MODEL_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${HF_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inputs: prompt,
          parameters: {
            max_new_tokens: 60,       // Limit output length
            num_return_sequences: 1,
            do_sample: true,          // More creative/varied output
            temperature: 0.8,         // Adjust randomness (0.7-1.0 is common)
            top_p: 0.9,               // Nucleus sampling
            repetition_penalty: 1.1,  // Slightly discourage repeating words
          },
          options: {
            wait_for_model: true // Wait if the model is loading (good for free tier)
          }
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Hugging Face API Error:", errorData);
        // Handle specific errors if needed (e.g., rate limits, model loading)
        if (response.status === 503 && errorData.error?.includes("currently loading")) {
          throw new Error(`Movie model is loading, please wait and retry. (${response.status})`);
        }
        throw new Error(`Failed to fetch suggestions: ${errorData.error || response.statusText} (${response.status})`);
      }

      const result = await response.json();
      console.log("Hugging Face API Raw Result:", result); // Debug log

      if (result && Array.isArray(result) && result[0] && result[0].generated_text) {
        // Clean the result: remove the prompt if the model included it, trim whitespace
        let suggestions = result[0].generated_text;
        if (suggestions.startsWith(prompt)) {
          suggestions = suggestions.substring(prompt.length);
        }
        // Sometimes models don't respect the starting number, add it back if needed.
        if (!suggestions.trim().startsWith('1.')) {
          suggestions = "1. " + suggestions.trim();
        }
        return suggestions.trim();
      } else {
        console.error("Unexpected response format from Hugging Face:", result);
        throw new Error("Received unexpected format for movie suggestions.");
      }

      // --- Alternative using axios (if installed) ---
      /*
      const axios = require('axios'); // or import axios from 'axios';
      const response = await axios.post(
        HUGGINGFACE_MODEL_URL,
        {
          inputs: prompt,
          parameters: {
            max_new_tokens: 60,
            num_return_sequences: 1,
            do_sample: true,
            temperature: 0.8,
            top_p: 0.9,
            repetition_penalty: 1.1
          },
          options: {
            wait_for_model: true
          }
        },
        {
          headers: {
            'Authorization': `Bearer ${HF_TOKEN}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.data && Array.isArray(response.data) && response.data[0] && response.data[0].generated_text) {
        let suggestions = response.data[0].generated_text;
        if (suggestions.startsWith(prompt)) {
          suggestions = suggestions.substring(prompt.length);
        }
        if (!suggestions.trim().startsWith('1.')) {
          suggestions = "1. " + suggestions.trim();
        }
        return suggestions.trim();
      } else {
        console.error("Unexpected response format from Hugging Face:", response.data);
        throw new Error("Received unexpected format for movie suggestions.");
      }
      */

    } catch (error) {
      console.error("Error fetching movie suggestions:", error);
      // Re-throw specific types of errors or a generic one
      throw new Error(`Could not get movie suggestions. ${error.message || ''}`);
    }
  };

  // --- Facial Recognition Logic ---
  const loadModels = async () => {
    const MODEL_URL = '/models'; // Assuming 'models' folder is in your public directory
    try {
      await Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
        faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
        faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
        faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL),
      ]);
      console.log('Face API models loaded successfully.');
      return true;
    } catch (error) {
      console.error('Error loading Face API models:', error);
      setError('Failed to load facial recognition models.');
      return false;
    }
  };

  const detectMood = async () => {
    if (videoRef.current && canvasRef.current && faceapi.nets.tinyFaceDetector.params) {
      canvasRef.current.width = videoRef.current.videoWidth;
      canvasRef.current.height = videoRef.current.videoHeight;
      const displaySize = { width: videoRef.current.videoWidth, height: videoRef.current.videoHeight };
      faceapi.matchDimensions(canvasRef.current, displaySize);

      const detection = await faceapi.detectSingleFace(videoRef.current, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceExpressions();

      if (detection && detection.expressions) {
        const expressions = detection.expressions;
        // Find the emotion with the highest probability
        let dominantEmotion = 'neutral';
        let maxProbability = 0;
        for (const emotion in expressions) {
          if (expressions[emotion] > maxProbability) {
            maxProbability = expressions[emotion];
            dominantEmotion = emotion;
          }
        }
        setMood(dominantEmotion);
      } else {
        // If no face is detected, you might want to set a default mood or do nothing
        console.log("No face detected.");
        setMood('neutral'); // Or keep the previous mood, or set to 'no face'
      }
    }
  };

  // --- Main Process Flow ---
  const fetchWeatherAndSuggestions = async () => {
    console.log('Starting fetchWeatherAndSuggestions...');
    // Don't set main loading false here yet
    // setLoading(true); // Already set true in initApp
    setSuggestionLoading(true); // Start suggestion loading indicator
    setSuggestionError(''); // Clear previous suggestion errors
    setSuggestion(''); // Clear previous suggestions

    try {
      const weatherData = await fetchWeather();
      setCity(weatherData.city);
      setTemp(weatherData.temperature);
      setWeather(weatherData.weather);

      // Use the detected mood here
      const currentMood = mood;
      console.log("Current Mood:", currentMood);

      // Now fetch suggestions using the mood and weather
      const movieList = await getHuggingFaceMoviesSuggestion(currentMood, weatherData.weather);
      setSuggestion(movieList); // Set the suggestions from HF API
      console.log('Weather and suggestions processed successfully.');

    } catch (errMsg) {
      console.error("Error during fetchWeatherAndSuggestions:", errMsg);
      // Distinguish between weather/geo errors and suggestion errors
      if (errMsg.message.includes("Movie suggestion") || errMsg.message.includes("fetch suggestions") || errMsg.message.includes("suggestions configured")) {
        setSuggestionError(String(errMsg)); // Show suggestion-specific error
      } else {
        setError(String(errMsg)); // Show general error (likely weather/geo/camera)
      }
    } finally {
      // Runs after try/catch, regardless of success or failure
      console.log('Executing finally block in fetchWeatherAndSuggestions...');
      setLoading(false); // Stop main loading indicator (camera/weather done)
      setSuggestionLoading(false); // Stop suggestion loading indicator
      stopCamera(); // Stop the camera AFTER everything is attempted
      if (faceDetectionInterval.current) {
        clearInterval(faceDetectionInterval.current); // Clear the mood detection interval
      }
    }
  };

  // --- Razorpay Function (no changes needed) ---
  const openRazorpay = () => {
    const razorpayKey = import.meta.env.VITE_RAZORPAY_KEY_ID;
    if (!razorpayKey) {
      console.error("Razorpay Key ID is not configured in environment variables (VITE_RAZORPAY_KEY_ID).");
      setPaymentStatus('⚠️ Payment gateway configuration error.');
      return;
    }

    const options = {
      key: razorpayKey,
      amount: 49900, // 499 INR
      currency: 'INR',
      name: 'Weather Genie AI',
      description: 'Support this magical project!',
      image: '/logo.png', // Ensure this logo exists in your public folder or use a full URL
      handler: function (response) {
        console.log("Razorpay payment successful:", response);
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

    if (window.Razorpay) {
      try {
        const rzp = new window.Razorpay(options);
        rzp.open();
        rzp.on('payment.failed', function (response) {
          console.error("Razorpay payment failed:", response.error);
          setPaymentStatus(`❌ Payment failed: ${response.error.description} (Code: ${response.error.code})`);
        });
      } catch (error) {
        console.error("Error initializing Razorpay:", error);
        setPaymentStatus('⚠️ Could not initiate payment.');
      }
    } else {
      console.error("Razorpay script not loaded.");
      setPaymentStatus('⚠️ Payment gateway is unavailable. Ensure the Razorpay script is included in your HTML.');
    }
  };

  // --- Main useEffect ---
  useEffect(() => {
    let isMounted = true;
    let modelsLoaded = false;

    const initApp = async () => {
      setLoading(true); // Start main loading
      setError('');
      setPaymentStatus('');
      setSuggestion('');
      setSuggestionError('');
      setSuggestionLoading(false); // Ensure suggestion loading is false initially
      setMood('neutral'); // Initialize mood

      try {
        console.log("Requesting camera access...");
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'user', width: { ideal: 320 }, height: { ideal: 240 } }
        });

        if (!isMounted) {
          console.log("Component unmounted before camera stream could be used.");
          stream.getTracks().forEach(track => track.stop());
          return;
        }

        console.log("Camera access granted.");
        streamRef.current = stream;

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
          console.log("Video playback started.");
        }

        // Load face API models
        modelsLoaded = await loadModels();

        if (modelsLoaded) {
          // Start mood detection interval
          faceDetectionInterval.current = setInterval(detectMood, 1000); // Detect mood every 1 second
        }

        // Call the combined function after initial setup (weather and initial suggestion)
        await fetchWeatherAndSuggestions();

      } catch (err) {
        console.error("Initialization error:", err);
        if (isMounted) {
          // Handle specific errors
          if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
            setError('🚫 Camera access denied by user.');
          } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError'){
            setError('🚫 No camera found on this device.');
          } else {
            // Avoid overwriting suggestion-specific errors if possible
            if (!suggestionError) {
              setError(`🚫 Initialization failed: ${err.message || 'Unknown error'}`);
            }
          }
          setLoading(false); // Ensure main loading stops on error
          setSuggestionLoading(false); // Ensure suggestion loading stops on error
          stopCamera(); // Attempt cleanup
          if (faceDetectionInterval.current) {
            clearInterval(faceDetectionInterval.current); // Clear the mood detection interval on error
          }
        }
      }
    };

    initApp();

    return () => {
      isMounted = false;
      console.log('Component unmounting, ensuring camera is stopped.');
      stopCamera();
      if (faceDetectionInterval.current) {
        clearInterval(faceDetectionInterval.current); // Clear the interval on unmount
      }
    };
  }, []);


  // --- Render logic ---
  return (
    <div className="app" style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h1>🌦️ Weather Genie AI 🧞</h1>

       {/* Main Loading Indicator (Camera/Weather) */}
{loading && !error && (
  <div style={{ 
    textAlign: 'center', 
    margin: '40px 0', 
    position: 'relative', 
    overflow: 'hidden',
    background: 'linear-gradient(135deg, #0077ff22, #ffffff)', // Subtle gradient bg
    borderRadius: '15px',
    padding: '20px',
    boxShadow: '0 0 20px rgba(0, 119, 255, 0.3)',
  }}>
    {/* Animated Header */}
    <p style={{ 
      fontSize: '1.5rem', 
      fontWeight: 'bold', 
      color: '#0077ff', 
      textShadow: '0 0 10px rgba(0, 119, 255, 0.8)',
      animation: 'pulseGlow 2s infinite',
      marginBottom: '20px',
    }}>
      <span role="img" aria-label="wave">🧞‍♂️</span> Genie Awakening...
    </p>

    {/* Video with Magical Effects */}
    <div style={{ position: 'relative', width: '320px', height: '240px', margin: '0 auto' }}>
      <video
        ref={videoRef}
        style={{
          display: 'block',
          width: '100%',
          height: '100%',
          borderRadius: '15px',
          border: 'none',
          objectFit: 'cover',
          transform: 'scale(1)',
          transition: 'transform 0.4s ease-in-out, filter 0.3s',
          filter: 'brightness(1.1) contrast(1.1)',
        }}
        onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.08)'}
        onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
        autoPlay
        muted
        playsInline
      />
      
      {/* Animated Scanner Effect */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        borderRadius: '15px',
        background: 'linear-gradient(to bottom, transparent 0%, rgba(0, 119, 255, 0.2) 50%, transparent 100%)',
        animation: 'scanEffect 3s infinite linear',
        pointerEvents: 'none',
      }} />

      {/* Floating Particles */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
      }}>
        {[...Array(10)].map((_, i) => (
          <span
            key={i}
            style={{
              position: 'absolute',
              width: '4px',
              height: '4px',
              background: '#0077ff',
              borderRadius: '50%',
              boxShadow: '0 0 8px #0077ff',
              animation: `floatParticle ${2 + Math.random() * 2}s infinite ease-in-out`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </div>
    </div>

    {/* Mood Analysis HUD */}
    <div style={{
      position: 'absolute',
      bottom: '20px',
      left: '50%',
      transform: 'translateX(-50%)',
      background: 'rgba(0, 0, 0, 0.7)',
      color: '#00ffcc',
      padding: '8px 20px',
      borderRadius: '20px',
      fontSize: '1.2rem',
      fontFamily: 'monospace',
      fontWeight: 'bold',
      textTransform: 'uppercase',
      letterSpacing: '2px',
      animation: 'hudBlink 1.5s infinite alternate',
      boxShadow: '0 0 15px rgba(0, 255, 204, 0.5)',
    }}>
      <span role="img" aria-label="brain">🧠</span> Scanning Mood Matrix...
    </div>
  </div>
)}

{/* Enhanced CSS Animations */}
<style>{`
  .app { max-width: 600px; margin: auto; }

  @keyframes pulseGlow {
    0% { opacity: 0.7; text-shadow: 0 0 5px rgba(0, 119, 255, 0.5); }
    50% { opacity: 1; text-shadow: 0 0 15px rgba(0, 119, 255, 1); }
    100% { opacity: 0.7; text-shadow: 0 0 5px rgba(0, 119, 255, 0.5); }
  }

  @keyframes scanEffect {
    0% { transform: translateY(-100%); }
    100% { transform: translateY(100%); }
  }

  @keyframes floatParticle {
    0% { transform: translateY(0) scale(1); opacity: 0.8; }
    50% { transform: translateY(-20px) scale(1.2); opacity: 1; }
    100% { transform: translateY(0) scale(1); opacity: 0.8; }
  }

  @keyframes hudBlink {
    0% { opacity: 0.6; box-shadow: 0 0 10px rgba(0, 255, 204, 0.3); }
    100% { opacity: 1; box-shadow: 0 0 20px rgba(0, 255, 204, 0.8); }
  }
`}</style>

      {/* Main Error Display */}
      {error && <p style={{ color: 'red', fontWeight: 'bold', marginTop: '20px' }}>{error}</p>}

      {/* Results Display */}
      {!loading && !error && (
        <div style={{ marginTop: '20px', lineHeight: '1.6' }}>
          {/* Display weather/mood info once available */}
          {city && weather && temp && mood && (
            <>
              <p>📍 Weather: <strong>{weather}</strong> in <strong>{city}</strong>, <strong>{temp}°C</strong></p>
              <p><span role="img" aria-label="mood-emoji">😊</span> Mood Detected: <strong>{mood}</strong></p>
            </>
          )}

          {/* Suggestion Section */}
          <div style={{marginTop: '15px'}}>
            <p>🎬 Movie Suggestions:</p>
            {suggestionLoading && <p><i>🧞 Asking the Genie for movie ideas...</i></p>}
            {suggestionError && <p style={{ color: 'orange' }}>⚠️ {suggestionError}</p>}
            {!suggestionLoading && !suggestionError && suggestion && (
              <pre style={{ whiteSpace: 'pre-wrap', background: '#f4f4f4', padding: '10px', borderRadius: '5px', fontFamily:'monospace' }}>
                {suggestion}
              </pre>
            )}
            {!suggestionLoading && !suggestionError && !suggestion && <p><i>No suggestions available right now.</i></p>}
          </div>

        </div>
      )}


      {/* Hidden video and canvas elements */}
      {/* Video element is shown during loading now */}
      <canvas ref={canvasRef} style={{ display: 'none' }} />


      <hr style={{ margin: '30px 0' }} />

      {/* Support Button & Status */}
      {!loading && (
        <>
          <button onClick={openRazorpay} disabled={loading || suggestionLoading} style={{ padding: '12px 25px', fontSize: '16px', cursor: 'pointer', background: '#28a745', color: 'white', border: 'none', borderRadius: '5px', opacity: (loading || suggestionLoading) ? 0.6 : 1 }}>
            <span role="img" aria-label="money">💸</span> Support Weather Genie (₹499)
          </button>
          {paymentStatus && <p style={{ marginTop: '15px', fontWeight: 'bold', color: paymentStatus.startsWith('✅') ? 'green' : 'red' }}>{paymentStatus}</p>}
        </>
      )}


      {/* CSS for Pulse Animation */}
      <style>{`
        .app { max-width: 600px; margin: auto; }
        @keyframes pulse {
          0% { opacity: 0.6; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.03); }
          100% { opacity: 0.6; transform: scale(1); }
        }
      `}</style>
    </div>
  );
}