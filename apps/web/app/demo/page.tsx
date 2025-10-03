'use client';

import { useState, useEffect } from 'react';
import { Building2, User, Play, Pause, RotateCcw, Film, Volume2 } from 'lucide-react';
import { premiumVoice } from '../services/premium-voice';

interface DemoStep {
  id: number;
  title: string;
  description: string;
  duration: number;
  pageUrl: string;
}

const B2B_DEMO_STEPS: DemoStep[] = [
  {
    id: 1,
    title: "Welcome to UFML",
    description: "Welcome to UFML (Un Fuck My Life), the professional credit repair platform designed specifically for agencies and credit repair businesses. Let me show you how our platform can transform your credit repair operations.",
    duration: 8,
    pageUrl: "/dashboard"
  },
  {
    id: 2,
    title: "Client Management Dashboard",
    description: "Here's your main dashboard where you can see all your active clients at a glance. Notice how we display key metrics like active clients, disputes sent, and pending responses in real-time.",
    duration: 10,
    pageUrl: "/dashboard"
  },
  {
    id: 3,
    title: "Adding New Clients",
    description: "Adding new clients is simple. Just click 'Add New Client' and fill in their information. Our system automatically creates a profile and begins tracking their credit repair journey.",
    duration: 12,
    pageUrl: "/clients/new"
  },
  {
    id: 4,
    title: "Credit Report Upload & Analysis",
    description: "Upload credit reports from all three bureaus. Our AI automatically analyzes each report, identifying disputable items and suggesting optimal strategies. This saves you hours of manual review.",
    duration: 15,
    pageUrl: "/reports/upload"
  },
  {
    id: 5,
    title: "ReliefFinder Integration",
    description: "Our exclusive ReliefFinder tool matches clients with government and private relief programs based on their financial profile. This adds tremendous value to your services and helps clients beyond just credit repair.",
    duration: 14,
    pageUrl: "/relief"
  },
  {
    id: 6,
    title: "Automated Dispute Generation",
    description: "Generate professional dispute letters with just a few clicks. Our AI creates customized letters based on the specific issues found in each client's credit report, ensuring maximum effectiveness.",
    duration: 13,
    pageUrl: "/disputes/create"
  },
  {
    id: 7,
    title: "Direct Mail Integration",
    description: "Send certified mail directly through our platform. Integration with major mail services ensures seamless delivery tracking and professional presentation to credit bureaus.",
    duration: 11,
    pageUrl: "/mail"
  },
  {
    id: 8,
    title: "Easy Sign-Up Process",
    description: "Getting started is simple. Sign up for your free trial and begin transforming your credit repair business today. No long-term contracts, cancel anytime.",
    duration: 11,
    pageUrl: "/trial"
  }
];

const B2C_DEMO_STEPS: DemoStep[] = [
  {
    id: 1,
    title: "Welcome to UFML",
    description: "Welcome to UFML (Un Fuck My Life), your personal credit repair companion. Whether you're looking to improve your credit score, remove negative items, or find financial relief programs, we're here to help you achieve financial freedom.",
    duration: 8,
    pageUrl: "/dashboard"
  },
  {
    id: 2,
    title: "Your Credit Dashboard",
    description: "Here's your personal credit dashboard where you can track your progress, see your current credit score, and monitor the status of your disputes. Everything is organized in one easy-to-understand interface.",
    duration: 10,
    pageUrl: "/dashboard"
  },
  {
    id: 3,
    title: "Upload Your Credit Reports",
    description: "Start by uploading your credit reports from all three bureaus. Our AI will analyze them and identify opportunities for improvement, including disputable items and potential errors.",
    duration: 12,
    pageUrl: "/reports/upload"
  },
  {
    id: 4,
    title: "AI-Powered Analysis",
    description: "Our advanced AI analyzes your credit reports and provides personalized recommendations. You'll see exactly which items to dispute and why, along with the potential impact on your credit score.",
    duration: 14,
    pageUrl: "/reports"
  },
  {
    id: 5,
    title: "ReliefFinder for You",
    description: "Discover government and private relief programs you may qualify for. Our ReliefFinder matches you with financial assistance programs, grants, and debt relief options based on your specific situation.",
    duration: 13,
    pageUrl: "/relief"
  },
  {
    id: 6,
    title: "Track Your Disputes",
    description: "Monitor the progress of your credit disputes in real-time. See when letters are sent, track responses from credit bureaus, and stay informed about every step of the process.",
    duration: 11,
    pageUrl: "/disputes"
  },
  {
    id: 7,
    title: "Get Started Today",
    description: "Ready to take control of your credit? Sign up for our consumer service and start your journey to better credit today. Our simple, transparent pricing makes credit repair accessible to everyone.",
    duration: 11,
    pageUrl: "/trial"
  }
];

export default function DemoPage() {
  // Add CSS for loading animation
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    `;
    document.head.appendChild(style);
    return () => {
      if (style.parentNode) {
        style.parentNode.removeChild(style);
      }
    };
  }, []);
  const [selectedDemo, setSelectedDemo] = useState<'b2b' | 'b2c' | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  // Removed voice settings - using default voice

  const currentSteps = selectedDemo === 'b2b' ? B2B_DEMO_STEPS : B2C_DEMO_STEPS;
  const currentStepData = currentSteps[currentStep];

  useEffect(() => {
    if (selectedDemo && currentStepData) {
      // Auto-play the narration when step changes
      console.log('Demo step changed, auto-playing natural voice...');
      const autoPlayTimer = setTimeout(() => {
        console.log('Calling playNaturalVoice...');
        playNaturalVoice();
      }, 500);
      
      return () => clearTimeout(autoPlayTimer);
    }
  }, [selectedDemo, currentStep, currentStepData]);

  // Removed voice loading - using default voice

  const playNaturalVoice = async () => {
    console.log('playNaturalVoice called');
    
    if (!currentStepData) {
      console.log('No current step data');
      return;
    }

    try {
      setIsPlaying(true);
      setIsPaused(false);
      
      console.log('Using premium voice service for:', currentStepData.description);
      await premiumVoice.speak(currentStepData.description);
      
      console.log('Natural voice playback completed');
      setIsPlaying(false);
      
      // Auto-advance to next step after completion
      if (currentStep < currentSteps.length - 1) {
        setTimeout(() => {
          setCurrentStep(prev => prev + 1);
        }, 1000);
      }
      
    } catch (error) {
      console.error('Natural voice playback failed:', error);
      setIsPlaying(false);
    }
  };

  const pauseAudio = () => {
    premiumVoice.stop();
    setIsPlaying(false);
    setIsPaused(true);
  };

  const resetDemo = () => {
    premiumVoice.stop();
    setSelectedDemo(null);
    setCurrentStep(0);
    setIsPlaying(false);
    setIsPaused(false);
  };

  // Removed voice change handler - using default voice

  if (!selectedDemo) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        background: 'linear-gradient(135deg, #2c2c2c 0%, #1a1a1a 100%)',
        padding: '2rem 1rem'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          
          {/* Back to Home */}
          <div style={{ marginBottom: '2rem' }}>
            <a href="/" style={{ 
              color: 'white', 
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontSize: '1.1rem'
            }}>
              ← Back to Home
            </a>
          </div>
          
          <div style={{ textAlign: 'center', padding: '2rem 0' }}>
            <h1 style={{ color: 'white', fontSize: '3rem', marginBottom: '1rem', fontWeight: 'bold' }}>
              <Film className="inline-block w-5 h-5 mr-2" /> Interactive Demo
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: '1.2rem', marginBottom: '3rem' }}>
              Choose your demo to see Credit Hardar in action with natural voice-guided walkthroughs
            </p>

            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', 
              gap: '2rem',
              maxWidth: '900px',
              margin: '0 auto'
            }}>
              
              {/* B2B Demo Card */}
              <div 
                style={{
                  background: '#3a3a3a',
                  border: '1px solid #4a4a4a',
                  borderRadius: '12px',
                  padding: '2rem',
                  textAlign: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
                onClick={() => setSelectedDemo('b2b')}
                onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
                onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
              >
                <div style={{ marginBottom: '1rem' }}><Building2 className="w-16 h-16 mx-auto" /></div>
                <h2 style={{ color: 'var(--blue-600)', marginBottom: '1rem' }}>For Credit Repair Agencies</h2>
                <p style={{ color: 'var(--gray-600)', marginBottom: '1.5rem' }}>
                  See how our platform can streamline your credit repair business operations, 
                  automate dispute generation, and help you scale your agency.
                </p>
                <div style={{ 
                  background: 'var(--blue-600)', 
                  color: 'white', 
                  padding: '0.75rem 1.5rem', 
                  borderRadius: '8px',
                  display: 'inline-block',
                  fontWeight: '600'
                }}>
                  Watch Agency Demo
                </div>
              </div>

              {/* B2C Demo Card */}
              <div 
                style={{
                  background: '#3a3a3a',
                  border: '1px solid #4a4a4a',
                  borderRadius: '12px',
                  padding: '2rem',
                  textAlign: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
                onClick={() => setSelectedDemo('b2c')}
                onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
                onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
              >
                <div style={{ marginBottom: '1rem' }}><User className="w-16 h-16 mx-auto" /></div>
                <h2 style={{ color: 'var(--green-600)', marginBottom: '1rem' }}>For Consumers</h2>
                <p style={{ color: 'var(--gray-600)', marginBottom: '1.5rem' }}>
                  Discover how Credit Hardar can help you improve your credit score, 
                  remove negative items, and find financial relief programs.
                </p>
                <div style={{ 
                  background: 'var(--green-600)', 
                  color: 'white', 
                  padding: '0.75rem 1.5rem', 
                  borderRadius: '8px',
                  display: 'inline-block',
                  fontWeight: '600'
                }}>
                  Watch Consumer Demo
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: '#2c2c2c',
      color: 'white'
    }}>
      {/* Demo Header */}
      <div style={{ background: '#3a3a3a', borderBottom: '1px solid #4a4a4a', padding: '1rem 0' }}>
        <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ margin: 0, fontSize: '1.5rem', color: 'white' }}>
              {selectedDemo === 'b2b' ? <><Building2 className="inline-block w-5 h-5 mr-2" />Agency Demo</> : <><User className="inline-block w-5 h-5 mr-2" />Consumer Demo</>}
            </h1>
            <p style={{ margin: 0, color: '#b0b0b0' }}>
              Step {currentStep + 1} of {currentSteps.length}: {currentStepData?.title}
            </p>
          </div>
          
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            {/* Demo Controls */}
            <button
              onClick={isPlaying ? pauseAudio : playNaturalVoice}
              style={{
                background: isPlaying ? '#ef4444' : '#10b981',
                border: 'none',
                color: 'white',
                padding: '0.75rem 1rem',
                borderRadius: '8px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              {isPlaying ? 'Pause' : 'Play'}
            </button>
            
            <button
              onClick={resetDemo}
              style={{
                background: 'transparent',
                border: '1px solid #4a4a4a',
                color: 'white',
                padding: '0.75rem 1rem',
                borderRadius: '8px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
            >
              <RotateCcw className="w-4 h-4" />
              Reset
            </button>
          </div>
        </div>
      </div>

      {/* Voice settings removed - using default voice */}

      {/* Demo Content */}
      <div style={{ padding: '2rem 1rem' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          
          {/* Progress Bar */}
          <div style={{ marginBottom: '2rem' }}>
            <div style={{
              background: '#4a4a4a',
              height: '8px',
              borderRadius: '4px',
              overflow: 'hidden'
            }}>
              <div style={{
                background: 'linear-gradient(90deg, #10b981, #059669)',
                height: '100%',
                width: `${((currentStep + 1) / currentSteps.length) * 100}%`,
                transition: 'width 0.3s ease'
              }} />
            </div>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              marginTop: '0.5rem',
              fontSize: '0.9rem',
              color: '#b0b0b0'
            }}>
              <span>Step {currentStep + 1} of {currentSteps.length}</span>
              <span>{Math.round(((currentStep + 1) / currentSteps.length) * 100)}% Complete</span>
            </div>
          </div>

          {/* Step Information */}
          <div style={{
            background: '#3a3a3a',
            border: '1px solid #4a4a4a',
            borderRadius: '12px',
            padding: '2rem',
            marginBottom: '2rem'
          }}>
            <h2 style={{ 
              color: 'white', 
              fontSize: '1.8rem', 
              marginBottom: '1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <Volume2 className="w-6 h-6 text-green-500" />
              {currentStepData?.title}
            </h2>
            <p style={{ 
              color: '#d0d0d0', 
              fontSize: '1.1rem', 
              lineHeight: '1.6',
              marginBottom: '1.5rem'
            }}>
              {currentStepData?.description}
            </p>
            
            {/* Navigation */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <button
                onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                disabled={currentStep === 0}
                style={{
                  background: currentStep === 0 ? '#4a4a4a' : '#2563eb',
                  border: 'none',
                  color: 'white',
                  padding: '0.75rem 1.5rem',
                  borderRadius: '8px',
                  cursor: currentStep === 0 ? 'not-allowed' : 'pointer',
                  opacity: currentStep === 0 ? 0.5 : 1
                }}
              >
                ← Previous
              </button>
              
              <div style={{ 
                display: 'flex', 
                gap: '0.5rem',
                alignItems: 'center'
              }}>
                {currentSteps.map((_, index) => (
                  <div
                    key={index}
                    style={{
                      width: '12px',
                      height: '12px',
                      borderRadius: '50%',
                      background: index <= currentStep ? '#10b981' : '#555555',
                      cursor: 'pointer'
                    }}
                    onClick={() => setCurrentStep(index)}
                  />
                ))}
              </div>
              
              <button
                onClick={() => setCurrentStep(Math.min(currentSteps.length - 1, currentStep + 1))}
                disabled={currentStep === currentSteps.length - 1}
                style={{
                  background: currentStep === currentSteps.length - 1 ? '#4a4a4a' : '#2563eb',
                  border: 'none',
                  color: 'white',
                  padding: '0.75rem 1.5rem',
                  borderRadius: '8px',
                  cursor: currentStep === currentSteps.length - 1 ? 'not-allowed' : 'pointer',
                  opacity: currentStep === currentSteps.length - 1 ? 0.5 : 1
                }}
              >
                Next →
              </button>
            </div>
          </div>

          {/* Live Page Preview */}
          <div style={{
            background: '#3a3a3a',
            border: '1px solid #4a4a4a',
            borderRadius: '12px',
            padding: '1rem',
            textAlign: 'center'
          }}>
            <h3 style={{ color: 'white', marginBottom: '1rem', fontSize: '1.1rem' }}>Live Page Preview</h3>
            <div style={{
              background: 'white',
              borderRadius: '8px',
              overflow: 'hidden',
              height: '300px',
              position: 'relative',
              boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2)',
              border: '1px solid #e5e7eb'
            }}>
              {/* Mock Browser Header */}
              <div style={{
                height: '32px',
                background: '#f8f9fa',
                borderBottom: '1px solid #e5e7eb',
                display: 'flex',
                alignItems: 'center',
                padding: '0 0.75rem',
                gap: '0.5rem'
              }}>
                <div style={{ display: 'flex', gap: '0.25rem' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ef4444' }}></div>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#f59e0b' }}></div>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981' }}></div>
                </div>
                <div style={{
                  flex: 1,
                  height: '20px',
                  background: 'white',
                  borderRadius: '8px',
                  border: '1px solid #d1d5db',
                  display: 'flex',
                  alignItems: 'center',
                  padding: '0 0.5rem',
                  margin: '0 0.5rem',
                  fontSize: '0.75rem',
                  color: '#6b7280'
                }}>
                  {currentStepData?.pageUrl}
                </div>
              </div>

              {/* Page Content - Show actual page content based on step */}
              <div style={{
                height: '268px', // 300px - 32px header
                padding: '0.5rem',
                background: 'white',
                overflow: 'hidden',
                fontSize: '0.7rem' // Scale down everything
              }}>
                {currentStepData?.pageUrl === '/dashboard' && (
                  <div style={{ padding: '0.5rem' }}>
                    {/* Dashboard Header */}
                    <div style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center', 
                      marginBottom: '0.75rem',
                      paddingBottom: '0.5rem',
                      borderBottom: '1px solid #e5e7eb'
                    }}>
                      <h1 style={{ fontSize: '1rem', fontWeight: 'bold', color: '#1f2937', margin: 0 }}>
                        Dashboard
                      </h1>
                      <div style={{ 
                        background: '#3b82f6', 
                        color: 'white', 
                        padding: '0.25rem 0.5rem', 
                        borderRadius: '4px',
                        fontSize: '0.6rem'
                      }}>
                        Agency View
                      </div>
                    </div>

                    {/* Stats Cards */}
                    <div style={{ 
                      display: 'grid', 
                      gridTemplateColumns: 'repeat(3, 1fr)', 
                      gap: '0.5rem', 
                      marginBottom: '0.75rem' 
                    }}>
                      <div style={{ 
                        background: '#f8fafc', 
                        padding: '0.5rem', 
                        borderRadius: '6px', 
                        border: '1px solid #e5e7eb',
                        textAlign: 'center'
                      }}>
                        <div style={{ fontSize: '0.8rem', fontWeight: 'bold', color: '#1f2937' }}>24</div>
                        <div style={{ fontSize: '0.6rem', color: '#6b7280' }}>Active Clients</div>
                      </div>
                      <div style={{ 
                        background: '#f8fafc', 
                        padding: '0.5rem', 
                        borderRadius: '6px', 
                        border: '1px solid #e5e7eb',
                        textAlign: 'center'
                      }}>
                        <div style={{ fontSize: '0.8rem', fontWeight: 'bold', color: '#1f2937' }}>156</div>
                        <div style={{ fontSize: '0.6rem', color: '#6b7280' }}>Disputes Sent</div>
                      </div>
                      <div style={{ 
                        background: '#f8fafc', 
                        padding: '0.5rem', 
                        borderRadius: '6px', 
                        border: '1px solid #e5e7eb',
                        textAlign: 'center'
                      }}>
                        <div style={{ fontSize: '0.8rem', fontWeight: 'bold', color: '#1f2937' }}>12</div>
                        <div style={{ fontSize: '0.6rem', color: '#6b7280' }}>Pending</div>
                      </div>
                    </div>

                    {/* Recent Activity */}
                    <div style={{ marginBottom: '0.5rem' }}>
                      <h3 style={{ fontSize: '0.7rem', fontWeight: '600', color: '#374151', marginBottom: '0.25rem' }}>
                        Recent Activity
                      </h3>
                      <div style={{ fontSize: '0.6rem', color: '#6b7280' }}>
                        • John Smith - Dispute sent to Experian<br/>
                        • Sarah Johnson - ReliefFinder match found<br/>
                        • Mike Davis - Credit score improved +25pts
                      </div>
                    </div>

                    {/* Quick Actions */}
                    <div style={{ display: 'flex', gap: '0.25rem' }}>
                      <div style={{ 
                        background: '#3b82f6', 
                        color: 'white', 
                        padding: '0.25rem 0.5rem', 
                        borderRadius: '4px',
                        fontSize: '0.6rem'
                      }}>
                        Add Client
                      </div>
                      <div style={{ 
                        background: '#10b981', 
                        color: 'white', 
                        padding: '0.25rem 0.5rem', 
                        borderRadius: '4px',
                        fontSize: '0.6rem'
                      }}>
                        Send Disputes
                      </div>
                    </div>
                  </div>
                )}

                {currentStepData?.pageUrl === '/reports/upload' && (
                  <div style={{ padding: '0.5rem' }}>
                    <h1 style={{ fontSize: '1rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '0.75rem' }}>
                      Upload Credit Reports
                    </h1>
                    <div style={{ 
                      border: '2px dashed #d1d5db', 
                      borderRadius: '8px', 
                      padding: '1rem', 
                      textAlign: 'center',
                      background: '#f9fafb'
                    }}>
                      <div style={{ fontSize: '0.8rem', color: '#6b7280', marginBottom: '0.5rem' }}>
                        📄 Drop PDF files here or click to browse
                      </div>
                      <div style={{ 
                        background: '#3b82f6', 
                        color: 'white', 
                        padding: '0.25rem 0.75rem', 
                        borderRadius: '4px',
                        fontSize: '0.6rem',
                        display: 'inline-block'
                      }}>
                        Choose Files
                      </div>
                    </div>
                    <div style={{ fontSize: '0.6rem', color: '#6b7280', marginTop: '0.5rem' }}>
                      Supported: PDF files from Experian, TransUnion, Equifax
                    </div>
                  </div>
                )}

                {currentStepData?.pageUrl === '/relief' && (
                  <div style={{ padding: '0.5rem' }}>
                    <h1 style={{ fontSize: '1rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '0.75rem' }}>
                      ReliefFinder
                    </h1>
                    <div style={{ 
                      background: '#f0f9ff', 
                      border: '1px solid #0ea5e9', 
                      borderRadius: '6px', 
                      padding: '0.5rem',
                      marginBottom: '0.5rem'
                    }}>
                      <div style={{ fontSize: '0.7rem', fontWeight: '600', color: '#0c4a6e', marginBottom: '0.25rem' }}>
                        🎯 3 Relief Programs Found
                      </div>
                      <div style={{ fontSize: '0.6rem', color: '#0369a1' }}>
                        Based on your financial profile
                      </div>
                    </div>
                    <div style={{ fontSize: '0.6rem', color: '#6b7280' }}>
                      • SNAP Food Assistance - 85% match<br/>
                      • Medicaid Health Insurance - 92% match<br/>
                      • Section 8 Housing - 78% match
                    </div>
                  </div>
                )}

                {currentStepData?.pageUrl === '/disputes/create' && (
                  <div style={{ padding: '0.5rem' }}>
                    <h1 style={{ fontSize: '1rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '0.75rem' }}>
                      Create Dispute
                    </h1>
                    <div style={{ 
                      background: '#fef3c7', 
                      border: '1px solid #f59e0b', 
                      borderRadius: '6px', 
                      padding: '0.5rem',
                      marginBottom: '0.5rem'
                    }}>
                      <div style={{ fontSize: '0.7rem', fontWeight: '600', color: '#92400e', marginBottom: '0.25rem' }}>
                        💡 5 Dispute Opportunities Found
                      </div>
                      <div style={{ fontSize: '0.6rem', color: '#b45309' }}>
                        High-confidence disputes ready to send
                      </div>
                    </div>
                    <div style={{ fontSize: '0.6rem', color: '#6b7280' }}>
                      • Capital One - Not Mine (95% success)<br/>
                      • Chase Bank - Balance Incorrect (75% success)<br/>
                      • Bank of America - Never Late (80% success)
                    </div>
                  </div>
                )}

                {currentStepData?.pageUrl === '/mail' && (
                  <div style={{ padding: '0.5rem' }}>
                    <h1 style={{ fontSize: '1rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '0.75rem' }}>
                      Mail Service
                    </h1>
                    <div style={{ 
                      background: '#f0fdf4', 
                      border: '1px solid #22c55e', 
                      borderRadius: '6px', 
                      padding: '0.5rem',
                      marginBottom: '0.5rem'
                    }}>
                      <div style={{ fontSize: '0.7rem', fontWeight: '600', color: '#166534', marginBottom: '0.25rem' }}>
                        ✅ Service Ready
                      </div>
                      <div style={{ fontSize: '0.6rem', color: '#15803d' }}>
                        Certified mail delivery enabled
                      </div>
                    </div>
                    <div style={{ fontSize: '0.6rem', color: '#6b7280' }}>
                      • 42 letters sent this month<br/>
                      • 98% delivery success rate<br/>
                      • $4.40 average cost per letter
                    </div>
                  </div>
                )}

                {currentStepData?.pageUrl === '/trial' && (
                  <div style={{ padding: '0.5rem', textAlign: 'center' }}>
                    <h1 style={{ fontSize: '1rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '0.75rem' }}>
                      Start Your Free Trial
                    </h1>
                    <div style={{ 
                      background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)', 
                      color: 'white', 
                      padding: '0.75rem', 
                      borderRadius: '8px',
                      marginBottom: '0.5rem'
                    }}>
                      <div style={{ fontSize: '0.8rem', fontWeight: 'bold', marginBottom: '0.25rem' }}>
                        14-Day Free Trial
                      </div>
                      <div style={{ fontSize: '0.6rem', opacity: 0.9 }}>
                        No credit card required
                      </div>
                    </div>
                    <div style={{ fontSize: '0.6rem', color: '#6b7280' }}>
                      Full access to all features
                    </div>
                  </div>
                )}

                {/* Default fallback */}
                {!currentStepData?.pageUrl || !['/dashboard', '/reports/upload', '/relief', '/disputes/create', '/mail', '/trial'].includes(currentStepData.pageUrl) && (
                  <div style={{ 
                    height: '100%', 
                    display: 'flex', 
                    flexDirection: 'column', 
                    justifyContent: 'center', 
                    alignItems: 'center',
                    textAlign: 'center',
                    padding: '1rem'
                  }}>
                    <div style={{
                      width: '40px',
                      height: '40px',
                      background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                      borderRadius: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: '0.75rem',
                      boxShadow: '0 2px 8px rgba(59, 130, 246, 0.3)'
                    }}>
                      <span style={{ color: 'white', fontSize: '1rem', fontWeight: 'bold' }}>CH</span>
                    </div>
                    
                    <h2 style={{
                      fontSize: '0.8rem',
                      fontWeight: 'bold',
                      color: '#1f2937',
                      marginBottom: '0.5rem',
                      lineHeight: '1.2'
                    }}>
                      {currentStepData?.title || 'Welcome to Credit Hardar'}
                    </h2>
                    
                    <p style={{
                      fontSize: '0.6rem',
                      color: '#6b7280',
                      maxWidth: '200px',
                      lineHeight: '1.4',
                      marginBottom: '0.75rem'
                    }}>
                      {currentStepData?.description || 'Your personal credit repair companion.'}
                    </p>

                    <div style={{
                      display: 'flex',
                      gap: '0.5rem',
                      justifyContent: 'center'
                    }}>
                      <div style={{
                        padding: '0.25rem 0.5rem',
                        background: '#3b82f6',
                        color: 'white',
                        borderRadius: '4px',
                        fontSize: '0.6rem',
                        fontWeight: '500'
                      }}>
                        Get Started
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <p style={{ 
              color: '#a0a0a0', 
              fontSize: '0.8rem', 
              marginTop: '0.75rem',
              fontStyle: 'italic'
            }}>
              Interactive preview of the actual Credit Hardar platform
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}