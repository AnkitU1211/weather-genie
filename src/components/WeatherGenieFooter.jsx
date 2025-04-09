import React from 'react';
import { useNavigate } from 'react-router-dom';

const WeatherGenieFooter = () => {
  const navigate = useNavigate();

  const openLegalSupportPage = () => {
    navigate('/legal-support');
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '60px' }}>
      <button
        onClick={openLegalSupportPage}
        style={{
          padding: '16px 40px',
          fontSize: '18px',
          fontWeight: '700',
          border: 'none',
          borderRadius: '15px',
          background: 'linear-gradient(90deg, #00c6ff, #0072ff)',
          color: '#fff',
          boxShadow: '0 8px 25px rgba(0, 114, 255, 0.5)',
          cursor: 'pointer',
          transition: 'transform 0.3s ease, box-shadow 0.3s ease',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'scale(1.05)';
          e.currentTarget.style.boxShadow = '0 10px 30px rgba(0, 114, 255, 0.6)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'scale(1)';
          e.currentTarget.style.boxShadow = '0 8px 25px rgba(0, 114, 255, 0.5)';
        }}
      >
        📘 Legal & Support Page
      </button>

      <p style={{ marginTop: '12px', fontSize: '14px', color: '#bbb' }}>
        Explore our terms, privacy & contact info
      </p>
    </div>
  );
};

export default WeatherGenieFooter;
