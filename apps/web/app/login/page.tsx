'use client';

import { useState } from 'react';
import { Building2 } from 'lucide-react';
import { useAuth } from '../auth-context';

export default function LoginPage() {
  const [userType, setUserType] = useState<'agency' | 'consumer'>('agency');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      await login(email, password, userType);
    } catch (err) {
      setError('Invalid credentials. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #1E47FF 0%, #163DE3 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem'
    }}>
      <div style={{ 
        background: 'white', 
        borderRadius: '20px', 
        padding: '3rem',
        maxWidth: '500px',
        width: '100%',
        boxShadow: '0 25px 50px rgba(0,0,0,0.15)'
      }}>
        
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1 style={{ 
            color: '#1f2937', 
            fontSize: '2rem', 
            marginBottom: '0.5rem',
            fontWeight: 'bold'
          }}>
            Welcome Back
          </h1>
          <p style={{ color: '#6b7280' }}>
            Sign in to your Credit Hardar account
          </p>
        </div>

        {/* User Type Selection */}
        <div style={{ marginBottom: '2rem' }}>
          <label style={{ 
            display: 'block', 
            marginBottom: '1rem', 
            fontWeight: '600',
            color: '#374151'
          }}>
            I am a:
          </label>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button
              type="button"
              onClick={() => setUserType('agency')}
              style={{
                flex: 1,
                padding: '1rem',
                border: userType === 'agency' ? '2px solid #1E47FF' : '2px solid #e5e7eb',
                borderRadius: '12px',
                background: userType === 'agency' ? '#eff6ff' : 'white',
                color: userType === 'agency' ? '#1E47FF' : '#6b7280',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              <Building2 className="inline-block w-4 h-4 mr-2" /> Credit Repair Agency
            </button>
            <button
              type="button"
              onClick={() => setUserType('consumer')}
              style={{
                flex: 1,
                padding: '1rem',
                border: userType === 'consumer' ? '2px solid #1E47FF' : '2px solid #e5e7eb',
                borderRadius: '12px',
                background: userType === 'consumer' ? '#eff6ff' : 'white',
                color: userType === 'consumer' ? '#1E47FF' : '#6b7280',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              👤 Consumer
            </button>
          </div>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '0.5rem', 
              fontWeight: '600',
              color: '#374151'
            }}>
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '1rem',
                border: '2px solid #e5e7eb',
                borderRadius: '12px',
                fontSize: '1rem',
                transition: 'border-color 0.2s ease'
              }}
              onFocus={(e) => e.target.style.borderColor = '#1E47FF'}
              onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
            />
          </div>

          <div style={{ marginBottom: '2rem' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '0.5rem', 
              fontWeight: '600',
              color: '#374151'
            }}>
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '1rem',
                border: '2px solid #e5e7eb',
                borderRadius: '12px',
                fontSize: '1rem',
                transition: 'border-color 0.2s ease'
              }}
              onFocus={(e) => e.target.style.borderColor = '#1E47FF'}
              onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
            />
          </div>

          {error && (
            <div style={{
              background: '#fef2f2',
              border: '1px solid #fecaca',
              color: '#dc2626',
              padding: '1rem',
              borderRadius: '8px',
              marginBottom: '1rem',
              fontSize: '0.875rem'
            }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            style={{
              width: '100%',
              padding: '1rem',
              background: isLoading ? '#9ca3af' : '#1E47FF',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              fontSize: '1.1rem',
              fontWeight: '600',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            {isLoading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        {/* Footer Links */}
        <div style={{ 
          textAlign: 'center', 
          marginTop: '2rem',
          paddingTop: '2rem',
          borderTop: '1px solid #e5e7eb'
        }}>
          <p style={{ color: '#6b7280', marginBottom: '1rem' }}>
            Don't have an account?
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <a 
              href="/register" 
              style={{ 
                color: '#1E47FF', 
                textDecoration: 'none',
                fontWeight: '600'
              }}
            >
              Create Account
            </a>
            <a 
              href="/trial" 
              style={{ 
                color: '#1E47FF', 
                textDecoration: 'none',
                fontWeight: '600'
              }}
            >
              Start Free Trial
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}