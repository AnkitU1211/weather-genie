import React, { useState } from "react";
import Maintenance from './components/Maintenance';

const App = () => {
  const isUnderMaintenance = false;

  if (isUnderMaintenance) {
    return <Maintenance />;
  }

  const [isGenieActive, setIsGenieActive] = useState(false);

  const handleSummonGenie = () => {
    setIsGenieActive(!isGenieActive);
  };

  return (
    <div className="wrapper">
      <header className="header">
        <h1 className="logo">
          <span className="logoAnimation">🌦️</span> Weather Genie
        </h1>
        <p className="tagline">
          Your AI-powered mood-based movie assistant{" "}
          <span className="flicker">🎥</span>
        </p>
      </header>

      <main className="content">
        <section className={isGenieActive ? "card cardActive" : "card"}>
          <h2 className="sectionTitle">
            {isGenieActive
              ? "Genie is Thinking... ✨"
              : "How are you feeling today?"}
          </h2>
          <p className="description">
            {isGenieActive
              ? "Analyzing your mood and the skies for the perfect movie..."
              : "Based on your mood and weather, Genie will recommend the perfect movie. 🌈"}
          </p>
          <button
            className={isGenieActive ? "magicButton magicButtonActive" : "magicButton"}
            onClick={handleSummonGenie}
            onMouseEnter={(e) =>
              (e.target.style.boxShadow = "0 0 20px rgba(0, 255, 255, 0.8)")
            }
            onMouseLeave={(e) => (e.target.style.boxShadow = "none")}
          >
            {isGenieActive ? "Release the Genie 🌀" : "Summon the Genie 🧞‍♂️"}
          </button>
          {isGenieActive && (
            <div className="genieEffect">
              <span className="sparkle">✨</span>
              <span className="sparkle">🌟</span>
              <span className="sparkle">⚡️</span>
            </div>
          )}
        </section>
      </main>

      <footer className="footer">
        <p>
          © 2025 Weather Genie · Crafted with{" "}
          <span className="footerPulse">☁️ + 🎬</span>
        </p>
      </footer>
    </div>
  );
};

const styles = {
  // Minimal inline styles, mostly for dynamic properties
  magicButton: {
    border: "none",
    cursor: "pointer",
    fontWeight: "bold",
    position: "relative",
    overflow: "hidden",
  },
  magicButtonActive: {
    border: "none",
    cursor: "pointer",
    fontWeight: "bold",
    position: "relative",
    overflow: "hidden",
  },
};

const styleSheet = document.createElement("style");
styleSheet.textContent = `
  *, *:before, *:after {
    box-sizing: border-box;
  }
  html, body {
    margin: 0;
    padding: 0;
    height: 100%;
    width: 100%;
    overflow: hidden;
  }
  #root {
    height: 100%;
    width: 100%;
  }
  :root {
    --vh: 1vh;
  }
  @media (max-width: 768px) {
    :root {
      --vh: calc(100vh - env(safe-area-inset-top) - env(safe-area-inset-bottom));
    }
  }

  .wrapper {
    background: linear-gradient(135deg, #1f1c2c 0%, #928dab 50%, #00c9ff 100%);
    color: #fff;
    height: calc(var(--vh, 1vh) * 100);
    width: 100vw;
    display: flex;
    flex-direction: column;
    font-family: 'Poppins', sans-serif;
    overflow: hidden;
    position: relative;
    margin: 0;
    padding: 0;
  }

  .header {
    text-align: center;
    padding: 1.5rem 0.5rem 1rem;
    background: rgba(255, 255, 255, 0.05);
    backdrop-filter: blur(10px);
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    z-index: 1;
  }
  @media (min-width: 768px) {
    .header {
      padding: 3rem 1rem 1.5rem;
    }
  }

  .logo {
    font-size: 2rem;
    font-weight: 800;
    margin-bottom: 0.5rem;
    text-shadow: 0 0 15px rgba(0, 255, 255, 0.7);
  }
  @media (min-width: 768px) {
    .logo {
      font-size: 3.5rem;
    }
  }

  .logoAnimation {
    display: inline-block;
    animation: spin 4s infinite linear;
  }

  .tagline {
    font-size: 1rem;
    opacity: 0.85;
    letter-spacing: 1px;
  }
  @media (min-width: 768px) {
    .tagline {
      font-size: 1.3rem;
    }
  }

  .flicker {
    animation: flicker 2s infinite;
  }

  .content {
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 1rem;
    position: relative;
    width: 100%;
  }
  @media (min-width: 768px) {
    .content {
      padding: 2rem;
    }
  }

  .card {
    background: rgba(255, 255, 255, 0.08);
    padding: 1.5rem;
    border-radius: 1rem;
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.3);
    border: 1px solid rgba(255, 255, 255, 0.2);
    text-align: center;
    width: 100%;
    max-width: 90%;
    max-height: 70vh;
    overflow: auto;
    transition: all 0.5s ease;
  }
  @media (min-width: 768px) {
    .card {
      padding: 2.5rem;
      border-radius: 1.5rem;
      max-width: 550px;
      max-height: 80vh;
    }
  }

  .cardActive {
    background: rgba(255, 255, 255, 0.15);
    box-shadow: 0 8px 40px rgba(0, 255, 255, 0.5);
    border: 1px solid rgba(0, 255, 255, 0.4);
    transform: scale(1.05);
  }

  .sectionTitle {
    font-size: 1.5rem;
    margin-bottom: 1rem;
    font-weight: 600;
    text-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
  }
  @media (min-width: 768px) {
    .sectionTitle {
      font-size: 2rem;
      margin-bottom: 1.2rem;
    }
  }

  .description {
    font-size: 0.9rem;
    margin-bottom: 1.5rem;
    line-height: 1.6;
  }
  @media (min-width: 768px) {
    .description {
      font-size: 1.1rem;
      margin-bottom: 2rem;
    }
  }

  .magicButton {
    padding: 0.75rem 1.5rem;
    font-size: 1rem;
    border-radius: 50px;
    background: linear-gradient(45deg, #00c9ff 0%, #92fe9d 100%);
    color: #1f1c2c;
    transition: all 0.4s ease;
  }
  @media (min-width: 768px) {
    .magicButton {
      padding: 1rem 2.5rem;
      font-size: 1.1rem;
    }
  }

  .magicButtonActive {
    background: linear-gradient(45deg, #ff6b6b 0%, #ffa07a 100%);
    color: #fff;
  }

  .genieEffect {
    position: absolute;
    top: -20px;
    left: 50%;
    transform: translateX(-50%);
    pointer-events: none;
  }

  .sparkle {
    font-size: 1.2rem;
    margin: 0 5px;
    animation: sparkle 1s infinite;
  }
  @media (min-width: 768px) {
    .sparkle {
      font-size: 1.5rem;
      margin: 0 10px;
    }
  }

  .footer {
    text-align: center;
    padding: 1rem;
    font-size: 0.9rem;
    background: rgba(0, 0, 0, 0.25);
    backdrop-filter: blur(5px);
  }
  @media (min-width: 768px) {
    .footer {
      padding: 1.5rem;
      font-size: 1rem;
    }
  }

  .footerPulse {
    animation: pulse 2s infinite;
  }

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
`;
document.head.appendChild(styleSheet);

export default App;