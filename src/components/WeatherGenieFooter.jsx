import React from 'react';

const WeatherGenieFooter = () => {
  const openLegalSupportPage = () => {
    const newWindow = window.open('', '_blank');
    newWindow.document.write(`
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>Legal & Support - Weather Genie</title>
          <style>
            body {
              font-family: 'Segoe UI', sans-serif;
              background: linear-gradient(to right, #eef2f8, #f8fbff);
              padding: 60px 20px;
              color: #333;
            }
            .container {
              max-width: 960px;
              margin: 0 auto;
            }
            h2 {
              color: #0077ff;
              font-size: 2rem;
              margin-bottom: 40px;
            }
            section {
              background: #fff;
              border-radius: 15px;
              padding: 30px;
              box-shadow: 0 8px 24px rgba(0,0,0,0.08);
              margin-bottom: 40px;
            }
            h3 {
              color: #005bb5;
              margin-bottom: 10px;
            }
            a {
              color: #0077ff;
              text-decoration: none;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <h2>📘 Legal & Support Information</h2>

            <section>
              <h3>📝 Terms & Conditions</h3>
              <p>
                By using Weather Genie AI, you agree to our fair-use policies: use responsibly, don’t scrape suggestions, and understand that the product is provided “as-is” for personal guidance and discovery.
              </p>
            </section>

            <section>
              <h3>🔐 Privacy Policy</h3>
              <p>
                We take privacy seriously. We don’t store your face, expressions, or any camera data. All mood detection is done locally in your browser — nothing is sent to servers.
              </p>
            </section>

            <section>
              <h3>💸 Refund & Cancellation</h3>
              <p>
                Not satisfied? You can cancel your access and get a full refund within <strong>7 days</strong>. Refunds are processed in <strong>5 business days</strong>. Just email us your payment details.
              </p>
            </section>

            <section>
              <h3>📞 Contact Us</h3>
              <p>
                Need help or feedback?<br />
                📧 <a href="mailto:support@weathergenie.in">support@weathergenie.in</a><br />
                📱 +91-98765-43210<br />
                🏢 Weather Genie AI Labs, Innovation Tower, Sector 62, Noida, India – 201309
              </p>
            </section>
          </div>
        </body>
      </html>
    `);
    newWindow.document.close();
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '40px' }}>
      <button
        type="button"
        onClick={openLegalSupportPage}
        style={{
          padding: '14px 30px',
          fontSize: '16px',
          fontWeight: '600',
          border: 'none',
          borderRadius: '10px',
          background: 'linear-gradient(to right, #0077ff, #00c6ff)',
          color: '#fff',
          boxShadow: '0 4px 15px rgba(0, 119, 255, 0.4)',
          cursor: 'pointer',
          transition: 'transform 0.2s ease, box-shadow 0.3s ease',
        }}
        onMouseOver={e => {
          e.currentTarget.style.transform = 'scale(1.03)';
          e.currentTarget.style.boxShadow = '0 6px 18px rgba(0, 119, 255, 0.5)';
        }}
        onMouseOut={e => {
          e.currentTarget.style.transform = 'scale(1)';
          e.currentTarget.style.boxShadow = '0 4px 15px rgba(0, 119, 255, 0.4)';
        }}
      >
        📘 View Legal & Support Information
      </button>
    </div>
  );
};

export default WeatherGenieFooter;
