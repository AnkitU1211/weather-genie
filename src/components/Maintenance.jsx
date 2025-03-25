import React from 'react';

export default function Maintenance() {
  return (
    <div style={{
      height: '100vh',
      backgroundColor: '#0f172a',
      color: '#f1f5f9',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'sans-serif',
      padding: '20px',
      textAlign: 'center'
    }}>
      <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🛠️ Under Maintenance</h1>
      <p style={{ fontSize: '1.2rem', maxWidth: '500px' }}>
        Weather Genie is currently being upgraded with fresh magic.
        We'll be back very soon — stay tuned! 🌈
      </p>
      <div className="loader" style={{
        marginTop: '30px',
        width: '50px',
        height: '50px',
        border: '6px solid #f1f5f9',
        borderTop: '6px solid #38bdf8',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite'
      }}></div>
      <style>
        {`@keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }`}
      </style>
    </div>
  );
}
