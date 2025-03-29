import React, { useState, useEffect } from "react";
import Maintenance from './components/Maintenance';
import WeatherGenieAI from './components/WeatherGenieAI';
import VoiceUnlockGenie from './components/VoiceUnlockGenie';

const App = () => {
  const isUnderMaintenance = false;
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [isGenieActive, setIsGenieActive] = useState(false);
  
  useEffect(() => {
    const setVH = () => {
      let vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    };
    setVH();
    window.addEventListener('resize', setVH);
    return () => window.removeEventListener('resize', setVH);
  }, []);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  const handleRazorpayPayment = () => {
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: 49900,
      currency: 'INR',
      name: 'Weather Genie',
      description: 'Support the Genie!',
      handler: function (response) {
        alert('Payment successful! Payment ID: ' + response.razorpay_payment_id);
      },
      prefill: {
        name: 'Weather Genie User',
        email: 'user@example.com',
        contact: '9999999999'
      },
      theme: {
        color: '#6366f1'
      }
    };
    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  if (isUnderMaintenance) {
    return <Maintenance />;
  }

  if (!isUnlocked) {
    return <VoiceUnlockGenie onUnlock={() => setIsUnlocked(true)} />;
  }


  const handleSummonGenie = () => {
    setIsGenieActive(!isGenieActive);
  };

  return (
    <div style={styles.wrapper}>
      <header style={styles.header}>
        <h1 style={styles.logo}>
          <span style={styles.logoAnimation}>🌦️</span> Weather Genie
        </h1>
        <p style={styles.tagline}>
          Your AI-powered mood-based movie assistant <span style={styles.flicker}>🎥</span>
        </p>
      </header>

      <main style={styles.content}>
        <section style={isGenieActive ? styles.cardActive : styles.card}>
          <h2 style={styles.sectionTitle}>
            {isGenieActive ? "Genie is Thinking... ✨" : "How are you feeling today?"}
          </h2>
          <p style={styles.description}>
            {isGenieActive
              ? "Analyzing your mood and the skies for the perfect movie..."
              : "Based on your mood and weather, Genie will recommend the perfect movie. 🌈"}
          </p>
          <button
            style={isGenieActive ? styles.magicButtonActive : styles.magicButton}
            onClick={handleSummonGenie}
            onMouseEnter={(e) => (e.target.style.boxShadow = "0 0 20px rgba(0, 255, 255, 0.8)")}
            onMouseLeave={(e) => (e.target.style.boxShadow = "none")}
          >
            {isGenieActive ? "Release the Genie 🌀" : "Summon the Genie 🧞‍♂️"}
          </button>
          {isGenieActive && (
            <>
              <div style={styles.genieEffect}>
                <span style={styles.sparkle}>✨</span>
                <span style={styles.sparkle}>🌟</span>
                <span style={styles.sparkle}>⚡️</span>
              </div>
              <WeatherGenieAI onSupportClick={handleRazorpayPayment} />
            </>
          )}
        </section>
      </main>

      <footer style={styles.footer}>
        <p>
          © 2025 Weather Genie · Crafted with <span style={styles.footerPulse}>☁️ + 🎬</span>
        </p>
      </footer>
    </div>
  );
};

const styles = {
  wrapper: {
    background: "linear-gradient(135deg, #1f1c2c 0%, #928dab 50%, #00c9ff 100%)",
    color: "#fff",
    height: "auto",
    minHeight: "100vh",
    width: "100vw",
    display: "flex",
    flexDirection: "column",
    fontFamily: "'Poppins', sans-serif",
    position: "relative",
    margin: 0,
    padding: 0,
    overflowX: "hidden",
  },
  header: {
    textAlign: "center",
    padding: "3rem 1rem 1.5rem",
    background: "rgba(255, 255, 255, 0.05)",
    backdropFilter: "blur(10px)",
    borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
    zIndex: 1,
  },
  logo: {
    fontSize: "3.5rem",
    fontWeight: "800",
    marginBottom: "0.5rem",
    textShadow: "0 0 15px rgba(0, 255, 255, 0.7)",
  },
  logoAnimation: {
    display: "inline-block",
    animation: "spin 4s infinite linear",
  },
  tagline: {
    fontSize: "1.3rem",
    opacity: 0.85,
    letterSpacing: "1px",
  },
  flicker: {
    animation: "flicker 2s infinite",
  },
  content: {
    flex: 1,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "2rem",
    position: "relative",
  },
  card: {
    background: "rgba(255, 255, 255, 0.08)",
    padding: "2.5rem",
    borderRadius: "1.5rem",
    boxShadow: "0 8px 30px rgba(0, 0, 0, 0.3)",
    border: "1px solid rgba(255, 255, 255, 0.2)",
    textAlign: "center",
    maxWidth: "550px",
    width: "100%",
    transition: "all 0.5s ease",
  },
  cardActive: {
    background: "rgba(255, 255, 255, 0.15)",
    padding: "2.5rem",
    borderRadius: "1.5rem",
    boxShadow: "0 8px 40px rgba(0, 255, 255, 0.5)",
    border: "1px solid rgba(0, 255, 255, 0.4)",
    textAlign: "center",
    maxWidth: "550px",
    width: "100%",
    transform: "scale(1.05)",
    transition: "all 0.5s ease",
  },
  sectionTitle: {
    fontSize: "2rem",
    marginBottom: "1.2rem",
    fontWeight: "600",
    textShadow: "0 0 10px rgba(255, 255, 255, 0.5)",
  },
  description: {
    fontSize: "1.1rem",
    marginBottom: "2rem",
    lineHeight: "1.6",
  },
  magicButton: {
    padding: "1rem 2.5rem",
    fontSize: "1.1rem",
    borderRadius: "50px",
    border: "none",
    background: "linear-gradient(45deg, #00c9ff 0%, #92fe9d 100%)",
    color: "#1f1c2c",
    cursor: "pointer",
    fontWeight: "bold",
    transition: "all 0.4s ease",
    position: "relative",
    overflow: "hidden",
  },
  magicButtonActive: {
    padding: "1rem 2.5rem",
    fontSize: "1.1rem",
    borderRadius: "50px",
    border: "none",
    background: "linear-gradient(45deg, #ff6b6b 0%, #ffa07a 100%)",
    color: "#fff",
    cursor: "pointer",
    fontWeight: "bold",
    transition: "all 0.4s ease",
    position: "relative",
    overflow: "hidden",
  },
  genieEffect: {
    position: "absolute",
    top: "-20px",
    left: "50%",
    transform: "translateX(-50%)",
  },
  sparkle: {
    fontSize: "1.5rem",
    margin: "0 10px",
    animation: "sparkle 1s infinite",
  },
  footer: {
    textAlign: "center",
    padding: "1.5rem",
    fontSize: "1rem",
    background: "rgba(0, 0, 0, 0.25)",
    backdropFilter: "blur(5px)",
  },
  footerPulse: {
    animation: "pulse 2s infinite",
  },
};

const styleSheet = document.createElement("style");
styleSheet.textContent = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  @keyframes flicker {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
  }
  @keyframes sparkle {
    0% { transform: translateY(0) scale(1); opacity: 0; }
    50% { transform: translateY(-20px) scale(1.5); opacity: 1; }
    100% { transform: translateY(-40px) scale(1); opacity: 0; }
  }
  @keyframes pulse {
    0% { transform: scale(1); }
    50% { transform: scale(1.1); }
    100% { transform: scale(1); }
  }
  @media (max-width: 600px) {
    h1 {
      font-size: 2rem !important;
    }
    h2 {
      font-size: 1.5rem !important;
    }
    p, .description, .tagline, .footer {
      font-size: 1rem !important;
    }
    button {
      width: 90% !important;
      font-size: 1rem !important;
      padding: 0.8rem 1.5rem !important;
    }
    section {
      padding: 1.5rem !important;
    }
  }
`;
document.head.appendChild(styleSheet);

export default App;
