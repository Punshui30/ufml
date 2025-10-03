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
            <span className="navbar-logo">
              <img src="/ufml-logo.svg" alt="UFML" />
            </span>
            <span className="navbar-text">
              <span className="navbar-title">UFML</span>
              <span className="navbar-subtitle">Un-Fuck My Life</span>
            </span>
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
                      background: 'transparent',
                      border: '1px solid var(--border)',
                      color: 'var(--text)',
                      cursor: 'pointer',
                      padding: 'var(--space-2) var(--space-3)',
                      borderRadius: 'var(--radius)',
                      fontSize: 'inherit'
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.backgroundColor = 'var(--bg-tertiary)';
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
