'use client';

import { useAuth } from '../auth-context';
import { useEffect } from 'react';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isLoggedIn, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && !isLoggedIn) {
      window.location.href = '/login';
    }
  }, [isLoading, isLoggedIn]);

  if (isLoading) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          fontSize: '1.2rem',
          color: 'var(--gray-600)'
        }}
      >
        Checking authentication...
      </div>
    );
  }

  if (!isLoggedIn) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          fontSize: '1.2rem',
          color: 'var(--gray-600)'
        }}
      >
        Redirecting to login...
      </div>
    );
  }

  return <>{children}</>;
}
