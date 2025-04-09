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

// --- Data Structure ---
const sections = [
  {
    id: 'terms',
    title: 'Terms & Conditions',
    icon: <FaBalanceScale />,
    content: `By using Weather Genie AI, you agree to our fair-use policies: use responsibly, don’t scrape suggestions, and understand that the product is provided “as-is” for personal guidance and discovery. Your usage constitutes acceptance of these terms. Please review them carefully.`,
  },
  {
    id: 'privacy',
    title: 'Privacy Policy',
    icon: <FaShieldAlt />,
    content: `We take privacy seriously. We don’t store your face, expressions, or any camera data. All mood detection processing occurs locally within your browser environment — no sensitive biometric data is transmitted to or stored on our servers. Your privacy is a priority.`,
  },
  {
    id: 'refund',
    title: 'Refund & Cancellation Policy',
    icon: <FaUndoAlt />,
    content: `Should you not be satisfied with our service, you are eligible to cancel your subscription and request a full refund within <strong>7 calendar days</strong> of your initial purchase. Refunds are typically processed within <strong>5 business days</strong> via the original payment method. To initiate a refund, please contact our support team with your transaction details.`,
  },
  {
    id: 'contact',
    title: 'Contact Information',
    icon: <FaHeadset />,
    content: [
        { type: 'text', value: 'For assistance, inquiries, or feedback, please reach out through the available channels:' },
        { type: 'email', value: 'Email support is temporarily unavailable. We apologize for the inconvenience.', status: 'unavailable' },
        { type: 'phone', value: '+91-98188-36297' },
        { type: 'address', value: 'Weather Genie AI Labs (Corporate office pending establishment)' }
    ]
  },
];

// --- Animation Variants ---
// Simpler variants for a more standard feel
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.5,
      staggerChildren: 0.1, // Slightly slower stagger
      when: "beforeChildren"
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 }, // Less movement
  visible: { opacity: 1, y: 0 }
};

const accordionContentVariants = {
  open: {
    height: 'auto',
    opacity: 1,
    marginTop: '0px', // Ensure margin is reset
    transition: { duration: 0.3, ease: 'easeOut' } // Simpler easing
  },
  collapsed: {
    height: 0,
    opacity: 0,
    marginTop: '0px',
    transition: { duration: 0.2, ease: 'easeIn' }
  },
};


// --- Reusable Accordion Item Component ---
const AccordionItem = ({ section, isOpen, onToggle }) => {

  const renderContent = (contentData) => {
    if (section.id === 'contact' && Array.isArray(contentData)) {
        return contentData.map((item, idx) => {
            const itemStyle = { marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '12px', color: '#555' }; // Slightly lighter text for details
            const iconStyle = { color: '#0056b3', flexShrink: 0 }; // Accent color icon
            const unavailableStyle = { color: '#888', fontStyle: 'italic' };

            switch(item.type) {
                case 'email':
                    return <p key={idx} style={{...itemStyle, ...(item.status === 'unavailable' ? unavailableStyle : {})}}> <FaEnvelope style={iconStyle}/> {item.value}</p>;
                case 'phone':
                    return <p key={idx} style={itemStyle}> <FaPhone style={iconStyle}/> <a href={`tel:${item.value}`} style={{color: '#0056b3', textDecoration: 'none', fontWeight: '500'}}>{item.value}</a></p>;
                 case 'address':
                    return <p key={idx} style={itemStyle}> <FaBuilding style={iconStyle}/> {item.value}</p>;
                case 'text':
                default:
                    return <p key={idx} style={{marginBottom: '18px', color: '#333'}}>{item.value}</p>; // Darker lead text
            }
        });
    }
    // Render regular content within a div with max-width for readability
    return (
        <div style={{ color: '#333', fontSize: '1rem', lineHeight: '1.7', maxWidth: '75ch' }} // Limit line length
             dangerouslySetInnerHTML={{ __html: contentData }}
        />
    );
  };

  return (
    // Uses layout animation for smooth open/close height changes
    <motion.div
      layout
      variants={itemVariants}
      style={{
        backgroundColor: '#fff', // White background for items
        borderRadius: '8px', // Less pronounced radius
        marginBottom: '15px',
        overflow: 'hidden',
        border: '1px solid #e0e0e0', // Standard border
        boxShadow: '0 2px 5px rgba(0,0,0,0.05)', // Subtle shadow
      }}
      transition={{ layout: { duration: 0.3, ease: 'easeInOut' } }}
    >
      {/* Accordion Header Button */}
      <motion.button
        onClick={onToggle}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '100%',
          padding: '18px 25px', // Standard padding
          background: isOpen ? '#f7f9fc' : '#fff', // Slight bg change when open
          color: '#1a202c', // Dark text color
          fontSize: '1.1rem', // Standard font size
          fontWeight: '600', // Semi-bold for header
          border: 'none',
          borderBottom: isOpen ? 'none' : '1px solid #e0e0e0', // Separator line when closed
          cursor: 'pointer',
          textAlign: 'left',
        }}
        whileHover={{ backgroundColor: '#f0f4f9' }} // Subtle hover
        transition={{ duration: 0.15 }}
        aria-expanded={isOpen}
        aria-controls={`content-${section.id}`}
        id={`header-${section.id}`}
      >
        <span style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
           {/* Clone icon and apply accent color */}
          {React.cloneElement(section.icon, {style: {fontSize: '1.3em', color: '#0056b3', opacity: 0.9}})}
           {section.title}
        </span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
        >
          <FaChevronDown style={{ color: '#555' }} /> {/* Chevron color */}
        </motion.div>
      </motion.button>

      {/* Animated Content Area */}
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.section
            key="content"
            initial="collapsed"
            animate="open"
            exit="collapsed"
            variants={accordionContentVariants}
            style={{ overflow: 'hidden' }}
            aria-labelledby={`header-${section.id}`}
            id={`content-${section.id}`}
            role="region"
          >
            {/* Inner div handles padding */}
            <div style={{ padding: '20px 25px 25px' }}> {/* Content padding */}
              {renderContent(section.content)}
            </div>
          </motion.section>
        )}
      </AnimatePresence>
    </motion.div>
  );
};


// --- Main Legal Support Component ---
const LegalSupport = () => {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    // Outermost container covering the whole page
    <div style={{
      minHeight: '100vh',
      width: '100%',
      // Very subtle light gray gradient background
      background: 'linear-gradient(180deg, #f8f9fa 0%, #e9ecef 100%)',
      fontFamily: "'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif", // Include system fonts
      padding: '0', // No padding here, handled by inner container
      display: 'flex', // Use flex to potentially center content vertically if needed later
      justifyContent: 'center', // Center the main content container horizontally
      alignItems: 'flex-start', // Align content to top
      boxSizing: 'border-box',
    }}>

      {/* Main Content Container - Takes full width with padding */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        style={{
          // No specific background needed if page bg is light
          width: '100%', // Full width
          maxWidth: '1200px', // Optional: Add a max-width for very large screens if needed
          padding: '50px 5%', // Vertical padding and percentage horizontal padding
          color: '#1a202c', // Default dark text color
          zIndex: 1,
          boxSizing: 'border-box',
          minHeight: '100vh', // Ensure it stretches if content is short
        }}
      >
        {/* Title */}
        <motion.h1 // Use H1 for main page title
          style={{
              fontSize: '2.5rem', // Adjust size
              textAlign: 'left', // Align left for document feel
              marginBottom: '40px',
              fontWeight: '700', // Bold title
              display: 'flex',
              alignItems: 'center',
              gap: '15px',
              color: '#2d3748', // Slightly softer dark color
              paddingBottom: '20px', // Space below title
              borderBottom: '1px solid #dee2e6', // Title separator
          }}
          variants={itemVariants}
        >
          <FaBookOpen style={{ color: '#0056b3', opacity: 0.9 }} aria-hidden="true"/>
           Legal & Support Information
        </motion.h1>

        {/* Accordion Section */}
        <div>
          {sections.map((section, index) => (
            <AccordionItem
              key={section.id}
              section={section}
              index={index}
              isOpen={openIndex === index}
              onToggle={() => setOpenIndex(openIndex === index ? null : index)}
            />
          ))}
        </div>
      </motion.div>

       {/* Remove the animated background div and style tag for keyframes */}

    </div>
  );
};

export default LegalSupport;

// Added basic style for strong tag for refund section
// This should ideally be handled by CSS classes if using CSS,
// but kept here for single-file JSX consistency
const GlobalStyles = () => (
  <style>{`
    strong {
       color: #1a202c; /* Match dark text */
       font-weight: 600;
    }
  `}</style>
);

// You might need to include <GlobalStyles /> in your main App component or near the root
// For this example, it's defined but not rendered within LegalSupport directly.
// Alternatively, apply styles directly where needed.