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
  FaBuilding,
} from 'react-icons/fa';

// --- Data Configuration ---
// Moved sections data outside the component for better separation of concerns.
const legalSections = [
  {
    id: 'terms',
    title: 'Terms & Conditions',
    icon: <FaBalanceScale size={18} />, // Slightly adjusted icon size
    content: `By accessing and using Weather Genie AI ("the Service"), you hereby agree to comply with and be bound by the following terms and conditions. Please review them carefully. These terms constitute a legally binding agreement between you and Weather Genie AI Labs. You agree to use the Service responsibly, refrain from automated data scraping or overwhelming our servers, and acknowledge that the Service is provided on an "as-is" and "as-available" basis for personal, non-commercial guidance and informational purposes only. We reserve the right to modify these terms at any time.`,
  },
  {
    id: 'privacy',
    title: 'Privacy Policy',
    icon: <FaShieldAlt size={18} />,
    content: `Your privacy is paramount to us. Weather Genie AI is designed with privacy at its core. We **do not** collect, store, or transmit any images, video feeds, facial recognition data, or specific emotional expressions from your device's camera. All mood detection and analysis processes occur entirely locally within your web browser environment. No sensitive personal data related to this feature ever leaves your device or reaches our servers. We may collect anonymized usage statistics to improve the service, but this data is aggregated and cannot be linked back to individual users.`,
  },
  {
    id: 'refund',
    title: 'Refund & Cancellation Policy',
    icon: <FaUndoAlt size={18} />,
    // Used dangerouslySetInnerHTML because the original content had HTML tags.
    // Ensure any dynamic content passed here is properly sanitized if it comes from user input.
    contentHtml: `We strive for customer satisfaction. If you are not satisfied with your purchase of a premium feature, you are eligible for a full refund provided you request it within <strong>7 calendar days</strong> of the initial purchase date. To request a refund, please contact our support team with your transaction ID and reason for the request. Refunds are typically processed within <strong>5-7 business days</strong> back to the original method of payment. Subscriptions can be cancelled at any time via your account settings, effective at the end of the current billing period.`,
  },
  {
    id: 'contact',
    title: 'Contact Information',
    icon: <FaHeadset size={18} />,
    contentItems: [ // Renamed for clarity
      { type: 'text', value: 'For support, inquiries, or feedback, please reach out:' },
      { type: 'email', value: 'support@weathergenie.ai', status: 'unavailable', note: '(Temporarily unavailable - please use phone)' },
      { type: 'phone', value: '+91-98188-36297', accessibleValue: '+919818836297' }, // Added accessible value for tel link
      { type: 'address', value: 'Weather Genie AI Labs, Sector 62, Noida, UP, India (Office setup in progress)' } // Added a bit more detail
    ]
  },
];

// --- Component ---

const LegalSupportPage = () => {
  const [openSectionId, setOpenSectionId] = useState(null); // Use ID for state

  const toggleAccordion = (id) => {
    setOpenSectionId(openSectionId === id ? null : id);
  };

  // --- Styles ---
  // Grouped styles for better readability

  const pageStyle = {
    minHeight: '100vh', // Use minHeight to ensure it covers viewport but can grow
    width: '100vw',
    padding: '40px 20px', // More padding top/bottom
    background: 'linear-gradient(135deg, #f5f7fa 0%, #e9ecef 100%)', // Subtle gradient change
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-start', // Align container to the top
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
    boxSizing: 'border-box',
    overflowY: 'auto', // Allow scrolling on the page if container grows
  };

  const containerStyle = {
    maxWidth: '900px', // Slightly narrower for better readability on wide screens
    width: '100%', // Take full width up to maxWidth
    margin: '0 auto', // Center the container
    padding: '30px 40px', // Increased padding inside container
    backgroundColor: '#ffffff',
    boxShadow: '0 8px 25px rgba(0, 0, 0, 0.07)', // Softer shadow
    borderRadius: '16px', // More rounded corners
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'column',
  };

  const headingStyle = {
    fontSize: '1.8rem', // Slightly larger heading
    fontWeight: 700,
    marginBottom: '30px', // More space below heading
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '12px', // More gap
    color: '#2d3748', // Darker grey
    textAlign: 'center',
  };

  const accordionWrapperStyle = {
    width: '100%', // Ensure it takes full width of container
  };

  const sectionStyle = {
    marginBottom: '12px', // Space between accordion items
    borderRadius: '10px', // Consistent rounding
    overflow: 'hidden',
    border: '1px solid #e2e8f0', // Standard border
    backgroundColor: '#fff',
    transition: 'box-shadow 0.3s ease',
  };

  const buttonStyle = (isOpen) => ({ // Function to dynamically set background
    width: '100%',
    padding: '18px 25px', // More padding in button
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    fontSize: '1.05rem', // Slightly larger title font
    fontWeight: 600,
    background: isOpen ? '#f8f9fa' : '#fff', // Lighter grey when open
    border: 'none',
    cursor: 'pointer',
    transition: 'background 0.25s ease',
    color: '#334155', // Slightly different text color
    textAlign: 'left', // Ensure text aligns left
  });

  const buttonTitleStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '15px', // More gap between icon and title
  };

  const chevronStyle = (isOpen) => ({
    transform: isOpen ? 'rotate(180deg)' : 'rotate(0)',
    transition: 'transform 0.35s ease',
    color: '#64748b', // Chevron color
    fontSize: '0.9rem', // Make chevron slightly smaller
  });

  const contentWrapperStyle = {
    // Framer Motion handles height animation
    overflow: 'hidden', // Crucial for height animation
    background: '#f8f9fa', // Match open button background
    borderTop: '1px solid #e2e8f0',
  };

  const contentStyle = {
    padding: '20px 30px 25px 30px', // More padding in content area
    color: '#475569', // Content text color
    lineHeight: '1.65', // Increased line height for readability
    fontSize: '0.95rem', // Slightly larger content font
  };

  const contactItemStyle = (isUnavailable) => ({
    color: isUnavailable ? '#94a3b8' : '#334155', // Grey out unavailable items
    margin: '8px 0',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    fontSize: '0.95rem',
    cursor: isUnavailable ? 'not-allowed' : 'default',
  });

  const linkStyle = {
    color: '#2563eb', // Standard link blue
    textDecoration: 'none',
    fontWeight: 500,
    ':hover': { // Note: Inline styles don't support pseudo-classes directly
      textDecoration: 'underline',
    }
  };
  // You'd typically use CSS Modules or styled-components for hover effects.
  // For inline, we can make it non-underlined by default.

  return (
    <div style={pageStyle}>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        style={containerStyle}
      >
        <h1 style={headingStyle}>
          <FaBookOpen size={28} /> {/* Slightly larger icon */}
          Legal & Support Information
        </h1>

        <div style={accordionWrapperStyle}>
          {legalSections.map((section) => {
            const isOpen = openSectionId === section.id;
            const contentId = `content-${section.id}`; // ID for aria-controls

            return (
              <motion.div
                key={section.id}
                style={sectionStyle}
                whileHover={{ boxShadow: '0 6px 15px rgba(0, 0, 0, 0.06)' }} // Subtle hover shadow
                transition={{ duration: 0.2 }}
              >
                {/* Accordion Header Button */}
                <button
                  onClick={() => toggleAccordion(section.id)}
                  aria-expanded={isOpen}
                  aria-controls={contentId} // Link button to content panel
                  style={buttonStyle(isOpen)}
                >
                  <span style={buttonTitleStyle}>
                    {React.cloneElement(section.icon, { color: '#475569' })} {/* Consistent Icon Color */}
                    {section.title}
                  </span>
                  <FaChevronDown style={chevronStyle(isOpen)} />
                </button>

                {/* Accordion Content Panel */}
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.section // Use section tag for semantics
                      id={contentId}
                      initial={{ height: 0 }}
                      animate={{ height: 'auto' }}
                      exit={{ height: 0 }}
                      transition={{ duration: 0.3, ease: 'easeInOut' }}
                      style={contentWrapperStyle} // Apply overflow: hidden here
                      aria-hidden={!isOpen}
                    >
                      {/* Render content based on type */}
                      <div style={contentStyle}>
                        {section.contentHtml ? (
                          <div
                            dangerouslySetInnerHTML={{ __html: section.contentHtml }}
                          />
                        ) : section.contentItems ? (
                          section.contentItems.map((item, idx) => {
                             const isUnavailable = item.status === 'unavailable';
                             return (
                               <p key={idx} style={contactItemStyle(isUnavailable)}>
                                 {item.type === 'phone' && <FaPhone size={14} aria-hidden="true" />}
                                 {item.type === 'email' && <FaEnvelope size={14} aria-hidden="true"/>}
                                 {item.type === 'address' && <FaBuilding size={14} aria-hidden="true"/>}

                                 {item.type === 'phone' && !isUnavailable ? (
                                   <a href={`tel:${item.accessibleValue}`} style={linkStyle}>
                                     {item.value}
                                   </a>
                                 ) : item.type === 'email' && !isUnavailable ? (
                                    // Basic mailto link (can be improved)
                                    <a href={`mailto:${item.value}`} style={linkStyle}>
                                      {item.value}
                                    </a>
                                  ) : (
                                  // Display value directly for text, address, or unavailable items
                                   <span>{item.value} {item.note && <i style={{ color: '#94a3b8' }}>{item.note}</i>}</span>
                                 )}
                               </p>
                             );
                           })
                        ) : (
                          // Default text content
                          <p>{section.content}</p>
                        )}
                      </div>
                    </motion.section>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
};

export default LegalSupportPage;