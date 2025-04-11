import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaBalanceScale,
  FaShieldAlt,
  FaUndoAlt,
  FaHeadset,
  FaChevronDown,
  FaBookOpen,
  FaPhone,
  FaEnvelope,
  FaBuilding
} from 'react-icons/fa';

const sections = [
  {
    id: 'terms',
    title: 'Terms & Conditions',
    icon: <FaBalanceScale />, 
    content: `By using Weather Genie AI, you agree to our fair-use policies: use responsibly, don't scrape suggestions, and understand that the product is provided “as-is” for personal guidance and discovery.`,
  },
  {
    id: 'privacy',
    title: 'Privacy Policy',
    icon: <FaShieldAlt />, 
    content: `We value your privacy. We don't store your face, expressions, or any camera data. All mood detection is processed locally within your browser—no data is transmitted to our servers.`,
  },
  {
    id: 'refund',
    title: 'Refund & Cancellation Policy',
    icon: <FaUndoAlt />, 
    content: `Unsatisfied? Request a full refund within <strong>7 days</strong> of purchase. Refunds typically processed within <strong>5 business days</strong>. Contact support with your payment details.`,
  },
  {
    id: 'contact',
    title: 'Contact Information',
    icon: <FaHeadset />, 
    content: [
      { type: 'text', value: 'For help, inquiries, or feedback, contact us:' },
      { type: 'email', value: 'Email support temporarily unavailable', status: 'unavailable' },
      { type: 'phone', value: '+91-98188-36297' },
      { type: 'address', value: 'Weather Genie AI Labs (Office setup in progress)' }
    ]
  },
];

const LegalSupport = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleAccordion = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div style={{
      minHeight: '100vh',
      width: '100%',
      padding: '40px 15px',
      background: 'linear-gradient(135deg, #f0f4f9, #cfd9df)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      fontFamily: "'Poppins', sans-serif",
      boxSizing: 'border-box',
    }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        style={{
          flex: '1',
          maxWidth: '1200px',
          padding: '30px',
          backgroundColor: '#fff',
          boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
          borderRadius: '10px',
          boxSizing: 'border-box',
        }}
      >
        <h1 style={{
          fontSize: '2rem',
          marginBottom: '25px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          color: '#333',
          textAlign: 'center'
        }}>
          <FaBookOpen /> Legal & Support Information
        </h1>

        {sections.map((section, index) => (
          <motion.div key={section.id} style={{ marginBottom: '12px', borderRadius: '8px', overflow: 'hidden', border: '1px solid #ddd' }}>
            <button
              onClick={() => toggleAccordion(index)}
              style={{
                width: '100%',
                padding: '15px 20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                fontSize: '1rem',
                fontWeight: '600',
                background: openIndex === index ? '#e6eef7' : '#fff',
                border: 'none',
                cursor: 'pointer',
              }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#0056b3' }}>{section.icon} {section.title}</span>
              <FaChevronDown style={{ transform: openIndex === index ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.3s ease' }} />
            </button>

            <AnimatePresence>
              {openIndex === index && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  style={{ padding: '10px 20px', background: '#fafcff' }}
                >
                  {typeof section.content === 'string' ? (
                    <div dangerouslySetInnerHTML={{ __html: section.content }} style={{ color: '#555', lineHeight: '1.6' }} />
                  ) : (
                    section.content.map((item, idx) => (
                      <p key={idx} style={{ color: item.status === 'unavailable' ? '#aaa' : '#333', margin: '8px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        {item.type === 'phone' && <FaPhone />} {item.type === 'email' && <FaEnvelope />} {item.type === 'address' && <FaBuilding />}
                        {item.value}
                      </p>
                    ))
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default LegalSupport;
