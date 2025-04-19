import React from 'react';
import { Helmet } from 'react-helmet';

const WeatherGenieSEO = () => {
  return (
    <Helmet>
      <title>Weather Genie AI - Accurate Weather Forecasts and Mood-based Movie Suggestions</title>
      <meta
        name="description"
        content="Weather Genie AI delivers personalized, real-time weather forecasts along with AI-powered mood detection and tailored movie recommendations."
      />
      <meta
        name="keywords"
        content="Weather Genie AI, AI Weather App, mood-based movie suggestions, real-time weather, innovative weather forecast, personalized movie recommendations"
      />
      <link rel="canonical" href="https://weather-genie-six.vercel.app/" />

      {/* Open Graph tags for social media visibility */}
      <meta property="og:title" content="Weather Genie AI - Accurate Weather and Movie Suggestions" />
      <meta
        property="og:description"
        content="Get real-time weather updates and personalized movie recommendations based on your current mood using advanced AI technology."
      />
      <meta property="og:url" content="https://weather-genie-six.vercel.app/" />
      <meta property="og:type" content="website" />
      <meta property="og:image" content="https://your-weather-genie-site.com/social-share.png" />

      {/* Twitter Card tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content="Weather Genie AI - AI-driven Weather & Movies" />
      <meta
        name="twitter:description"
        content="Experience personalized weather forecasts and mood-driven movie suggestions powered by cutting-edge AI."
      />
      <meta name="twitter:image" content="https://your-weather-genie-site.com/twitter-share.png" />

      {/* Structured Data JSON-LD */}
      <script type="application/ld+json">
        {`
        {
          "@context": "https://schema.org",
          "@type": "WebApplication",
          "name": "Weather Genie AI",
          "url": "https://your-weather-genie-site.com",
          "applicationCategory": "Weather, Entertainment",
          "description": "Weather Genie AI provides real-time personalized weather forecasts and AI-based mood-driven movie recommendations.",
          "operatingSystem": "Web-based, Android, iOS",
          "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "INR"
          }
        }
        `}
      </script>
    </Helmet>
  );
};

export default WeatherGenieSEO;
