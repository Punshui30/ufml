'use client';

import { useAuth } from '../auth-context';
import { useState, useEffect } from 'react';

export default function Navigation() {
  const { user, logout, isLoading } = useAuth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogout = () => {
    logout();
  };

  return (
    <nav className="navbar">
      <div className="container">
        <div className="navbar-content">
          <a href="/" className="navbar-brand">
            <img src="/ufml-logo.png" alt="UFML Logo" style={{ width: '128px', height: '128px' }} />
          </a>
          <ul className="navbar-nav">
            <li><a href="/">Home</a></li>
            <li><a href="/demo">Demo</a></li>
            <li><a href="/pricing">Pricing</a></li>
            
            {mounted && !isLoading && user?.isAuthenticated ? (
              <>
                {user.type === 'agency' ? (
                  <>
                    <li><a href="/dashboard/">Dashboard</a></li>
                    <li><a href="/clients/">Clients</a></li>
                    <li><a href="/reports/">Reports</a></li>
                    <li><a href="/disputes/">Disputes</a></li>
                    <li><a href="/relief/">Relief Finder</a></li>
                  </>
                ) : (
                  <>
                    <li><a href="/consumer/dashboard/">My Credit</a></li>
                    <li><a href="/consumer/disputes/">My Disputes</a></li>
                    <li><a href="/consumer/relief/">Financial Relief</a></li>
                  </>
                )}
                <li>
                  <button 
                    onClick={handleLogout}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'inherit',
                      cursor: 'pointer',
                      padding: 'var(--space-2) var(--space-3)',
                      borderRadius: 'var(--radius)',
                      fontSize: 'inherit'
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.backgroundColor = 'var(--gray-100)';
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }}
                  >
                    Logout
                  </button>
                </li>
              </>
            ) : mounted && !isLoading ? (
              <>
                <li><a href="/trial">Free Trial</a></li>
                <li><a href="/login">Login</a></li>
              </>
            ) : (
              <li style={{ opacity: 0.5 }}>Loading...</li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}
