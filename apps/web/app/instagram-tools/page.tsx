'use client';

import { useState, useEffect } from 'react';
import { Rocket, Target, PartyPopper } from 'lucide-react';
import { useAuth } from '../auth-context';

interface SimulationResult {
  currentScore: number;
  projectedScore3Months: number;
  projectedScore6Months: number;
  projectedScore12Months: number;
  improvement: number;
  monthlyImprovement: number;
}

export default function InstagramTools() {
  const { user } = useAuth();

  // Redirect agencies to the proper tools
  useEffect(() => {
    if (typeof window !== 'undefined' && user?.type === 'agency') {
      window.location.href = '/instagram-tools/agency';
    }
  }, [user]);
  const [currentScore, setCurrentScore] = useState<number>(580);
  const [monthlyIncome, setMonthlyIncome] = useState<number>(4000);
  const [totalDebt, setTotalDebt] = useState<number>(15000);
  const [creditUtilization, setCreditUtilization] = useState<number>(65);
  const [hasLatePayments, setHasLatePayments] = useState<boolean>(true);
  const [hasCollections, setHasCollections] = useState<boolean>(false);
  const [hasBankruptcies, setHasBankruptcies] = useState<boolean>(false);
  const [isCalculating, setIsCalculating] = useState<boolean>(false);
  const [result, setResult] = useState<SimulationResult | null>(null);
  const [showEmailCapture, setShowEmailCapture] = useState<boolean>(false);
  const [email, setEmail] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const calculateProjection = (): SimulationResult => {
    // Base improvement factors
    let improvementFactor = 0;
    
    // Credit utilization impact
    if (creditUtilization > 90) improvementFactor += 45;
    else if (creditUtilization > 70) improvementFactor += 35;
    else if (creditUtilization > 50) improvementFactor += 25;
    else if (creditUtilization > 30) improvementFactor += 15;
    else improvementFactor += 5;

    // Late payments impact
    if (hasLatePayments) improvementFactor += 20;
    
    // Collections impact
    if (hasCollections) improvementFactor += 15;
    
    // Bankruptcy impact
    if (hasBankruptcies) improvementFactor += 10;

    // Income to debt ratio impact
    const debtToIncomeRatio = (totalDebt / 12) / monthlyIncome;
    if (debtToIncomeRatio > 0.5) improvementFactor += 10;
    else if (debtToIncomeRatio > 0.3) improvementFactor += 5;

    // Calculate projected scores
    const maxImprovement = Math.min(improvementFactor, 120); // Cap at 120 points
    const monthlyImprovement = maxImprovement / 12;
    
    return {
      currentScore,
      projectedScore3Months: Math.min(currentScore + (monthlyImprovement * 3), 850),
      projectedScore6Months: Math.min(currentScore + (monthlyImprovement * 6), 850),
      projectedScore12Months: Math.min(currentScore + (monthlyImprovement * 12), 850),
      improvement: maxImprovement,
      monthlyImprovement: Math.round(monthlyImprovement)
    };
  };

  const handleCalculate = async () => {
    setIsCalculating(true);
    
    // Simulate calculation delay for better UX
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const simulation = calculateProjection();
    setResult(simulation);
    setIsCalculating(false);
    
    // Show email capture after 3 seconds
    setTimeout(() => {
      setShowEmailCapture(true);
    }, 3000);
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Redirect to trial signup with email pre-filled
    if (typeof window !== 'undefined') {
      window.location.href = `/trial?email=${encodeURIComponent(email)}&utm_source=instagram&utm_medium=simulator`;
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 750) return '#22c55e'; // Green
    if (score >= 700) return '#84cc16'; // Lime
    if (score >= 650) return '#eab308'; // Yellow
    if (score >= 600) return '#f97316'; // Orange
    return '#ef4444'; // Red
  };

  const getScoreLabel = (score: number) => {
    if (score >= 750) return 'Excellent';
    if (score >= 700) return 'Good';
    if (score >= 650) return 'Fair';
    if (score >= 600) return 'Poor';
    return 'Very Poor';
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #1E47FF 0%, #163DE3 100%)',
      padding: '2rem 1rem'
    }}>
      <div style={{ maxWidth: '500px', margin: '0 auto' }}>
        
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1 style={{ 
            color: 'white', 
            fontSize: '2rem', 
            marginBottom: '0.5rem',
            fontWeight: 'bold'
          }}>
            <Rocket className="inline-block w-5 h-5 mr-2" /> Credit Score Simulator
          </h1>
          <p style={{ 
            color: 'rgba(255,255,255,0.9)', 
            fontSize: '1.1rem',
            marginBottom: '1rem'
          }}>
            See how much your credit score could improve with Credit Hardar
          </p>
        </div>

        {/* Simulator Form */}
        <div style={{ 
          background: 'white', 
          borderRadius: '16px', 
          padding: '2rem',
          marginBottom: '1rem',
          boxShadow: '0 20px 40px rgba(0,0,0,0.1)'
        }}>
          <h2 style={{ 
            color: '#1f2937', 
            fontSize: '1.5rem', 
            marginBottom: '1.5rem',
            textAlign: 'center'
          }}>
            Your Current Situation
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            
            {/* Current Credit Score */}
            <div>
              <label style={{ 
                display: 'block', 
                marginBottom: '0.5rem', 
                fontWeight: '600',
                color: '#374151'
              }}>
                Current Credit Score
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type="range"
                  min="300"
                  max="850"
                  value={currentScore}
                  onChange={(e) => setCurrentScore(Number(e.target.value))}
                  style={{
                    width: '100%',
                    height: '8px',
                    borderRadius: '4px',
                    background: `linear-gradient(to right, #ef4444 0%, #f97316 25%, #eab308 50%, #84cc16 75%, #22c55e 100%)`,
                    outline: 'none'
                  }}
                />
                <div style={{
                  position: 'absolute',
                  top: '-30px',
                  left: `${((currentScore - 300) / 550) * 100}%`,
                  transform: 'translateX(-50%)',
                  background: 'white',
                  padding: '0.25rem 0.5rem',
                  borderRadius: '6px',
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  color: getScoreColor(currentScore),
                  border: '2px solid currentColor',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                }}>
                  {currentScore} - {getScoreLabel(currentScore)}
                </div>
              </div>
            </div>

            {/* Monthly Income */}
            <div>
              <label style={{ 
                display: 'block', 
                marginBottom: '0.5rem', 
                fontWeight: '600',
                color: '#374151'
              }}>
                Monthly Income
              </label>
              <input
                type="number"
                value={monthlyIncome}
                onChange={(e) => setMonthlyIncome(Number(e.target.value))}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '2px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '1rem'
                }}
              />
            </div>

            {/* Total Debt */}
            <div>
              <label style={{ 
                display: 'block', 
                marginBottom: '0.5rem', 
                fontWeight: '600',
                color: '#374151'
              }}>
                Total Debt
              </label>
              <input
                type="number"
                value={totalDebt}
                onChange={(e) => setTotalDebt(Number(e.target.value))}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '2px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '1rem'
                }}
              />
            </div>

            {/* Credit Utilization */}
            <div>
              <label style={{ 
                display: 'block', 
                marginBottom: '0.5rem', 
                fontWeight: '600',
                color: '#374151'
              }}>
                Credit Utilization: {creditUtilization}%
              </label>
              <input
                type="range"
                min="0"
                max="100"
                value={creditUtilization}
                onChange={(e) => setCreditUtilization(Number(e.target.value))}
                style={{
                  width: '100%',
                  height: '8px',
                  borderRadius: '4px',
                  background: '#e5e7eb',
                  outline: 'none'
                }}
              />
            </div>

            {/* Credit Issues */}
            <div>
              <label style={{ 
                display: 'block', 
                marginBottom: '0.5rem', 
                fontWeight: '600',
                color: '#374151'
              }}>
                Credit Issues
              </label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <input
                    type="checkbox"
                    checked={hasLatePayments}
                    onChange={(e) => setHasLatePayments(e.target.checked)}
                  />
                  <span>Late payments in last 2 years</span>
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <input
                    type="checkbox"
                    checked={hasCollections}
                    onChange={(e) => setHasCollections(e.target.checked)}
                  />
                  <span>Collections or charge-offs</span>
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <input
                    type="checkbox"
                    checked={hasBankruptcies}
                    onChange={(e) => setHasBankruptcies(e.target.checked)}
                  />
                  <span>Bankruptcy in last 7 years</span>
                </label>
              </div>
            </div>

            {/* Calculate Button */}
            <button
              onClick={handleCalculate}
              disabled={isCalculating}
              style={{
                width: '100%',
                padding: '1rem',
                background: isCalculating ? '#9ca3af' : '#1E47FF',
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                fontSize: '1.1rem',
                fontWeight: '600',
                cursor: isCalculating ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              {isCalculating ? 'Calculating...' : <><Rocket className="inline-block w-4 h-4 mr-2" />Calculate My Improvement</>}
            </button>
          </div>
        </div>

        {/* Results */}
        {result && (
          <div style={{ 
            background: 'white', 
            borderRadius: '16px', 
            padding: '2rem',
            marginBottom: '1rem',
            boxShadow: '0 20px 40px rgba(0,0,0,0.1)'
          }}>
            <h2 style={{ 
              color: '#1f2937', 
              fontSize: '1.5rem', 
              marginBottom: '1.5rem',
              textAlign: 'center'
            }}>
              Your Credit Improvement Projection
            </h2>

            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
              <div style={{ 
                fontSize: '3rem', 
                fontWeight: 'bold',
                color: getScoreColor(result.projectedScore12Months),
                marginBottom: '0.5rem'
              }}>
                +{result.improvement} Points
              </div>
              <p style={{ color: '#6b7280', fontSize: '1.1rem' }}>
                Potential improvement over 12 months
              </p>
            </div>

            {/* Timeline */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ 
                  fontSize: '1.5rem', 
                  fontWeight: 'bold',
                  color: getScoreColor(result.projectedScore3Months)
                }}>
                  {result.projectedScore3Months}
                </div>
                <div style={{ color: '#6b7280', fontSize: '0.875rem' }}>3 Months</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ 
                  fontSize: '1.5rem', 
                  fontWeight: 'bold',
                  color: getScoreColor(result.projectedScore6Months)
                }}>
                  {result.projectedScore6Months}
                </div>
                <div style={{ color: '#6b7280', fontSize: '0.875rem' }}>6 Months</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ 
                  fontSize: '1.5rem', 
                  fontWeight: 'bold',
                  color: getScoreColor(result.projectedScore12Months)
                }}>
                  {result.projectedScore12Months}
                </div>
                <div style={{ color: '#6b7280', fontSize: '0.875rem' }}>12 Months</div>
              </div>
            </div>

            <div style={{ 
              background: '#f0f9ff', 
              border: '2px solid #0ea5e9',
              borderRadius: '12px',
              padding: '1rem',
              textAlign: 'center'
            }}>
              <p style={{ 
                color: '#0369a1', 
                fontWeight: '600',
                marginBottom: '0.5rem'
              }}>
                <Target className="inline-block w-4 h-4 mr-2" /> Monthly Improvement: +{result.monthlyImprovement} points
              </p>
              <p style={{ color: '#0369a1', fontSize: '0.875rem' }}>
                With Credit Hardar's proven dispute process
              </p>
            </div>
          </div>
        )}

        {/* Email Capture */}
        {showEmailCapture && (
          <div style={{ 
            background: 'white', 
            borderRadius: '16px', 
            padding: '2rem',
            boxShadow: '0 20px 40px rgba(0,0,0,0.1)'
          }}>
            <h3 style={{ 
              color: '#1f2937', 
              fontSize: '1.25rem', 
              marginBottom: '1rem',
              textAlign: 'center'
            }}>
              <PartyPopper className="inline-block w-5 h-5 mr-2" /> Get Your Personalized Credit Repair Plan
            </h3>
            <p style={{ 
              color: '#6b7280', 
              marginBottom: '1.5rem',
              textAlign: 'center'
            }}>
              Enter your email to receive a detailed action plan and start your credit improvement journey today.
            </p>
            
            <form onSubmit={handleEmailSubmit}>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                required
                style={{
                  width: '100%',
                  padding: '1rem',
                  border: '2px solid #e5e7eb',
                  borderRadius: '12px',
                  fontSize: '1rem',
                  marginBottom: '1rem'
                }}
              />
              <button
                type="submit"
                disabled={isSubmitting}
                style={{
                  width: '100%',
                  padding: '1rem',
                  background: isSubmitting ? '#9ca3af' : '#22c55e',
                  color: 'white',
                  border: 'none',
                  borderRadius: '12px',
                  fontSize: '1.1rem',
                  fontWeight: '600',
                  cursor: isSubmitting ? 'not-allowed' : 'pointer'
                }}
              >
                {isSubmitting ? 'Sending...' : <><Rocket className="inline-block w-4 h-4 mr-2" />Get My Action Plan</>}
              </button>
            </form>
          </div>
        )}

        {/* Footer */}
        <div style={{ textAlign: 'center', marginTop: '2rem' }}>
          <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.875rem' }}>
            Powered by Credit Hardar • Professional Credit Repair Services
          </p>
        </div>
      </div>
    </div>
  );
}
