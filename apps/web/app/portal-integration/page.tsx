'use client'

import { useState, useEffect } from 'react'
import { ExternalLink, Shield, CreditCard, CheckCircle, AlertCircle } from 'lucide-react'

interface Portal {
  id: string
  name: string
  type: 'oauth' | 'iframe'
  available: boolean
  features: string[]
  auth_url?: string
  iframe_url?: string
}

export default function PortalIntegrationPage() {
  const [portals, setPortals] = useState<Portal[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedPortal, setSelectedPortal] = useState<Portal | null>(null)

  useEffect(() => {
    fetchPortals()
  }, [])

  const fetchPortals = async () => {
    try {
      const response = await fetch('/api/auth/portals')
      const data = await response.json()
      
      if (data.success) {
        setPortals(data.portals)
      }
    } catch (error) {
      console.error('Failed to fetch portals:', error)
      // Fallback portal data when backend is not available - COMING SOON
      setPortals([
        {
          id: 'credit_sesame',
          name: 'Credit Sesame',
          type: 'oauth',
          available: false,
          features: ['Free credit monitoring', 'Credit score tracking', 'Identity theft protection'],
          auth_url: 'https://www.creditsesame.com/login'
        },
        {
          id: 'experian_boost',
          name: 'Experian Boost',
          type: 'oauth',
          available: false,
          features: ['Instant credit score boost', 'Utility & telecom payments', 'Free credit monitoring'],
          auth_url: 'https://www.experian.com/consumer-products/experian-boost.html'
        },
        {
          id: 'myfico',
          name: 'MyFICO',
          type: 'oauth',
          available: false,
          features: ['FICO scores from all 3 bureaus', 'Credit monitoring', 'Score simulators'],
          auth_url: 'https://www.myfico.com/account/login'
        },
        {
          id: 'annual_credit_report',
          name: 'Annual Credit Report',
          type: 'iframe',
          available: false,
          features: ['Free annual reports', 'All 3 credit bureaus', 'Official government service'],
          iframe_url: 'https://www.annualcreditreport.com'
        },
        {
          id: 'credit_karma',
          name: 'Credit Karma',
          type: 'oauth',
          available: false,
          features: ['Free credit scores', 'Credit monitoring', 'Tax filing'],
          auth_url: 'https://www.creditkarma.com/auth/logon'
        },
        {
          id: 'credit_wise',
          name: 'Capital One CreditWise',
          type: 'oauth',
          available: false,
          features: ['Free credit monitoring', 'Credit score simulator', 'Dark web monitoring'],
          auth_url: 'https://www.capitalone.com/credit-cards/creditwise/'
        }
      ])
    } finally {
      setLoading(false)
    }
  }

  const handlePortalAuth = (portal: Portal) => {
    if (portal.type === 'oauth' && portal.auth_url) {
      // Redirect to OAuth flow
      window.location.href = portal.auth_url
    } else if (portal.type === 'iframe') {
      setSelectedPortal(portal)
    }
  }

  const handleIframeIntegration = async (portal: Portal) => {
    try {
      const userData = {
        // Get user data from session/localStorage
        first_name: "John",
        last_name: "Doe",
        email: "user@example.com"
      }

      const response = await fetch('/api/auth/iframe-integration', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          portal_id: portal.id,
          user_data: userData
        })
      })

      const result = await response.json()
      
      if (result.success) {
        alert(`Integration with ${portal.name} is ready! ${result.instructions?.step1}`)
      }
    } catch (error) {
      console.error('Iframe integration error:', error)
      alert('Integration failed. Please try again.')
    }
  }

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '50vh' 
      }}>
        <div>Loading available portals...</div>
      </div>
    )
  }

  return (
    <div style={{ padding: '2rem 1rem', maxWidth: '1200px', margin: '0 auto' }}>
      {/* Coming Soon Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
        color: 'white',
        padding: '1.5rem',
        borderRadius: '12px',
        marginBottom: '2rem',
        textAlign: 'center',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
      }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '0.5rem' }}>
          🚧 Coming Soon - Credit Monitoring Integration
        </h2>
        <p style={{ fontSize: '1rem', opacity: 0.9, margin: 0 }}>
          We're working on direct integrations with Credit Karma, Experian, MyFICO, and other credit monitoring services. 
          For now, please upload your credit reports manually using the "Upload Report" feature.
        </p>
      </div>

      <div style={{ marginBottom: '3rem' }}>
        <h1 style={{ 
          fontSize: '2.5rem', 
          fontWeight: '700', 
          marginBottom: '1rem',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          Credit Portal Integration
        </h1>
        <p style={{ 
          fontSize: '1.125rem', 
          color: '#6b7280', 
          marginBottom: '2rem',
          lineHeight: '1.6'
        }}>
          Connect your existing credit monitoring accounts to automatically import and analyze your credit data.
          No manual data entry required - we'll pull everything directly from your trusted sources.
        </p>
      </div>

      {/* Integration Benefits */}
      <div style={{
        background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)',
        border: '1px solid #0ea5e9',
        borderRadius: '12px',
        padding: '2rem',
        marginBottom: '3rem'
      }}>
        <h2 style={{ 
          fontSize: '1.5rem', 
          fontWeight: '600', 
          marginBottom: '1rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          <Shield className="w-6 h-6 text-blue-500" />
          Secure & Automated Integration
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <CheckCircle className="w-5 h-5 text-green-500" />
            <span style={{ fontSize: '0.875rem', color: '#374151' }}>
              OAuth 2.0 secure authentication
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <CheckCircle className="w-5 h-5 text-green-500" />
            <span style={{ fontSize: '0.875rem', color: '#374151' }}>
              Real-time data synchronization
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <CheckCircle className="w-5 h-5 text-green-500" />
            <span style={{ fontSize: '0.875rem', color: '#374151' }}>
              AI-powered dispute analysis
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <CheckCircle className="w-5 h-5 text-green-500" />
            <span style={{ fontSize: '0.875rem', color: '#374151' }}>
              No manual data entry required
            </span>
          </div>
        </div>
      </div>

      {/* PDF Upload Alternative */}
      <div style={{
        background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
        border: '1px solid #f59e0b',
        borderRadius: '12px',
        padding: '2rem',
        marginBottom: '3rem',
        textAlign: 'center'
      }}>
        <h2 style={{ 
          fontSize: '1.5rem', 
          fontWeight: '600', 
          marginBottom: '1rem',
          color: '#92400e'
        }}>
          Or Upload Your Credit Report PDF
        </h2>
        <p style={{ 
          fontSize: '1rem', 
          color: '#92400e', 
          marginBottom: '1.5rem',
          maxWidth: '600px',
          margin: '0 auto 1.5rem'
        }}>
          Don't want to connect accounts? Upload your existing credit report PDF and we'll extract all the data using AI.
        </p>
        <a 
          href="/reports/free-pull"
          style={{
            display: 'inline-block',
            background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
            color: 'white',
            textDecoration: 'none',
            padding: '0.75rem 2rem',
            borderRadius: '8px',
            fontWeight: '500',
            fontSize: '1rem'
          }}
        >
          Upload PDF Report
        </a>
      </div>

      {/* Available Portals */}
      <div style={{ marginBottom: '3rem' }}>
        <h2 style={{ 
          fontSize: '1.875rem', 
          fontWeight: '600', 
          marginBottom: '1.5rem' 
        }}>
          Available Credit Portals
        </h2>
        
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', 
          gap: '1.5rem' 
        }}>
          {portals.map((portal) => (
            <div key={portal.id} style={{
              background: 'white',
              border: '1px solid #e5e7eb',
              borderRadius: '12px',
              padding: '2rem',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              transition: 'all 0.2s ease-in-out'
            }}>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '0.75rem', 
                marginBottom: '1rem' 
              }}>
                <CreditCard className="w-6 h-6 text-blue-500" />
                <h3 style={{ 
                  fontSize: '1.25rem', 
                  fontWeight: '600',
                  color: '#111827'
                }}>
                  {portal.name}
                </h3>
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <p style={{ 
                  fontSize: '0.875rem', 
                  color: '#6b7280',
                  marginBottom: '0.75rem'
                }}>
                  Integration Type: <span style={{ 
                    fontWeight: '500', 
                    color: portal.type === 'oauth' ? '#10b981' : '#3b82f6',
                    textTransform: 'uppercase'
                  }}>
                    {portal.type}
                  </span>
                </p>

                <div style={{ marginBottom: '0.75rem' }}>
                  <span style={{ 
                    fontSize: '0.875rem', 
                    fontWeight: '500',
                    color: '#374151'
                  }}>
                    Available Data:
                  </span>
                  <div style={{ 
                    display: 'flex', 
                    flexWrap: 'wrap', 
                    gap: '0.25rem',
                    marginTop: '0.25rem'
                  }}>
                    {portal.features.map((feature, index) => (
                      <span key={index} style={{
                        background: '#f3f4f6',
                        color: '#374151',
                        padding: '0.125rem 0.5rem',
                        borderRadius: '4px',
                        fontSize: '0.75rem',
                        textTransform: 'capitalize'
                      }}>
                        {feature.replace('_', ' ')}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <button
                onClick={() => handlePortalAuth(portal)}
                disabled={!portal.available}
                style={{
                  width: '100%',
                  background: portal.available 
                    ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                    : '#9ca3af',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '0.75rem 1rem',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  cursor: portal.available ? 'pointer' : 'not-allowed',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  transition: 'all 0.2s ease-in-out'
                }}
                onMouseOver={(e) => {
                  if (portal.available) {
                    e.currentTarget.style.transform = 'translateY(-1px)'
                    e.currentTarget.style.boxShadow = '0 8px 15px rgba(0, 0, 0, 0.2)'
                  }
                }}
                onMouseOut={(e) => {
                  if (portal.available) {
                    e.currentTarget.style.transform = 'translateY(0)'
                    e.currentTarget.style.boxShadow = 'none'
                  }
                }}
              >
                <ExternalLink className="w-4 h-4" />
                {portal.available ? 'Connect Account' : 'Coming Soon'}
              </button>
              
              {portal.available && (
                <div style={{
                  marginTop: '1rem',
                  padding: '1rem',
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  fontSize: '0.875rem',
                  color: '#475569'
                }}>
                  <div style={{ fontWeight: '500', marginBottom: '0.5rem' }}>
                    Quick Connect:
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    <button
                      onClick={() => window.open(portal.auth_url || portal.iframe_url, '_blank')}
                      style={{
                        background: '#3b82f6',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        padding: '0.25rem 0.5rem',
                        fontSize: '0.75rem',
                        cursor: 'pointer'
                      }}
                    >
                      OAuth Login
                    </button>
                    <button
                      onClick={() => handleIframeIntegration(portal)}
                      style={{
                        background: '#10b981',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        padding: '0.25rem 0.5rem',
                        fontSize: '0.75rem',
                        cursor: 'pointer'
                      }}
                    >
                      Direct Import
                    </button>
                  </div>
                </div>
              )}

              {portal.id === 'annual_credit_report' && (
                <button
                  onClick={() => handleIframeIntegration(portal)}
                  style={{
                    width: '100%',
                    background: 'transparent',
                    color: '#3b82f6',
                    border: '1px solid #3b82f6',
                    borderRadius: '8px',
                    padding: '0.5rem 1rem',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    cursor: 'pointer',
                    marginTop: '0.5rem',
                    transition: 'all 0.2s ease-in-out'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.background = '#3b82f6'
                    e.currentTarget.style.color = 'white'
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.background = 'transparent'
                    e.currentTarget.style.color = '#3b82f6'
                  }}
                >
                  Get Instructions
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* How It Works */}
      <div style={{
        background: '#f9fafb',
        border: '1px solid #e5e7eb',
        borderRadius: '12px',
        padding: '2rem',
        marginBottom: '2rem'
      }}>
        <h2 style={{ 
          fontSize: '1.5rem', 
          fontWeight: '600', 
          marginBottom: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          <AlertCircle className="w-6 h-6 text-blue-500" />
          How Portal Integration Works
        </h2>
        
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
          gap: '2rem' 
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              borderRadius: '50%',
              width: '48px',
              height: '48px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.25rem',
              fontWeight: '600',
              margin: '0 auto 1rem'
            }}>
              1
            </div>
            <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '0.5rem' }}>
              Connect Your Account
            </h3>
            <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>
              Securely authenticate with your existing credit monitoring service using OAuth 2.0
            </p>
          </div>
          
          <div style={{ textAlign: 'center' }}>
            <div style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              borderRadius: '50%',
              width: '48px',
              height: '48px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.25rem',
              fontWeight: '600',
              margin: '0 auto 1rem'
            }}>
              2
            </div>
            <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '0.5rem' }}>
              Automatic Data Import
            </h3>
            <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>
              Your credit data is automatically imported and parsed into our AI analysis system
            </p>
          </div>
          
          <div style={{ textAlign: 'center' }}>
            <div style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              borderRadius: '50%',
              width: '48px',
              height: '48px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.25rem',
              fontWeight: '600',
              margin: '0 auto 1rem'
            }}>
              3
            </div>
            <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '0.5rem' }}>
              AI Analysis & Disputes
            </h3>
            <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>
              Get personalized dispute recommendations and automated dispute generation
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

