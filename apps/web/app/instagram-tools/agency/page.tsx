'use client';

import { useState } from 'react';
import { Rocket, Smartphone, Search, TrendingUp, Users, Target, BarChart3, Zap, Share2, Instagram } from 'lucide-react';

interface LeadData {
  name: string;
  email: string;
  phone: string;
  currentScore: number;
  issues: string[];
  source: string;
}

export default function AgencyInstagramTools() {
  const [selectedTool, setSelectedTool] = useState<'simulator' | 'relief-bot' | 'challenge'>('simulator');
  const [leads, setLeads] = useState<LeadData[]>([]);

  const tools = [
    {
      id: 'simulator',
      title: 'Credit Score Simulator',
      description: 'Interactive calculator that shows potential credit improvement',
      icon: <Rocket className="w-6 h-6" />,
      leads: 24,
      conversion_rate: '18%',
      avg_value: '$2,400'
    },
    {
      id: 'relief-bot',
      title: 'Relief Finder Bot',
      description: 'Automated responses to find financial assistance programs',
      icon: <Search className="w-6 h-6" />,
      leads: 18,
      conversion_rate: '22%',
      avg_value: '$3,100'
    },
    {
      id: 'challenge',
      title: 'Credit Score Challenge',
      description: '30-day challenge to engage and convert prospects',
      icon: <Target className="w-6 h-6" />,
      leads: 12,
      conversion_rate: '35%',
      avg_value: '$4,200'
    },
    {
      id: 'story-templates',
      title: 'Story Templates',
      description: 'Pre-designed Instagram story templates for credit repair content',
      icon: <Instagram className="w-6 h-6" />,
      leads: 31,
      conversion_rate: '12%',
      avg_value: '$1,800'
    },
    {
      id: 'viral-tools',
      title: 'Viral Credit Tools',
      description: 'Shareable credit improvement calculators and quizzes',
      icon: <Share2 className="w-6 h-6" />,
      leads: 45,
      conversion_rate: '8%',
      avg_value: '$1,200'
    },
    {
      id: 'lead-scoring',
      title: 'Lead Scoring AI',
      description: 'AI-powered lead qualification and scoring system',
      icon: <BarChart3 className="w-6 h-6" />,
      leads: 67,
      conversion_rate: '28%',
      avg_value: '$3,800'
    }
  ];

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #1E47FF 0%, #163DE3 100%)',
      padding: '2rem 1rem'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h1 style={{ 
            color: 'white', 
            fontSize: '2.5rem', 
            marginBottom: '1rem',
            fontWeight: 'bold'
          }}>
            <Smartphone className="inline-block w-5 h-5 mr-2" /> Instagram Lead Generation Tools
          </h1>
          <p style={{ 
            color: 'rgba(255,255,255,0.9)', 
            fontSize: '1.2rem',
            maxWidth: '600px',
            margin: '0 auto'
          }}>
            Professional tools designed to convert Instagram traffic into qualified leads for your credit repair agency
          </p>
        </div>

        {/* Tool Selection */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
          gap: '2rem',
          marginBottom: '3rem'
        }}>
          {tools.map((tool) => (
            <div
              key={tool.id}
              onClick={() => setSelectedTool(tool.id as any)}
              style={{
                background: 'white',
                borderRadius: '16px',
                padding: '2rem',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                border: selectedTool === tool.id ? '3px solid #22c55e' : '3px solid transparent',
                transform: selectedTool === tool.id ? 'translateY(-5px)' : 'translateY(0)',
                boxShadow: selectedTool === tool.id ? '0 20px 40px rgba(0,0,0,0.15)' : '0 10px 20px rgba(0,0,0,0.1)'
              }}
            >
              <div style={{ 
                fontSize: '3rem', 
                marginBottom: '1rem',
                textAlign: 'center'
              }}>
                {tool.icon}
              </div>
              <h3 style={{ 
                color: '#1f2937', 
                fontSize: '1.5rem', 
                marginBottom: '0.5rem',
                textAlign: 'center'
              }}>
                {tool.title}
              </h3>
              <p style={{ 
                color: '#6b7280', 
                marginBottom: '1rem',
                textAlign: 'center'
              }}>
                {tool.description}
              </p>
              <div style={{
                background: '#f0f9ff',
                border: '1px solid #0ea5e9',
                borderRadius: '8px',
                padding: '0.5rem',
                textAlign: 'center'
              }}>
                <span style={{ color: '#0369a1', fontWeight: '600' }}>
                  {tool.leads} leads this month
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Tool Content */}
        <div style={{ 
          background: 'white', 
          borderRadius: '20px', 
          padding: '3rem',
          boxShadow: '0 25px 50px rgba(0,0,0,0.15)'
        }}>
          {selectedTool === 'simulator' && <CreditScoreSimulator />}
          {selectedTool === 'relief-bot' && <ReliefFinderBot />}
          {selectedTool === 'challenge' && <CreditScoreChallenge />}
        </div>
      </div>
    </div>
  );
}

function CreditScoreSimulator() {
  const [currentScore, setCurrentScore] = useState(580);
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate lead capture
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Redirect to simulator
    if (typeof window !== 'undefined') {
      window.open('/instagram-tools', '_blank');
    }
    setIsSubmitting(false);
  };

  return (
    <div>
      <h2 style={{ 
        color: '#1f2937', 
        fontSize: '2rem', 
        marginBottom: '1rem',
        textAlign: 'center'
      }}>
        <Rocket className="inline-block w-5 h-5 mr-2" /> Credit Score Simulator
      </h2>
      <p style={{ 
        color: '#6b7280', 
        marginBottom: '2rem',
        textAlign: 'center',
        fontSize: '1.1rem'
      }}>
        Interactive tool that shows potential credit improvement. Perfect for Instagram stories and posts.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        {/* Preview */}
        <div>
          <h3 style={{ color: '#374151', marginBottom: '1rem' }}>Preview</h3>
          <div style={{ 
            background: '#f9fafb', 
            border: '2px dashed #d1d5db',
            borderRadius: '12px',
            padding: '2rem',
            textAlign: 'center'
          }}>
            <div style={{ marginBottom: '1rem' }}><Smartphone className="w-16 h-16 mx-auto text-blue-600" /></div>
            <p style={{ color: '#6b7280' }}>
              Mobile-optimized credit score simulator
            </p>
          </div>
        </div>

        {/* Setup */}
        <div>
          <h3 style={{ color: '#374151', marginBottom: '1rem' }}>Setup</h3>
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ 
                display: 'block', 
                marginBottom: '0.5rem', 
                fontWeight: '600',
                color: '#374151'
              }}>
                Your Email (for lead notifications)
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '2px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '1rem'
                }}
              />
            </div>
            
            <button
              type="submit"
              disabled={isSubmitting}
              style={{
                width: '100%',
                padding: '1rem',
                background: isSubmitting ? '#9ca3af' : '#1E47FF',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: isSubmitting ? 'not-allowed' : 'pointer'
              }}
            >
              {isSubmitting ? 'Setting up...' : <><Rocket className="inline-block w-4 h-4 mr-2" />Launch Simulator</>}
            </button>
          </form>

          <div style={{ 
            background: '#f0f9ff', 
            border: '1px solid #0ea5e9',
            borderRadius: '8px',
            padding: '1rem',
            marginTop: '1rem'
          }}>
            <h4 style={{ color: '#0369a1', marginBottom: '0.5rem' }}>How to Use:</h4>
            <ul style={{ color: '#0369a1', fontSize: '0.875rem', paddingLeft: '1rem' }}>
              <li>Share the link in your Instagram bio</li>
              <li>Post about it in stories with "Link in bio"</li>
              <li>Use in comments: "Check my bio for free credit score calculator"</li>
              <li>All leads automatically captured with contact info</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

function ReliefFinderBot() {
  const [zipCode, setZipCode] = useState('');
  const [income, setIncome] = useState('');
  const [programs, setPrograms] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSearching(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Mock relief programs
    setPrograms([
      {
        name: 'Emergency Rental Assistance',
        amount: '$2,500/month',
        deadline: 'Ongoing',
        type: 'Housing'
      },
      {
        name: 'Food Assistance Program',
        amount: '$400/month',
        deadline: 'No deadline',
        type: 'Basic Needs'
      },
      {
        name: 'Utility Bill Assistance',
        amount: '$500 one-time',
        deadline: 'Dec 31, 2024',
        type: 'Utilities'
      }
    ]);
    
    setIsSearching(false);
  };

  return (
    <div>
      <h2 style={{ 
        color: '#1f2937', 
        fontSize: '2rem', 
        marginBottom: '1rem',
        textAlign: 'center'
      }}>
        🤖 Relief Finder Bot
      </h2>
      <p style={{ 
        color: '#6b7280', 
        marginBottom: '2rem',
        textAlign: 'center',
        fontSize: '1.1rem'
      }}>
        Automated responses to find financial assistance programs for your prospects.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        {/* Bot Interface */}
        <div>
          <h3 style={{ color: '#374151', marginBottom: '1rem' }}>Bot Responses</h3>
          <div style={{ 
            background: '#f9fafb', 
            border: '2px solid #e5e7eb',
            borderRadius: '12px',
            padding: '1.5rem'
          }}>
            <div style={{ marginBottom: '1rem' }}>
              <div style={{ 
                background: '#eff6ff', 
                padding: '0.75rem', 
                borderRadius: '8px',
                marginBottom: '0.5rem'
              }}>
                <strong>User:</strong> "I'm struggling to pay rent"
              </div>
              <div style={{ 
                background: '#f0fdf4', 
                padding: '0.75rem', 
                borderRadius: '8px'
              }}>
                <strong>Bot:</strong> "I can help! DM me your zip code and monthly income. I'll find rental assistance programs you qualify for."
              </div>
            </div>
            
            <div style={{ 
              background: '#eff6ff', 
              padding: '0.75rem', 
              borderRadius: '8px',
              marginBottom: '0.5rem'
            }}>
              <strong>User:</strong> "Can't afford groceries this month"
            </div>
            <div style={{ 
              background: '#f0fdf4', 
              padding: '0.75rem', 
              borderRadius: '8px'
            }}>
              <strong>Bot:</strong> "I found 3 food assistance programs in your area. DM me for details and application help."
            </div>
          </div>
        </div>

        {/* Test Search */}
        <div>
          <h3 style={{ color: '#374151', marginBottom: '1rem' }}>Test the Bot</h3>
          <form onSubmit={handleSearch}>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ 
                display: 'block', 
                marginBottom: '0.5rem', 
                fontWeight: '600',
                color: '#374151'
              }}>
                Zip Code
              </label>
              <input
                type="text"
                value={zipCode}
                onChange={(e) => setZipCode(e.target.value)}
                placeholder="90210"
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '2px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '1rem'
                }}
              />
            </div>
            
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ 
                display: 'block', 
                marginBottom: '0.5rem', 
                fontWeight: '600',
                color: '#374151'
              }}>
                Monthly Income
              </label>
              <input
                type="text"
                value={income}
                onChange={(e) => setIncome(e.target.value)}
                placeholder="$3,000"
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '2px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '1rem'
                }}
              />
            </div>
            
            <button
              type="submit"
              disabled={isSearching}
              style={{
                width: '100%',
                padding: '1rem',
                background: isSearching ? '#9ca3af' : '#22c55e',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: isSearching ? 'not-allowed' : 'pointer'
              }}
            >
              {isSearching ? 'Searching...' : <><Search className="inline-block w-4 h-4 mr-2" />Find Programs</>}
            </button>
          </form>

          {programs.length > 0 && (
            <div style={{ marginTop: '1rem' }}>
              <h4 style={{ color: '#374151', marginBottom: '0.5rem' }}>Found Programs:</h4>
              {programs.map((program, index) => (
                <div key={index} style={{
                  background: '#f0f9ff',
                  border: '1px solid #0ea5e9',
                  borderRadius: '8px',
                  padding: '0.75rem',
                  marginBottom: '0.5rem'
                }}>
                  <div style={{ fontWeight: '600', color: '#0369a1' }}>{program.name}</div>
                  <div style={{ fontSize: '0.875rem', color: '#0369a1' }}>
                    {program.amount} • {program.type}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function CreditScoreChallenge() {
  const [challengeType, setChallengeType] = useState<'viral' | 'educational' | 'interactive'>('viral');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateChallenge = async () => {
    setIsGenerating(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsGenerating(false);
  };

  return (
    <div>
      <h2 style={{ 
        color: '#1f2937', 
        fontSize: '2rem', 
        marginBottom: '1rem',
        textAlign: 'center'
      }}>
        <Target className="inline-block w-5 h-5 mr-2" /> Credit Score Challenge
      </h2>
      <p style={{ 
        color: '#6b7280', 
        marginBottom: '2rem',
        textAlign: 'center',
        fontSize: '1.1rem'
      }}>
        Genius-level viral challenge that converts without giving away freebies. Pure engagement gold.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        {/* Challenge Types */}
        <div>
          <h3 style={{ color: '#374151', marginBottom: '1rem' }}>Challenge Types</h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <button
              onClick={() => setChallengeType('viral')}
              style={{
                background: challengeType === 'viral' ? '#fef3c7' : '#f9fafb',
                border: challengeType === 'viral' ? '2px solid #f59e0b' : '2px solid #e5e7eb',
                borderRadius: '8px',
                padding: '1rem',
                cursor: 'pointer',
                textAlign: 'left'
              }}
            >
              <div style={{ fontWeight: '600', color: '#374151', marginBottom: '0.25rem' }}>
                🚀 Viral Challenge
              </div>
              <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                "Guess my credit score" - No freebies, pure engagement
              </div>
            </button>

            <button
              onClick={() => setChallengeType('educational')}
              style={{
                background: challengeType === 'educational' ? '#fef3c7' : '#f9fafb',
                border: challengeType === 'educational' ? '2px solid #f59e0b' : '2px solid #e5e7eb',
                borderRadius: '8px',
                padding: '1rem',
                cursor: 'pointer',
                textAlign: 'left'
              }}
            >
              <div style={{ fontWeight: '600', color: '#374151', marginBottom: '0.25rem' }}>
                📚 Educational Challenge
              </div>
              <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                "30-day credit improvement" - Build authority and trust
              </div>
            </button>

            <button
              onClick={() => setChallengeType('interactive')}
              style={{
                background: challengeType === 'interactive' ? '#fef3c7' : '#f9fafb',
                border: challengeType === 'interactive' ? '2px solid #f59e0b' : '2px solid #e5e7eb',
                borderRadius: '8px',
                padding: '1rem',
                cursor: 'pointer',
                textAlign: 'left'
              }}
            >
              <div style={{ fontWeight: '600', color: '#374151', marginBottom: '0.25rem' }}>
                🎯 Interactive Challenge
              </div>
              <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                "Credit score prediction game" - Gamified engagement
              </div>
            </button>
          </div>
        </div>

        {/* Challenge Preview */}
        <div>
          <h3 style={{ color: '#374151', marginBottom: '1rem' }}>Preview</h3>
          
          <div style={{
            background: '#f9fafb',
            border: '2px solid #e5e7eb',
            borderRadius: '12px',
            padding: '1.5rem',
            marginBottom: '1rem'
          }}>
            {challengeType === 'viral' && (
              <div>
                <div style={{ 
                  background: 'linear-gradient(135deg, #1E47FF, #163DE3)', 
                  color: 'white', 
                  padding: '1rem', 
                  borderRadius: '8px',
                  textAlign: 'center',
                  marginBottom: '1rem'
                }}>
                  <h4 style={{ margin: '0 0 0.5rem 0' }}>🎯 GUESS MY CREDIT SCORE</h4>
                  <p style={{ margin: 0, fontSize: '0.875rem', opacity: 0.9 }}>
                    I paid off $15,000 in debt this year. What's my score now?
                  </p>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                  <button style={{
                    background: '#22c55e',
                    color: 'white',
                    border: 'none',
                    padding: '0.5rem 1rem',
                    borderRadius: '6px',
                    fontSize: '0.875rem'
                  }}>
                    720+
                  </button>
                  <button style={{
                    background: '#f59e0b',
                    color: 'white',
                    border: 'none',
                    padding: '0.5rem 1rem',
                    borderRadius: '6px',
                    fontSize: '0.875rem'
                  }}>
                    650-719
                  </button>
                  <button style={{
                    background: '#ef4444',
                    color: 'white',
                    border: 'none',
                    padding: '0.5rem 1rem',
                    borderRadius: '6px',
                    fontSize: '0.875rem'
                  }}>
                    Under 650
                  </button>
                </div>
                <p style={{ 
                  textAlign: 'center', 
                  fontSize: '0.75rem', 
                  color: '#6b7280', 
                  marginTop: '0.5rem' 
                }}>
                  Comment your guess! Answer in next story 👆
                </p>
              </div>
            )}

            {challengeType === 'educational' && (
              <div>
                <div style={{ 
                  background: 'linear-gradient(135deg, #10b981, #059669)', 
                  color: 'white', 
                  padding: '1rem', 
                  borderRadius: '8px',
                  textAlign: 'center',
                  marginBottom: '1rem'
                }}>
                  <h4 style={{ margin: '0 0 0.5rem 0' }}>📚 30-DAY CREDIT CHALLENGE</h4>
                  <p style={{ margin: 0, fontSize: '0.875rem', opacity: 0.9 }}>
                    Day 1: Check your credit report for errors
                  </p>
                </div>
                <div style={{ 
                  background: '#f0f9ff', 
                  border: '1px solid #0ea5e9',
                  borderRadius: '8px',
                  padding: '0.75rem',
                  marginBottom: '0.5rem'
                }}>
                  <div style={{ fontWeight: '600', color: '#0369a1' }}>Today's Task:</div>
                  <div style={{ fontSize: '0.875rem', color: '#0369a1' }}>
                    Download your free credit report and look for these 5 common errors...
                  </div>
                </div>
                <p style={{ 
                  textAlign: 'center', 
                  fontSize: '0.75rem', 
                  color: '#6b7280', 
                  marginTop: '0.5rem' 
                }}>
                  Follow for daily tips! Link in bio for free report 👆
                </p>
              </div>
            )}

            {challengeType === 'interactive' && (
              <div>
                <div style={{ 
                  background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)', 
                  color: 'white', 
                  padding: '1rem', 
                  borderRadius: '8px',
                  textAlign: 'center',
                  marginBottom: '1rem'
                }}>
                  <h4 style={{ margin: '0 0 0.5rem 0' }}>🎮 CREDIT SCORE PREDICTOR</h4>
                  <p style={{ margin: 0, fontSize: '0.875rem', opacity: 0.9 }}>
                    I have 3 credit cards, $5K debt, 2 late payments. What's my score?
                  </p>
                </div>
                <div style={{ 
                  background: '#faf5ff', 
                  border: '1px solid #a855f7',
                  borderRadius: '8px',
                  padding: '0.75rem',
                  marginBottom: '0.5rem'
                }}>
                  <div style={{ fontWeight: '600', color: '#7c2d12' }}>Your Prediction:</div>
                  <input 
                    type="number" 
                    placeholder="Enter score (300-850)"
                    style={{
                      width: '100%',
                      padding: '0.5rem',
                      border: '1px solid #d1d5db',
                      borderRadius: '4px',
                      marginTop: '0.5rem'
                    }}
                  />
                </div>
                <p style={{ 
                  textAlign: 'center', 
                  fontSize: '0.75rem', 
                  color: '#6b7280', 
                  marginTop: '0.5rem' 
                }}>
                  Closest guess wins a free consultation! DM your answer 👆
                </p>
              </div>
            )}
          </div>

          <button
            onClick={handleGenerateChallenge}
            disabled={isGenerating}
            style={{
              width: '100%',
              padding: '1rem',
              background: isGenerating ? '#9ca3af' : '#f59e0b',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '1rem',
              fontWeight: '600',
              cursor: isGenerating ? 'not-allowed' : 'pointer'
            }}
          >
            {isGenerating ? 'Generating...' : <><Target className="inline-block w-4 h-4 mr-2" />Generate Challenge</>}
          </button>
        </div>
      </div>

      {/* Viral Strategy Tips */}
      <div style={{ 
        background: '#f0f9ff', 
        border: '1px solid #0ea5e9',
        borderRadius: '12px',
        padding: '1.5rem',
        marginTop: '2rem'
      }}>
        <h4 style={{ color: '#0369a1', marginBottom: '1rem' }}>🚀 Viral Strategy Tips:</h4>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
          <div>
            <div style={{ fontWeight: '600', color: '#0369a1', marginBottom: '0.5rem' }}>Posting Schedule:</div>
            <ul style={{ fontSize: '0.875rem', color: '#0369a1', paddingLeft: '1rem' }}>
              <li>Post challenge at 6 PM (peak engagement)</li>
              <li>Follow up with answer 2 hours later</li>
              <li>Share results in next day's story</li>
            </ul>
          </div>
          <div>
            <div style={{ fontWeight: '600', color: '#0369a1', marginBottom: '0.5rem' }}>Engagement Hooks:</div>
            <ul style={{ fontSize: '0.875rem', color: '#0369a1', paddingLeft: '1rem' }}>
              <li>"You won't believe what happened..."</li>
              <li>"This changed everything for me"</li>
              <li>"Most people get this wrong"</li>
            </ul>
          </div>
          <div>
            <div style={{ fontWeight: '600', color: '#0369a1', marginBottom: '0.5rem' }}>Lead Capture:</div>
            <ul style={{ fontSize: '0.875rem', color: '#0369a1', paddingLeft: '1rem' }}>
              <li>DM for detailed explanation</li>
              <li>Link in bio for free analysis</li>
              <li>Comment "HELP" for consultation</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
