'use client';

import { useState } from 'react';
import { Building2, User, Mail, Lock, UserPlus } from 'lucide-react';
import { useAuth } from '../auth-context';

export default function RegisterPage() {
  const [userType, setUserType] = useState<'agency' | 'consumer'>('agency');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    companyName: '',
    phone: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  
  const { register } = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long');
      setIsLoading(false);
      return;
    }

    try {
      await register(formData.email, formData.password, userType, {
        firstName: formData.firstName,
        lastName: formData.lastName,
        companyName: formData.companyName,
        phone: formData.phone
      });
      setSuccess(true);
    } catch (err) {
      setError('Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
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
          boxShadow: '0 25px 50px rgba(0,0,0,0.15)',
          textAlign: 'center'
        }}>
          <div style={{
            width: '80px',
            height: '80px',
            background: 'linear-gradient(135deg, #10b981, #059669)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 2rem',
            boxShadow: '0 8px 32px rgba(16, 185, 129, 0.3)'
          }}>
            <UserPlus className="w-10 h-10 text-white" />
          </div>
          
          <h1 style={{ 
            color: '#1f2937', 
            fontSize: '2rem', 
            marginBottom: '1rem',
            fontWeight: 'bold'
          }}>
            Welcome to Credit Hardar!
          </h1>
          
          <p style={{ 
            color: '#6b7280', 
            marginBottom: '2rem',
            lineHeight: '1.6'
          }}>
            Your account has been created successfully. You can now access all the features of our platform.
          </p>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <a 
              href="/dashboard" 
              style={{ 
                background: '#1E47FF',
                color: 'white',
                padding: '1rem 2rem',
                borderRadius: '12px',
                textDecoration: 'none',
                fontWeight: '600',
                transition: 'all 0.2s ease'
              }}
            >
              Go to Dashboard
            </a>
            <a 
              href="/trial" 
              style={{ 
                background: 'transparent',
                color: '#1E47FF',
                padding: '1rem 2rem',
                borderRadius: '12px',
                textDecoration: 'none',
                fontWeight: '600',
                border: '2px solid #1E47FF',
                transition: 'all 0.2s ease'
              }}
            >
              Start Free Trial
            </a>
          </div>
        </div>
      </div>
    );
  }

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
        maxWidth: '600px',
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
            Create Your Account
          </h1>
          <p style={{ color: '#6b7280' }}>
            Join thousands of users transforming their credit with Credit Hardar
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
              <User className="inline-block w-4 h-4 mr-2" /> Consumer
            </button>
          </div>
        </div>

        {/* Registration Form */}
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
            <div>
              <label style={{ 
                display: 'block', 
                marginBottom: '0.5rem', 
                fontWeight: '600',
                color: '#374151'
              }}>
                First Name
              </label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
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
            <div>
              <label style={{ 
                display: 'block', 
                marginBottom: '0.5rem', 
                fontWeight: '600',
                color: '#374151'
              }}>
                Last Name
              </label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
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
          </div>

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
              name="email"
              value={formData.email}
              onChange={handleChange}
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

          {userType === 'agency' && (
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ 
                display: 'block', 
                marginBottom: '0.5rem', 
                fontWeight: '600',
                color: '#374151'
              }}>
                Company Name
              </label>
              <input
                type="text"
                name="companyName"
                value={formData.companyName}
                onChange={handleChange}
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
          )}

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '0.5rem', 
              fontWeight: '600',
              color: '#374151'
            }}>
              Phone Number
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
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

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '2rem' }}>
            <div>
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
                name="password"
                value={formData.password}
                onChange={handleChange}
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
            <div>
              <label style={{ 
                display: 'block', 
                marginBottom: '0.5rem', 
                fontWeight: '600',
                color: '#374151'
              }}>
                Confirm Password
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
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
            {isLoading ? 'Creating Account...' : 'Create Account'}
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
            Already have an account?
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <a 
              href="/login" 
              style={{ 
                color: '#1E47FF', 
                textDecoration: 'none',
                fontWeight: '600'
              }}
            >
              Sign In
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



