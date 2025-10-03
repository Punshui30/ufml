'use client';

import { useState, useEffect } from 'react';
import LoadingScreen from './LoadingScreen';

interface InitialLoadingScreenProps {
  children: React.ReactNode;
}

export default function InitialLoadingScreen({ children }: InitialLoadingScreenProps) {
  const [hasShownInitialLoading, setHasShownInitialLoading] = useState(false);
  const [showLoading, setShowLoading] = useState(true);

  useEffect(() => {
    // Check if this is the first visit (no localStorage flag)
    const hasVisited = localStorage.getItem('hasVisitedHomepage');
    
    if (!hasVisited) {
      // First visit - show loading screen
      setHasShownInitialLoading(true);
      localStorage.setItem('hasVisitedHomepage', 'true');
    } else {
      // Returning visitor - skip loading screen
      setShowLoading(false);
      setHasShownInitialLoading(true);
    }
  }, []);

  const handleLoadingComplete = () => {
    setShowLoading(false);
  };

  if (!hasShownInitialLoading) {
    return <div>Loading...</div>; // Brief loading state while checking localStorage
  }

  return (
    <>
      {showLoading && (
        <LoadingScreen 
          duration={6000}
          onComplete={handleLoadingComplete}
        />
      )}
      {children}
    </>
  );
}




