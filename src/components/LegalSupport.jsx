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

// --- Legal Content Placeholder Data ---

/*
---------------------------------------------------------------------
!! जरूरी सूचना !! (Important Notice) !!
---------------------------------------------------------------------
नीचे दिया गया content सिर्फ placeholder (जगह भरने वाला) है।
यह कानूनी सलाह नहीं है। आपको एक वकील (legal professional) से सलाह लेकर
अपने business के लिए सही Terms & Conditions, Privacy Policy, और
Refund Policy बनवानी होगी और नीचे दिए गए placeholders को उनसे बदलना होगा।

The content below is ONLY placeholder text. It is NOT legal advice.
You MUST consult with a legal professional to draft appropriate
Terms & Conditions, Privacy Policy, and Refund Policy specific to
your business and replace the placeholders below accordingly.
---------------------------------------------------------------------
*/

const legalSections = [
  {
    id: 'terms',
    title: 'Terms & Conditions',
    icon: <FaBalanceScale size={18} />,
    // क़ानूनी चेतावनी: इस placeholder को अपने वास्तविक Terms & Conditions से बदलें जो एक वकील द्वारा तैयार किया गया हो।
    content: 'By using Weather Genie AI, users agree to our fair-use policy. Content, design, and logic are protected under Indian copyright and IP law. Misuse, reverse engineering, or scraping is strictly prohibited. Disputes shall be resolved under Indian Jurisdiction (Bijnor Court).'
  },
  {
    id: 'privacy',
    title: 'Privacy Policy',
    icon: <FaShieldAlt size={18} />,
    // क़ानूनी चेतावनी: इस placeholder को अपने वास्तविक Privacy Policy से बदलें जो एक वकील द्वारा तैयार किया गया हो।
    content: `Weather Genie AI does not collect or store any facial, mood, or location data. All mood detection is processed locally on the user’s browser. We do not transmit or share personal data to third parties.`,
  },
  {
    id: 'refund',
    title: 'Refund & Cancellation Policy',
    icon: <FaUndoAlt size={18} />,
    // क़ानूनी चेतावनी: इस placeholder को अपने वास्तविक Refund & Cancellation Policy से बदलें। समयसीमा और शर्तें साफ़ होनी चाहिए।
    // Using contentHtml allows for potential formatting like bold text. Ensure the source is safe.
    contentHtml: `Refunds are available within 7 calendar days of purchase for premium features. Refunds will be processed within 5-7 business days upon email request to ankitjust4u121@gmail.com with order ID and reason.`,
  },
  {
    id: 'contact',
    title: 'Contact Information',
    icon: <FaHeadset size={18} />,
    contentItems: [
      { type: 'text', value: 'For support, inquiries, or feedback, please reach out:' },
      // महत्वपूर्ण: सुनिश्चित करें कि यह ईमेल पता चालू है और नियमित रूप से जांचा जाता है।
      // IMPORTANT: Ensure this email address is operational and actively monitored.
      { type: 'email', value: 'ankitjust4u121@gmail.com', status: 'available' }, // Status changed to 'available'

      // महत्वपूर्ण: सुनिश्चित करें कि यह फोन नंबर सही और चालू है।
      // IMPORTANT: Ensure this phone number is correct and operational.
      { type: 'phone', value: '+91-98188-36297', accessibleValue: '+919818836297' },

      // महत्वपूर्ण: इसे अपने पूर्ण, सत्यापन योग्य परिचालन पते से बदलें (पंजीकृत, घर, सह-कार्यशील, या वर्चुअल कार्यालय)। यह Razorpay रिकॉर्ड से मेल खाना चाहिए।
      // IMPORTANT: Replace with your complete, verifiable operational address (Registered, Home, Co-working, or Virtual Office). Must match Razorpay records.
      { type: 'address', value: 'Ankit Upadhyay, HNo.B, Mau0Alipur Inayat, PS-DHAMPUR, TEH-Dhampur, DIST-Bijnor, Uttar Pradesh – 246761, India' } // Updated placeholder, removed note
    ]
  },
];

// --- React Component (Structure remains the same) ---

const LegalSupportPage = () => {
  const [openSectionId, setOpenSectionId] = useState(null);

  const toggleAccordion = (id) => {
    setOpenSectionId(openSectionId === id ? null : id);
  };

  // --- Styles (Kept the same as previous refinement) ---
  const pageStyle = { minHeight: '100vh', width: '100vw', padding: '40px 20px', background: 'linear-gradient(135deg, #f5f7fa 0%, #e9ecef 100%)', display: 'flex', justifyContent: 'center', alignItems: 'flex-start', fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif", boxSizing: 'border-box', overflowY: 'auto' };
  const containerStyle = { maxWidth: '900px', width: '100%', margin: '0 auto', padding: '30px 40px', backgroundColor: '#ffffff', boxShadow: '0 8px 25px rgba(0, 0, 0, 0.07)', borderRadius: '16px', boxSizing: 'border-box', display: 'flex', flexDirection: 'column' };
  const headingStyle = { fontSize: '1.8rem', fontWeight: 700, marginBottom: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', color: '#2d3748', textAlign: 'center' };
  const accordionWrapperStyle = { width: '100%' };
  const sectionStyle = { marginBottom: '12px', borderRadius: '10px', overflow: 'hidden', border: '1px solid #e2e8f0', backgroundColor: '#fff', transition: 'box-shadow 0.3s ease' };
  const buttonStyle = (isOpen) => ({ width: '100%', padding: '18px 25px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '1.05rem', fontWeight: 600, background: isOpen ? '#f8f9fa' : '#fff', border: 'none', cursor: 'pointer', transition: 'background 0.25s ease', color: '#334155', textAlign: 'left' });
  const buttonTitleStyle = { display: 'flex', alignItems: 'center', gap: '15px' };
  const chevronStyle = (isOpen) => ({ transform: isOpen ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.35s ease', color: '#64748b', fontSize: '0.9rem' });
  const contentWrapperStyle = { overflow: 'hidden', background: '#f8f9fa', borderTop: '1px solid #e2e8f0' };
  const contentStyle = { padding: '20px 30px 25px 30px', color: '#475569', lineHeight: '1.65', fontSize: '0.95rem' };
  const contactItemStyle = (isUnavailable) => ({ color: isUnavailable ? '#94a3b8' : '#334155', margin: '8px 0', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.95rem', cursor: isUnavailable ? 'not-allowed' : 'default' });
  const linkStyle = { color: '#2563eb', textDecoration: 'none', fontWeight: 500, ':hover': { textDecoration: 'underline' } };

  return (
    <div style={pageStyle}>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        style={containerStyle}
      >
        <h1 style={headingStyle}>
          <FaBookOpen size={28} /> Legal & Support Information
        </h1>

        <div style={accordionWrapperStyle}>
          {legalSections.map((section) => {
            const isOpen = openSectionId === section.id;
            const contentId = `content-${section.id}`;

            return (
              <motion.div
                key={section.id}
                style={sectionStyle}
                whileHover={{ boxShadow: '0 6px 15px rgba(0, 0, 0, 0.06)' }}
                transition={{ duration: 0.2 }}
              >
                <button
                  onClick={() => toggleAccordion(section.id)}
                  aria-expanded={isOpen}
                  aria-controls={contentId}
                  style={buttonStyle(isOpen)}
                >
                  <span style={buttonTitleStyle}>
                    {React.cloneElement(section.icon, { color: '#475569' })}
                    {section.title}
                  </span>
                  <FaChevronDown style={chevronStyle(isOpen)} />
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.section
                      id={contentId}
                      initial={{ height: 0 }}
                      animate={{ height: 'auto' }}
                      exit={{ height: 0 }}
                      transition={{ duration: 0.3, ease: 'easeInOut' }}
                      style={contentWrapperStyle}
                      aria-hidden={!isOpen}
                    >
                      <div style={contentStyle}>
                        {section.contentHtml ? (
                          // Render HTML content for refund policy (or others if needed)
                          <div
                            dangerouslySetInnerHTML={{ __html: section.contentHtml }}
                          />
                        ) : section.contentItems ? (
                          // Render contact items
                          section.contentItems.map((item, idx) => {
                             const isUnavailable = item.status === 'unavailable'; // Although status is now 'available'
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
                                    <a href={`mailto:${item.value}`} style={linkStyle}>
                                      {item.value}
                                    </a>
                                  ) : (
                                   // Display text, address, or unavailable items directly
                                   <span>{item.value} {item.note && <i style={{ color: '#94a3b8' }}>{item.note}</i>}</span> // Note field kept in case needed later, but currently empty
                                 )}
                               </p>
                             );
                           })
                        ) : (
                          // Render plain text content for T&C, Privacy
                          <p style={{ whiteSpace: 'pre-wrap' }}>{section.content}</p> // Added pre-wrap to respect potential line breaks in placeholder
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