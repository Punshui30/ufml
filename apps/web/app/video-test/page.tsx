'use client';

import { useRef } from 'react';

export default function VideoTestPage() {
  const videoRef = useRef<HTMLVideoElement>(null);

  const handlePlay = () => {
    if (videoRef.current) {
      videoRef.current.play().catch(error => {
        console.error('Play failed:', error);
      });
    }
  };

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h1>Video Test Page</h1>
      
      <div style={{ marginBottom: '20px' }}>
        <button 
          onClick={handlePlay}
          style={{ 
            padding: '10px 20px', 
            fontSize: '1rem', 
            cursor: 'pointer',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px'
          }}
        >
          Play Video
        </button>
      </div>

      <video
        ref={videoRef}
        src="/lv_0_20250924132607.mp4"
        controls
        width="800"
        height="600"
        style={{ border: '2px solid #ccc', borderRadius: '8px' }}
        onError={(e) => {
          console.error('Video error:', e);
        }}
        onLoadStart={() => console.log('Video load started')}
        onLoadedData={() => console.log('Video data loaded')}
        onCanPlay={() => console.log('Video can play')}
      >
        Your browser does not support the video tag.
      </video>

      <div style={{ marginTop: '20px', fontSize: '0.9rem', color: '#666' }}>
        <p>If you can see and play this video, the file is working correctly.</p>
        <p>Check the browser console for any error messages.</p>
      </div>
    </div>
  );
}



