import React, { useState, useEffect, useMemo } from 'react'; // Added useMemo
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
    FaHandsHelping,
    FaCheckCircle, // Using for checklist items
    FaCheckDouble, // Using for final accepted badge
    FaTasks, // Icon for checklist section
} from 'react-icons/fa';

// --- Legal Content Placeholder Data ---
/* ... (Same notice as before) ... */

const legalSections = [
    {
        id: 'terms',
        title: 'Terms & Conditions',
        icon: <FaBalanceScale size={18} />,
        content: 'By using Weather Genie AI, users agree to our fair-use policy. Content, design, and logic are protected under Indian copyright and IP law. Misuse, reverse engineering, or scraping is strictly prohibited. Disputes shall be resolved under Indian Jurisdiction (Bijnor Court).'
    },
    {
        id: 'privacy',
        title: 'Privacy Policy',
        icon: <FaShieldAlt size={18} />,
        content: `Weather Genie AI does not collect or store any facial, mood, or location data. All mood detection is processed locally on the user’s browser. We do not transmit or share personal data to third parties.`,
    },
    {
        id: 'refund',
        title: 'Refund & Cancellation Policy',
        icon: <FaUndoAlt size={18} />,
        contentHtml: `Refunds are available within 7 calendar days of purchase for premium features. Refunds will be processed within 5-7 business days upon email request to ankitjust4u121@gmail.com with order ID and reason.`,
    },
    {
        id: 'fair-policy',
        title: 'Fair Usage Policy',
        icon: <FaHandsHelping size={18} />,
        content: `At Weather Genie AI, we ensure a fair and transparent experience for all users:

- Equal Access: All users, free or premium, get reliable weather updates without discrimination based on location, device, or subscription status. Premium plans unlock extras like ad-free usage or detailed forecasts.
- Responsible Data Use: We use minimal data (e.g., location or queries) only to provide accurate weather updates. Your data is never shared with third parties without consent, except as required by law.
- Usage Limits: Free users have a daily limit (e.g., 50 queries) to ensure smooth service for everyone. Misuse, like automated spamming, may lead to restrictions.
- Accuracy Disclaimer: Weather data comes from trusted external sources, but we’re not liable for inaccuracies. Always verify critical information with official authorities.
- Community Respect: If you share weather reports, keep them respectful and relevant. Offensive content may be removed.
- Fair Billing: Premium users can cancel anytime, with refunds available within 7 days if unsatisfied.

We may update this policy as needed, with changes posted here. Questions? Email us at ankitjust4u121@gmail.com.`,
        // +++ NEW: Checklist Approach +++
        requiresAcceptance: true,
        keyPoints: [ // Short summary points for the checklist
            'Understand the daily query limit for free users (50 queries).',
            'Agree that data is used minimally for weather updates and not shared without consent.',
            'Acknowledge that weather data accuracy is not guaranteed.',
            'Accept that premium features have a 7-day refund window.',
            'Agree to use the service respectfully.'
        ],
        // Quiz removed
        // +++ END OF NEW APPROACH DATA +++
    },
    {
        id: 'contact',
        title: 'Contact Information',
        icon: <FaHeadset size={18} />,
        contentItems: [
            { type: 'text', value: 'For support, inquiries, or feedback, please reach out:' },
            { type: 'email', value: 'ankitjust4u121@gmail.com', status: 'available' },
            { type: 'phone', value: '+91-98188-36297', accessibleValue: '+919818836297' },
            { type: 'address', value: 'Ankit Upadhyay, HNo.B, Mau0Alipur Inayat, PS-DHAMPUR, TEH-Dhampur, DIST-Bijnor, Uttar Pradesh – 246761, India' }
        ],
    },
];

// --- React Component ---
const LegalSupportPage = () => {
    const [openSectionId, setOpenSectionId] = useState(null);
    const [hasAcceptedPolicy, setHasAcceptedPolicy] = useState(false);
    // State for checklist items { 0: false, 1: false, ... }
    const [checklistState, setChecklistState] = useState({});

    // Find the fair policy section once
    const fairPolicy = useMemo(() => legalSections.find(s => s.id === 'fair-policy'), []);

    // Initialize checklist state based on key points length
    useEffect(() => {
        if (fairPolicy?.keyPoints) {
            const initialChecklist = {};
            fairPolicy.keyPoints.forEach((_, index) => {
                initialChecklist[index] = false;
            });
            setChecklistState(initialChecklist);
        }
    }, [fairPolicy]); // Run only when fairPolicy object changes (effectively once)

    // Check acceptance status on mount and auto-open section
    useEffect(() => {
        const accepted = localStorage.getItem('fairPolicyAccepted') === 'true';
        setHasAcceptedPolicy(accepted);
        if (fairPolicy?.requiresAcceptance && !accepted) {
            setOpenSectionId('fair-policy');
        }
    }, [fairPolicy]); // Depend on fairPolicy

    // Handle checklist item changes
    const handleChecklistChange = (index) => {
        if (hasAcceptedPolicy) return; // Don't allow changes if already accepted
        setChecklistState(prev => ({
            ...prev,
            [index]: !prev[index] // Toggle the value
        }));
    };

    // Check if all checklist items are checked
    const allChecklistItemsChecked = useMemo(() => {
        if (!fairPolicy?.keyPoints) return false;
        return fairPolicy.keyPoints.every((_, index) => checklistState[index]);
    }, [checklistState, fairPolicy?.keyPoints]);


    // Handle final policy acceptance
    const handleAcceptPolicy = () => {
        if (allChecklistItemsChecked) { // Ensure all items are checked
            console.log('User accepted Fair Usage Policy via Checklist');
            localStorage.setItem('fairPolicyAccepted', 'true');
            setHasAcceptedPolicy(true);
        }
    };

    // Toggle accordion sections
    const toggleAccordion = (id) => {
        setOpenSectionId(openSectionId === id ? null : id);
    };

    // --- Styles (Adjusting for checklist) ---
    const pageStyle = { minHeight: '100vh', width: '100vw', padding: '40px 20px', background: 'linear-gradient(135deg, #f5f7fa 0%, #e9ecef 100%)', display: 'flex', justifyContent: 'center', alignItems: 'flex-start', fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif", boxSizing: 'border-box', overflowY: 'auto' };
    const containerStyle = { maxWidth: '900px', width: '100%', margin: '0 auto', padding: '30px 40px', backgroundColor: '#ffffff', boxShadow: '0 8px 25px rgba(0, 0, 0, 0.07)', borderRadius: '16px', boxSizing: 'border-box', display: 'flex', flexDirection: 'column' };
    const headingStyle = { fontSize: '1.8rem', fontWeight: 700, marginBottom: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', color: '#2d3748', textAlign: 'center' };
    const accordionWrapperStyle = { width: '100%' };
    const sectionStyle = { marginBottom: '12px', borderRadius: '10px', overflow: 'hidden', border: '1px solid #e2e8f0', backgroundColor: '#fff', transition: 'box-shadow 0.3s ease' };
    const buttonStyle = (isOpen) => ({ width: '100%', padding: '18px 25px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '1.05rem', fontWeight: 600, background: isOpen ? '#f8f9fa' : '#fff', border: 'none', cursor: 'pointer', transition: 'background 0.25s ease', color: '#334155', textAlign: 'left' });
    const buttonTitleStyle = { display: 'flex', alignItems: 'center', gap: '15px', flexGrow: 1 };
    const buttonMetaStyle = { display: 'flex', alignItems: 'center', gap: '10px', marginLeft: 'auto' };
    const chevronStyle = (isOpen) => ({ transform: isOpen ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.35s ease', color: '#64748b', fontSize: '0.9rem' });
    const contentWrapperStyle = { overflow: 'hidden', background: '#f8f9fa', borderTop: '1px solid #e2e8f0' };
    const contentStyle = { padding: '20px 30px 25px 30px', color: '#475569', lineHeight: '1.65', fontSize: '0.95rem', maxHeight: '500px', overflowY: 'auto' };
    const contactItemStyle = (isUnavailable) => ({ color: isUnavailable ? '#94a3b8' : '#334155', margin: '8px 0', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.95rem', cursor: isUnavailable ? 'not-allowed' : 'default' });
    const linkStyle = { color: '#2563eb', textDecoration: 'none', fontWeight: 500, ':hover': { textDecoration: 'underline' } };
    // Checklist specific styles
    const checklistContainerStyle = { marginTop: '25px', padding: '20px', backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.05)' };
    const checklistItemStyle = { display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 0', borderBottom: '1px solid #f1f5f9', cursor: 'pointer' };
    const checklistItemStyleLast = { ...checklistItemStyle, borderBottom: 'none' }; // No border for last item
    const checkboxStyle = { width: '18px', height: '18px', cursor: 'pointer', accentColor: '#2563eb' }; // Styled checkbox
    const checklistTextStyle = (isChecked) => ({ flexGrow: 1, fontSize: '0.95rem', color: isChecked ? '#166534' : '#334155', textDecoration: isChecked ? 'line-through' : 'none', transition: 'color 0.2s ease, text-decoration 0.2s ease' });
    const acceptButtonStyle = (disabled) => ({ // Button inside accordion
        padding: '12px 25px', backgroundColor: disabled ? '#cbd5e1' : '#4f46e5', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '1rem', fontWeight: 500, cursor: disabled ? 'not-allowed' : 'pointer', transition: 'background-color 0.2s ease', marginTop: '20px', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
    });
    const acceptedBadgeStyle = { // Badge inside accordion
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginTop: '20px', padding: '12px 20px', backgroundColor: '#dcfce7', borderRadius: '8px', color: '#166534', fontWeight: 600, fontSize: '1rem', border: '1px solid #86efac'
    };
     const actionRequiredStyle = {fontSize: '0.8rem', color: '#f97316', fontWeight: 500, marginLeft: '10px', fontStyle: 'italic'};


    return (
        <>
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
                            const isFairPolicySection = section.id === 'fair-policy';
                            const needsAcceptance = isFairPolicySection && section.requiresAcceptance;

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
                                            {needsAcceptance && !hasAcceptedPolicy && (
                                                <span style={actionRequiredStyle}>(Action Required)</span>
                                            )}
                                        </span>
                                         <span style={buttonMetaStyle}>
                                           {needsAcceptance && hasAcceptedPolicy && (
                                                <FaCheckCircle size={18} color="#10b981" style={{ marginRight: '10px' }} aria-label="Policy Accepted"/>
                                            )}
                                            <FaChevronDown style={chevronStyle(isOpen)} />
                                        </span>
                                    </button>

                                    <AnimatePresence initial={false}>
                                        {isOpen && (
                                            <motion.section
                                                id={contentId}
                                                initial={{ height: 0 }}
                                                animate={{ height: 'auto' }}
                                                exit={{ height: 0 }}
                                                transition={{ duration: 0.35, ease: 'easeInOut' }}
                                                style={contentWrapperStyle}
                                                aria-hidden={!isOpen}
                                            >
                                                <div style={contentStyle}>
                                                    {/* Render standard content */}
                                                    {section.contentHtml ? (
                                                        <div dangerouslySetInnerHTML={{ __html: section.contentHtml }} />
                                                    ) : section.contentItems ? (
                                                         section.contentItems.map((item, idx) => {
                                                          const isUnavailable = item.status === 'unavailable';
                                                          return (
                                                            <p key={idx} style={contactItemStyle(isUnavailable)}>
                                                              {item.type === 'phone' && <FaPhone size={14} aria-hidden="true" />}
                                                              {item.type === 'email' && <FaEnvelope size={14} aria-hidden="true" />}
                                                              {item.type === 'address' && <FaBuilding size={14} aria-hidden="true" />}
                                                              {item.type === 'phone' && !isUnavailable ? (
                                                                <a href={`tel:${item.accessibleValue}`} style={linkStyle}>{item.value}</a>
                                                              ) : item.type === 'email' && !isUnavailable ? (
                                                                <a href={`mailto:${item.value}`} style={linkStyle}>{item.value}</a>
                                                              ) : (
                                                                <span>{item.value} {item.note && <i style={{ color: '#94a3b8' }}>{item.note}</i>}</span>
                                                              )}
                                                            </p>
                                                          );
                                                        })
                                                    ) : (
                                                        <p style={{ whiteSpace: 'pre-wrap' }}>{section.content}</p>
                                                    )}

                                                    {/* --- Inline Checklist Acceptance Flow --- */}
                                                    {needsAcceptance && (
                                                        <>
                                                            {!hasAcceptedPolicy ? (
                                                                // --- 1. Show Checklist if not accepted ---
                                                                <motion.div
                                                                    initial={{ opacity: 0 }}
                                                                    animate={{ opacity: 1 }}
                                                                    transition={{ delay: 0.1 }}
                                                                    style={checklistContainerStyle}
                                                                >
                                                                    <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#1e293b', marginBottom: '15px', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                                                                        <FaTasks /> Acknowledge Key Points & Accept
                                                                    </h3>
                                                                    {section.keyPoints?.map((point, index) => (
                                                                        <motion.label // Use label for better accessibility
                                                                            key={index}
                                                                            style={index === section.keyPoints.length - 1 ? checklistItemStyleLast : checklistItemStyle}
                                                                            initial={{ opacity: 0, x: -10 }}
                                                                            animate={{ opacity: 1, x: 0 }}
                                                                            transition={{ delay: index * 0.05 }} // Faster stagger
                                                                            htmlFor={`checklist-${section.id}-${index}`} // Accessibility link
                                                                        >
                                                                            <input
                                                                                type="checkbox"
                                                                                id={`checklist-${section.id}-${index}`} // Accessibility link
                                                                                checked={checklistState[index] || false}
                                                                                onChange={() => handleChecklistChange(index)}
                                                                                style={checkboxStyle}
                                                                                aria-labelledby={`checklist-text-${section.id}-${index}`} // Accessibility
                                                                            />
                                                                            <span
                                                                                id={`checklist-text-${section.id}-${index}`} // Accessibility
                                                                                style={checklistTextStyle(checklistState[index] || false)}
                                                                            >
                                                                                {point}
                                                                            </span>
                                                                        </motion.label>
                                                                    ))}
                                                                    {/* --- Accept Button (enabled only after all checked) --- */}
                                                                    <button
                                                                        onClick={handleAcceptPolicy}
                                                                        disabled={!allChecklistItemsChecked}
                                                                        style={acceptButtonStyle(!allChecklistItemsChecked)}
                                                                        onMouseOver={(e) => { if (allChecklistItemsChecked) e.target.style.backgroundColor = '#4338ca'; }}
                                                                        onMouseOut={(e) => { if (allChecklistItemsChecked) e.target.style.backgroundColor = '#4f46e5'; }}
                                                                        aria-label="Accept Fair Usage Policy after checking all points"
                                                                    >
                                                                        <FaCheckCircle size={16}/>
                                                                        {allChecklistItemsChecked ? 'Accept Fair Usage Policy' : 'Check All Points to Accept'}
                                                                    </button>
                                                                </motion.div>
                                                            ) : (
                                                                // --- 2. Show Accepted Badge if already accepted ---
                                                                <motion.div
                                                                    style={acceptedBadgeStyle}
                                                                    initial={{ opacity: 0, scale: 0.9 }}
                                                                    animate={{ opacity: 1, scale: 1 }}
                                                                    transition={{ delay: 0.1, duration: 0.3}}
                                                                >
                                                                    <FaCheckDouble size={20} />
                                                                    Fair Usage Policy Accepted
                                                                </motion.div>
                                                            )}
                                                        </>
                                                    )}
                                                    {/* --- End of Inline Acceptance Flow --- */}

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
        </>
    );
};

export default LegalSupportPage;