'use client';

import { useState, useEffect, useRef } from 'react';

interface LoadingScreenProps {
  onComplete?: () => void;
  duration?: number; // Duration in milliseconds
}

export default function LoadingScreen({ onComplete, duration = 5000 }: LoadingScreenProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
      onComplete?.();
    }, duration);

    // Aggressive autoplay attempts
    const attemptAutoplay = async () => {
      if (videoRef.current) {
        try {
          // Try with audio first
          videoRef.current.muted = false;
          await videoRef.current.play();
          console.log('AUTOPLAY WITH AUDIO SUCCESS!');
        } catch (error) {
          console.log('Autoplay with audio blocked:', error);
          
          // Try with muted first, then unmute
          try {
            videoRef.current.muted = true;
            await videoRef.current.play();
            console.log('Autoplay muted success, attempting to unmute...');
            
            // Try to unmute after playing
            setTimeout(() => {
              if (videoRef.current) {
                videoRef.current.muted = false;
                console.log('🔊 Attempted to unmute');
              }
            }, 100);
          } catch (mutedError) {
            console.log('Even muted autoplay failed:', mutedError);
          }
        }
      }
    };

    // Try immediately
    attemptAutoplay();
    
    // Try again after short delays
    setTimeout(attemptAutoplay, 50);
    setTimeout(attemptAutoplay, 200);
    setTimeout(attemptAutoplay, 1000);

    return () => clearTimeout(timer);
  }, [duration, onComplete]);

  const handleVideoLoad = () => {
    console.log('Video loaded successfully');
    setVideoLoaded(true);
    // Try multiple times to play with audio
    if (videoRef.current) {
      const tryPlayWithAudio = () => {
        videoRef.current!.muted = false;
        videoRef.current!.play().then(() => {
          console.log('Video playing with audio!');
        }).catch(error => {
          console.log('Autoplay with audio failed, trying muted:', error);
          videoRef.current!.muted = true;
          videoRef.current!.play().catch(mutedError => {
            console.log('Autoplay muted also failed:', mutedError);
          });
        });
      };
      
      // Try immediately
      tryPlayWithAudio();
      
      // Try again after a short delay
      setTimeout(tryPlayWithAudio, 100);
      setTimeout(tryPlayWithAudio, 500);
    }
  };

  const handleVideoEnd = () => {
    setIsLoading(false);
    onComplete?.();
  };

  const handleClick = () => {
    // Pure autoplay - no manual intervention needed
    console.log('Click detected - but autoplay should handle audio');
  };

  return (
    <div 
      onClick={handleClick}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: '#000',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        opacity: isLoading ? 1 : 0,
        transition: 'opacity 0.5s ease-out',
        pointerEvents: isLoading ? 'auto' : 'none',
        cursor: 'pointer'
      }}
    >
      <video
        ref={videoRef}
        src="/lv_0_20250924132607.mp4"
        autoPlay
        muted={false}
        loop={false}
        playsInline
        controls={false}
        preload="auto"
        webkit-playsinline="true"
        x5-playsinline="true"
        x-webkit-airplay="allow"
        onLoadedData={handleVideoLoad}
        onEnded={handleVideoEnd}
        onError={(e) => {
          console.error('Video load error:', e);
          setVideoLoaded(true); // Show content even if video fails
        }}
        onCanPlay={() => {
          console.log('Video can play');
          handleVideoLoad();
        }}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'contain',
          backgroundColor: '#000',
          opacity: videoLoaded ? 1 : 0,
          transition: 'opacity 0.3s ease-in'
        }}
      >
        Your browser does not support the video tag.
      </video>
      
      {/* Loading indicator if video hasn't loaded yet */}
      {!videoLoaded && (
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          color: 'white',
          fontSize: '1.2rem',
          textAlign: 'center'
        }}>
          <div style={{
            width: '50px',
            height: '50px',
            border: '3px solid rgba(255,255,255,0.3)',
            borderTop: '3px solid white',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 20px'
          }}></div>
          Loading video...
          <div style={{ fontSize: '1rem', marginTop: '15px', opacity: 1, fontWeight: 'bold' }}>
            🔊 Click anywhere to enable audio
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
