import React from 'react';

export default function Maintenance() {
  return (
    <div style={{
      height: '100vh',
      width: '100vw',
      background: 'radial-gradient(ellipse at center, #0f172a 0%, #020617 100%)',
      overflow: 'hidden',
      color: '#e0f2fe',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: "'Orbitron', sans-serif",
      padding: '20px',
      textAlign: 'center',
      position: 'relative'
    }}>
      {/* Twinkling stars background */}
      <div className="stars" />
      
      <h1 style={{ fontSize: '3rem', marginBottom: '1rem', zIndex: 2 }}>
        🧞‍♂️ Weather Genie at Work!
      </h1>
      <p style={{ fontSize: '1.2rem', maxWidth: '600px', zIndex: 2 }}>
        We're conjuring up a better experience with stardust and code.
        The Genie will return shortly with improved magic! ✨
      </p>

      {/* Genie Loader */}
      <div className="genie-loader" />

      {/* Custom styles */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@500&display=swap');

        .stars {
          position: absolute;
          width: 100%;
          height: 100%;
          background: transparent url('https://www.transparenttextures.com/patterns/stardust.png') repeat;
          animation: twinkle 20s linear infinite;
          z-index: 1;
          opacity: 0.2;
        }

        @keyframes twinkle {
          from { background-position: 0 0; }
          to { background-position: -10000px 5000px; }
        }

        .genie-loader {
          margin-top: 40px;
          width: 80px;
          height: 80px;
          border: 6px solid rgba(255, 255, 255, 0.1);
          border-top: 6px solid #38bdf8;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          box-shadow: 0 0 30px #38bdf8;
          position: relative;
          z-index: 2;
        }

        .genie-loader::before {
          content: '🔮';
          position: absolute;
          font-size: 2rem;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%) scale(1.1);
          animation: pulse 2s ease-in-out infinite;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @keyframes pulse {
          0%, 100% { transform: translate(-50%, -50%) scale(1.1); opacity: 1; }
          50% { transform: translate(-50%, -50%) scale(0.95); opacity: 0.6; }
        }
      `}</style>
    </div>
  );
}
