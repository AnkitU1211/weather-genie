// src/App.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from './HomePage'; // Your original app logic moved here
import LegalSupport from './components/LegalSupport'; // This is new component for legal info

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/legal-support" element={<LegalSupport />} />
    </Routes>
  );
};

export default App;
