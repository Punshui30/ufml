'use client';

import { useState } from 'react';
import LoadingScreen from '../components/LoadingScreen';

export default function LoadingDemo() {
  const [showLoading, setShowLoading] = useState(false);

  const handleStartLoading = () => {
    setShowLoading(true);
  };

  const handleLoadingComplete = () => {
    setShowLoading(false);
  };

  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h1>Loading Screen Demo</h1>
      <p>Click the button below to see the loading screen with your MP4 video:</p>
      
      <button 
        onClick={handleStartLoading}
        style={{
          padding: '12px 24px',
          fontSize: '1.1rem',
          backgroundColor: '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
          marginTop: '20px'
        }}
      >
        Show Loading Screen
      </button>

      {showLoading && (
        <LoadingScreen 
          onComplete={handleLoadingComplete}
          duration={8000} // 8 seconds to show the full video
        />
      )}

      <div style={{ marginTop: '40px', padding: '20px', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
        <h3>Loading Screen Features:</h3>
        <ul style={{ textAlign: 'left', display: 'inline-block' }}>
          <li>✅ Plays your MP4 video with audio</li>
          <li>✅ Full screen overlay</li>
          <li>✅ Auto-plays when shown</li>
          <li>✅ Smooth fade out transition</li>
          <li>✅ Loading spinner while video loads</li>
          <li>✅ Configurable duration</li>
          <li>✅ Callback when complete</li>
        </ul>
      </div>
    </div>
  );
}




