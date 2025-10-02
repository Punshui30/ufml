'use client';

import { useState } from 'react';
import LoadingScreen from '../components/LoadingScreen';

export default function LoadingPage() {
  const [showLoading, setShowLoading] = useState(false);

  const handleStartLoading = () => {
    setShowLoading(true);
  };

  const handleLoadingComplete = () => {
    setShowLoading(false);
  };

  return (
    <div style={{ padding: '2rem', textAlign: 'center', minHeight: '100vh', background: '#f8f9fa' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <h1 style={{ color: '#333', marginBottom: '2rem' }}>Loading Screen Demo</h1>
        
        <div style={{ 
          background: 'white', 
          padding: '2rem', 
          borderRadius: '8px', 
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
          marginBottom: '2rem'
        }}>
          <p style={{ fontSize: '1.1rem', marginBottom: '2rem', color: '#666' }}>
            Click the button below to see your MP4 loading screen with audio:
          </p>
          
          <button 
            onClick={handleStartLoading}
            style={{
              padding: '15px 30px',
              fontSize: '1.2rem',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              transition: 'background-color 0.3s'
            }}
            onMouseOver={(e) => e.target.style.backgroundColor = '#0056b3'}
            onMouseOut={(e) => e.target.style.backgroundColor = '#007bff'}
          >
            Show Loading Screen
          </button>
        </div>

        <div style={{ 
          background: 'white', 
          padding: '2rem', 
          borderRadius: '8px', 
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
          textAlign: 'left'
        }}>
          <h3 style={{ color: '#333', marginBottom: '1rem' }}>Loading Screen Features:</h3>
          <ul style={{ color: '#666', lineHeight: '1.6' }}>
            <li>✅ Plays your MP4 video with audio</li>
            <li>✅ Full screen overlay</li>
            <li>✅ Auto-plays when shown</li>
            <li>✅ Smooth fade out transition</li>
            <li>✅ Loading spinner while video loads</li>
            <li>✅ Click anywhere to start if autoplay is blocked</li>
            <li>✅ Configurable duration (6 seconds)</li>
            <li>✅ Callback when complete</li>
          </ul>
        </div>

        <div style={{ marginTop: '2rem' }}>
          <a 
            href="/" 
            style={{ 
              color: '#007bff', 
              textDecoration: 'none',
              fontSize: '1.1rem'
            }}
          >
            ← Back to Homepage
          </a>
        </div>
      </div>

      {showLoading && (
        <LoadingScreen 
          onComplete={handleLoadingComplete}
          duration={6000}
        />
      )}
    </div>
  );
}



