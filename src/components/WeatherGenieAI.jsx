import React, { useEffect, useState } from 'react';

const usedMovies = new Set();

export default function WeatherGenieAI() {
  const [weather, setWeather] = useState('Fetching...'); // Initial state
  const [mood, setMood] = useState('');
  const [suggestion, setSuggestion] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchWeather = async () => {
      console.log("Starting weather fetch...");

      // Check if geolocation is supported
      if (!navigator.geolocation) {
        console.log("Geolocation not supported by browser.");
        setWeather(getRandomWeather());
        return;
      }

      // Get location
      navigator.geolocation.getCurrentPosition(
        async ({ coords }) => {
          console.log("Location fetched:", coords.latitude, coords.longitude);

          const apiKey = import.meta.env.VITE_OPENWEATHER_API_KEY;
          if (!apiKey) {
            console.log("OpenWeather API key missing!");
            setWeather(getRandomWeather());
            return;
          }

          try {
            const res = await fetch(
              `https://api.openweathermap.org/data/2.5/weather?lat=${coords.latitude}&lon=${coords.longitude}&appid=${apiKey}&units=metric`
            );
            console.log("API response status:", res.status);

            if (!res.ok) {
              console.log("API failed:", res.status, res.statusText);
              setWeather(getRandomWeather());
              return;
            }

            const data = await res.json();
            const weatherCondition = data.weather[0]?.main || getRandomWeather();
            console.log("Weather set to:", weatherCondition);
            setWeather(weatherCondition);
          } catch (err) {
            console.log("Fetch error:", err.message);
            setWeather(getRandomWeather());
          }
        },
        (err) => {
          console.log("Geolocation failed:", err.message);
          setWeather(getRandomWeather());
        },
        { timeout: 5000, enableHighAccuracy: true } // High accuracy for better results
      );
    };

    fetchWeather();
  }, []);

  const getRandomWeather = () => {
    const weatherOptions = ['Sunny', 'Rainy', 'Cloudy', 'Snowy', 'Windy'];
    const randomWeather = weatherOptions[Math.floor(Math.random() * weatherOptions.length)];
    console.log("Random weather generated:", randomWeather);
    return randomWeather;
  };

  const fallbackMovies = [
    "The Pursuit of Happyness (2006) - Drama - A struggling salesman finds hope against all odds.",
    "Forrest Gump (1994) - Comedy/Drama - A simple man lives an extraordinary life.",
    "La La Land (2016) - Musical/Romance - Two dreamers find love in sunny LA.",
    "The Shawshank Redemption (1994) - Drama - A man finds hope in prison through friendship.",
    "Inception (2010) - Sci-Fi/Thriller - A thief enters dreams to steal secrets.",
    "The Dark Knight (2008) - Action/Thriller - Batman faces his greatest foe in Gotham.",
    "Amélie (2001) - Romance/Comedy - A quirky woman spreads joy in Paris.",
    "Up (2009) - Animation/Adventure - An old man fulfills his dream with balloons.",
    "The Lion King (1994) - Animation/Drama - A young lion reclaims his kingdom.",
    "Deadpool (2016) - Action/Comedy - A wisecracking mercenary seeks revenge.",
  ];

  const fetchMovie = async () => {
    const apiKey = import.meta.env.VITE_HF_API_KEY;
    const prompt = `
      Provide exactly 3 unique, highly-rated movie recommendations for someone feeling "${mood}" during "${weather}" weather (request time: ${Date.now()}).
      Format each as: "Title (Year) - Genre - One-line summary."
      Use only real, existing movies. Do not repeat these: ${Array.from(usedMovies).join(', ')}.
    `.trim();

    let movieLines = [];

    if (apiKey) {
      try {
        const res = await fetch("https://api-inference.huggingface.co/models/tiiuae/falcon-7b-instruct", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            inputs: prompt,
            parameters: {
              temperature: 1.2,
              top_k: 60,
              top_p: 0.9,
              max_new_tokens: 250,
            },
          }),
          signal: AbortSignal.timeout(10000),
        });

        const data = await res.json();
        if (data && data[0]?.generated_text) {
          const response = data[0].generated_text.replace(prompt, '').trim();
          movieLines = response.split('\n')
            .map(line => line.trim())
            .filter(line => line.match(/^.+\(\d{4}\)\s*-\s*.+\s*-\s*.+$/));
        }
      } catch (err) {
        console.log("Movie API failed:", err);
      }
    }

    const uniqueMovies = [];
    const seenTitles = new Set(usedMovies);

    for (const movie of movieLines) {
      const titleMatch = movie.match(/^(.+?)\s*\(\d{4}\)/)?.[1].trim();
      if (titleMatch && !seenTitles.has(titleMatch)) {
        seenTitles.add(titleMatch);
        usedMovies.add(titleMatch);
        uniqueMovies.push(movie);
      }
      if (uniqueMovies.length === 3) break;
    }

    if (uniqueMovies.length < 3) {
      const availableFallbacks = fallbackMovies.filter(movie => {
        const titleMatch = movie.match(/^(.+?)\s*\(\d{4}\)/)?.[1].trim();
        return titleMatch && !seenTitles.has(titleMatch);
      });
      while (uniqueMovies.length < 3 && availableFallbacks.length > 0) {
        const movie = availableFallbacks.shift();
        const titleMatch = movie.match(/^(.+?)\s*\(\d{4}\)/)?.[1].trim();
        seenTitles.add(titleMatch);
        usedMovies.add(titleMatch);
        uniqueMovies.push(movie);
      }
    }

    if (uniqueMovies.length < 3) {
      usedMovies.clear();
      const remaining = fallbackMovies.slice(0, 3 - uniqueMovies.length);
      remaining.forEach(movie => {
        const titleMatch = movie.match(/^(.+?)\s*\(\d{4}\)/)?.[1].trim();
        usedMovies.add(titleMatch);
      });
      uniqueMovies.push(...remaining);
    }

    return uniqueMovies.join('\n');
  };

  const handleAsk = async () => {
    if (!mood || !weather) {
      setSuggestion(fallbackMovies.slice(0, 3).join('\n'));
      return;
    }
    setLoading(true);
    setSuggestion('');
    const reply = await fetchMovie();
    setSuggestion(reply);
    setLoading(false);
  };

  return (
    <div style={{ marginTop: '2rem', textAlign: 'center', color: '#e2e8f0' }}>
      <p style={{ fontSize: '1.2rem' }}>
        🌤️ <strong>Weather:</strong> {weather}
      </p>

      <div style={{ marginTop: '1rem' }}>
        {['happy', 'sad', 'romantic'].map((m) => (
          <button
            key={m}
            onClick={() => setMood(m)}
            style={{
              margin: '0.5rem',
              padding: '12px 24px',
              backgroundColor: mood === m ? '#3b82f6' : '#1f2937',
              color: '#fff',
              border: '2px solid #0ea5e9',
              borderRadius: '12px',
              cursor: 'pointer',
              fontWeight: 'bold',
              transition: 'transform 0.2s',
            }}
            onMouseEnter={(e) => (e.target.style.transform = 'scale(1.1)')}
            onMouseLeave={(e) => (e.target.style.transform = 'scale(1)')}
          >
            {m.toUpperCase()}
          </button>
        ))}
      </div>

      <button
        onClick={handleAsk}
        disabled={loading}
        style={{
          marginTop: '2rem',
          padding: '12px 30px',
          background: loading ? '#6b7280' : 'linear-gradient(45deg, #14b8a6, #06b6d4)',
          color: '#fff',
          border: 'none',
          borderRadius: '999px',
          fontSize: '1rem',
          cursor: loading ? 'not-allowed' : 'pointer',
          boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
        }}
      >
        {loading ? '🧞 Summoning...' : '🔮 Ask the Genie'}
      </button>

      {loading && <p style={{ marginTop: '1.5rem' }}>🧞 Thinking...</p>}

      {suggestion && (
        <div
          style={{
            marginTop: '2rem',
            padding: '1.5rem',
            backgroundColor: '#0f172a',
            borderRadius: '1rem',
            border: '1px solid #38bdf8',
            maxWidth: '600px',
            width: '90%',
            margin: '2rem auto',
            whiteSpace: 'pre-wrap',
            boxShadow: '0 8px 20px rgba(0, 0, 0, 0.25)',
          }}
        >
          <p style={{ fontSize: '1.1rem', lineHeight: '1.6' }}>{suggestion}</p>
        </div>
      )}
    </div>
  );
}