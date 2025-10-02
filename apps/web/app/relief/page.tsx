'use client';

import { useState, useEffect } from 'react';
import { Target } from 'lucide-react';
import { api } from '../lib/api';

interface ReliefProgram {
  id: string;
  slug: string;
  title: string;
  jurisdiction: string;
  eligibility: any;
  docs_required: any;
  source_url: string;
}

interface ReliefRecommendation {
  id: string;
  program_id: string;
  program_title: string;
  program_description: string;
  jurisdiction: string;
  match_score: number;
  confidence: number;
  why_recommended: string;
  benefit_amount: string;
  application_method: string;
  source_url: string;
  docs_required: string[];
  special_notes?: string;
}

export default function ReliefFinder() {
  const [recommendations, setRecommendations] = useState<ReliefRecommendation[]>([]);
  const [programs, setPrograms] = useState<ReliefProgram[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [clientProfile, setClientProfile] = useState({
    income: '',
    household_size: '',
    state: '',
    employment_status: '',
    has_disabilities: false,
    is_veteran: false,
    is_senior: false,
    is_pregnant: false,
    has_children: false
  });

  useEffect(() => {
    fetchRecommendations();
  }, []);

  const fetchRecommendations = async () => {
    try {
      setLoading(true);
      // Convert form data to proper types
      const profileData = {
        income: clientProfile.income ? parseInt(clientProfile.income) : null,
        household_size: clientProfile.household_size ? parseInt(clientProfile.household_size) : null,
        state: clientProfile.state || null,
        employment_status: clientProfile.employment_status || null,
        has_disabilities: clientProfile.has_disabilities,
        is_veteran: clientProfile.is_veteran,
        is_senior: clientProfile.is_senior,
        is_pregnant: clientProfile.is_pregnant,
        has_children: clientProfile.has_children
      };

      const response = await api('/relief/recommend', {
        method: 'POST',
        body: JSON.stringify(profileData)
      });
      setRecommendations(response || []);
    } catch (error: any) {
      console.error('Failed to fetch relief recommendations:', error);
      setError('Failed to load relief recommendations');
    } finally {
      setLoading(false);
    }
  };

  const handleProfileChange = (field: string, value: string | boolean) => {
    setClientProfile(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSearchPrograms = async () => {
    await fetchRecommendations();
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'proposed':
        return <span className="badge badge-info">Proposed</span>;
      case 'applied':
        return <span className="badge badge-success">Applied</span>;
      case 'rejected':
        return <span className="badge badge-error">Rejected</span>;
      default:
        return <span className="badge badge-secondary">{status}</span>;
    }
  };

  return (
    <>
      {/* Navigation */}
      <nav className="navbar">
        <div className="container">
          <div className="navbar-content">
            <a href="/" className="navbar-brand">
              <img src="/logo.png" alt="Credit Hardar Logo" />
              Credit Hardar
            </a>
            <ul className="navbar-nav">
              <li><a href="/">Home</a></li>
              <li><a href="/dashboard">Dashboard</a></li>
              <li><a href="/clients">Clients</a></li>
              <li><a href="/disputes">Disputes</a></li>
              <li><a href="/reports">Reports</a></li>
              <li><a href="/relief">Relief Finder</a></li>
            </ul>
          </div>
        </div>
      </nav>

      {/* Page Header */}
      <section style={{background: 'white', borderBottom: '1px solid var(--gray-200)', padding: 'var(--space-8) 0'}}>
        <div className="container">
          <div>
            <h1>Relief Finder</h1>
            <p style={{color: 'var(--gray-600)'}}>Discover government and private relief programs your clients qualify for</p>
          </div>
        </div>
      </section>

      <section style={{padding: 'var(--space-12) 0'}}>
        <div className="container">
          <div style={{display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 'var(--space-8)'}}>
            
            {/* Client Profile Form */}
            <div className="card">
              <div className="card-header">
                <h3>Client Profile</h3>
              </div>
              <div className="card-body">
                <form>
                  <div style={{marginBottom: 'var(--space-6)'}}>
                    <label htmlFor="income" style={{display: 'block', color: 'var(--gray-700)', fontSize: 'var(--font-size-sm)', fontWeight: 'medium', marginBottom: 'var(--space-2)'}}>
                      Annual Income
                    </label>
                    <input
                      type="text"
                      id="income"
                      value={clientProfile.income}
                      onChange={(e) => handleProfileChange('income', e.target.value)}
                      style={{display: 'block', width: '100%', padding: 'var(--space-3)', border: '1px solid var(--gray-300)', borderRadius: 'var(--rounded-md)', boxShadow: 'var(--shadow-sm)', fontSize: 'var(--font-size-base)'}}
                      placeholder="e.g., 45000"
                    />
                  </div>

                  <div style={{marginBottom: 'var(--space-6)'}}>
                    <label htmlFor="household_size" style={{display: 'block', color: 'var(--gray-700)', fontSize: 'var(--font-size-sm)', fontWeight: 'medium', marginBottom: 'var(--space-2)'}}>
                      Household Size
                    </label>
                    <select
                      id="household_size"
                      value={clientProfile.household_size}
                      onChange={(e) => handleProfileChange('household_size', e.target.value)}
                      style={{display: 'block', width: '100%', padding: 'var(--space-3)', border: '1px solid var(--gray-300)', borderRadius: 'var(--rounded-md)', boxShadow: 'var(--shadow-sm)', fontSize: 'var(--font-size-base)'}}
                    >
                      <option value="">Select household size</option>
                      <option value="1">1 person</option>
                      <option value="2">2 people</option>
                      <option value="3">3 people</option>
                      <option value="4">4 people</option>
                      <option value="5">5+ people</option>
                    </select>
                  </div>

                  <div style={{marginBottom: 'var(--space-6)'}}>
                    <label htmlFor="state" style={{display: 'block', color: 'var(--gray-700)', fontSize: 'var(--font-size-sm)', fontWeight: 'medium', marginBottom: 'var(--space-2)'}}>
                      State
                    </label>
                    <input
                      type="text"
                      id="state"
                      value={clientProfile.state}
                      onChange={(e) => handleProfileChange('state', e.target.value)}
                      style={{display: 'block', width: '100%', padding: 'var(--space-3)', border: '1px solid var(--gray-300)', borderRadius: 'var(--rounded-md)', boxShadow: 'var(--shadow-sm)', fontSize: 'var(--font-size-base)'}}
                      placeholder="e.g., CA, TX, NY"
                      maxLength={2}
                    />
                  </div>

                  <div style={{marginBottom: 'var(--space-6)'}}>
                    <label htmlFor="employment_status" style={{display: 'block', color: 'var(--gray-700)', fontSize: 'var(--font-size-sm)', fontWeight: 'medium', marginBottom: 'var(--space-2)'}}>
                      Employment Status
                    </label>
                    <select
                      id="employment_status"
                      value={clientProfile.employment_status}
                      onChange={(e) => handleProfileChange('employment_status', e.target.value)}
                      style={{display: 'block', width: '100%', padding: 'var(--space-3)', border: '1px solid var(--gray-300)', borderRadius: 'var(--rounded-md)', boxShadow: 'var(--shadow-sm)', fontSize: 'var(--font-size-base)'}}
                    >
                      <option value="">Select employment status</option>
                      <option value="employed">Employed</option>
                      <option value="unemployed">Unemployed</option>
                      <option value="self_employed">Self-Employed</option>
                      <option value="retired">Retired</option>
                      <option value="disabled">Disabled</option>
                    </select>
                  </div>

                  <div style={{marginBottom: 'var(--space-6)'}}>
                    <h4 style={{marginBottom: 'var(--space-4)'}}>Special Circumstances</h4>
                    <div style={{display: 'flex', flexDirection: 'column', gap: 'var(--space-3)'}}>
                      <label style={{display: 'flex', alignItems: 'center', gap: 'var(--space-3)'}}>
                        <input
                          type="checkbox"
                          checked={clientProfile.has_disabilities}
                          onChange={(e) => handleProfileChange('has_disabilities', e.target.checked)}
                          style={{width: '16px', height: '16px'}}
                        />
                        <span>Has Disabilities</span>
                      </label>
                      <label style={{display: 'flex', alignItems: 'center', gap: 'var(--space-3)'}}>
                        <input
                          type="checkbox"
                          checked={clientProfile.is_veteran}
                          onChange={(e) => handleProfileChange('is_veteran', e.target.checked)}
                          style={{width: '16px', height: '16px'}}
                        />
                        <span>Military Veteran</span>
                      </label>
                      <label style={{display: 'flex', alignItems: 'center', gap: 'var(--space-3)'}}>
                        <input
                          type="checkbox"
                          checked={clientProfile.is_senior}
                          onChange={(e) => handleProfileChange('is_senior', e.target.checked)}
                          style={{width: '16px', height: '16px'}}
                        />
                        <span>Senior Citizen (65+)</span>
                      </label>
                      <label style={{display: 'flex', alignItems: 'center', gap: 'var(--space-3)'}}>
                        <input
                          type="checkbox"
                          checked={clientProfile.is_pregnant}
                          onChange={(e) => handleProfileChange('is_pregnant', e.target.checked)}
                          style={{width: '16px', height: '16px'}}
                        />
                        <span>Pregnant or Postpartum</span>
                      </label>
                      <label style={{display: 'flex', alignItems: 'center', gap: 'var(--space-3)'}}>
                        <input
                          type="checkbox"
                          checked={clientProfile.has_children}
                          onChange={(e) => handleProfileChange('has_children', e.target.checked)}
                          style={{width: '16px', height: '16px'}}
                        />
                        <span>Has Dependent Children</span>
                      </label>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleSearchPrograms}
                    className="btn btn-primary"
                    style={{width: '100%'}}
                  >
                    Find Relief Programs
                  </button>
                </form>
              </div>
            </div>

            {/* Relief Programs Results */}
            <div>
              <div className="card">
                <div className="card-header">
                  <h3>Recommended Relief Programs</h3>
                </div>
                <div className="card-body">
                  {loading ? (
                    <div style={{textAlign: 'center', padding: 'var(--space-8)'}}>
                      <div style={{fontSize: '1.2rem', color: 'var(--gray-600)'}}>Finding relief programs...</div>
                    </div>
                  ) : error ? (
                    <div style={{textAlign: 'center', padding: 'var(--space-8)', color: 'var(--red-600)'}}>
                      <div style={{fontSize: '1.2rem'}}>{error}</div>
                      <button 
                        onClick={handleSearchPrograms} 
                        className="btn btn-secondary" 
                        style={{marginTop: 'var(--space-4)'}}
                      >
                        Retry
                      </button>
                    </div>
                  ) : recommendations.length === 0 ? (
                    <div style={{textAlign: 'center', padding: 'var(--space-8)'}}>
                      <div style={{fontSize: '1.2rem', color: 'var(--gray-600)', marginBottom: 'var(--space-4)'}}>
                        No relief programs found
                      </div>
                      <p style={{color: 'var(--gray-500)', marginBottom: 'var(--space-6)'}}>
                        Fill out the client profile and click "Find Relief Programs" to search for available programs.
                      </p>
                      <div style={{backgroundColor: 'var(--green-50)', padding: 'var(--space-6)', borderRadius: 'var(--rounded-md)', textAlign: 'left'}}>
                        <h4 style={{color: 'var(--green-900)', marginBottom: 'var(--space-3)'}}><Target className="inline-block w-4 h-4 mr-2" />ReliefFinder is Live!</h4>
                        <p style={{color: 'var(--green-800)', fontSize: 'var(--font-size-sm)', marginBottom: 'var(--space-3)'}}>
                          Our intelligent system matches clients with real government and private relief programs based on their financial profile.
                        </p>
                        <p style={{color: 'var(--green-800)', fontSize: 'var(--font-size-sm)', marginBottom: 0}}>
                          <strong>Features:</strong> 12+ major programs, eligibility matching, confidence scoring, and direct application links.
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div style={{display: 'flex', flexDirection: 'column', gap: 'var(--space-4)'}}>
                      {recommendations.map((recommendation) => (
                        <div key={recommendation.id} style={{padding: 'var(--space-6)', border: '1px solid var(--gray-200)', borderRadius: 'var(--rounded-md)', backgroundColor: 'white'}}>
                          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: 'var(--space-4)'}}>
                            <div style={{flex: 1}}>
                              <h4 style={{margin: 0, marginBottom: 'var(--space-2)', color: 'var(--gray-900)'}}>
                                {recommendation.program_title}
                              </h4>
                              <div style={{display: 'flex', gap: 'var(--space-3)', alignItems: 'center', marginBottom: 'var(--space-2)'}}>
                                <span className="badge badge-info">{recommendation.jurisdiction}</span>
                                <span style={{color: 'var(--gray-500)', fontSize: 'var(--font-size-sm)'}}>
                                  {Math.round(recommendation.match_score * 100)}% Match
                                </span>
                                <span style={{color: 'var(--green-600)', fontSize: 'var(--font-size-sm)', fontWeight: 'medium'}}>
                                  {Math.round(recommendation.confidence * 100)}% Confidence
                                </span>
                              </div>
                            </div>
                          </div>
                          
                          <p style={{color: 'var(--gray-700)', fontSize: 'var(--font-size-base)', marginBottom: 'var(--space-4)'}}>
                            {recommendation.program_description}
                          </p>
                          
                          <div style={{backgroundColor: 'var(--blue-50)', padding: 'var(--space-4)', borderRadius: 'var(--rounded-md)', marginBottom: 'var(--space-4)'}}>
                            <h5 style={{color: 'var(--blue-900)', margin: 0, marginBottom: 'var(--space-2)'}}>Why This Program:</h5>
                            <p style={{color: 'var(--blue-800)', fontSize: 'var(--font-size-sm)', margin: 0}}>
                              {recommendation.why_recommended}
                            </p>
                          </div>
                          
                          <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)', marginBottom: 'var(--space-4)'}}>
                            <div>
                              <h6 style={{color: 'var(--gray-700)', margin: 0, marginBottom: 'var(--space-1)'}}>Benefits:</h6>
                              <p style={{color: 'var(--gray-600)', fontSize: 'var(--font-size-sm)', margin: 0}}>
                                {recommendation.benefit_amount}
                              </p>
                            </div>
                            <div>
                              <h6 style={{color: 'var(--gray-700)', margin: 0, marginBottom: 'var(--space-1)'}}>How to Apply:</h6>
                              <p style={{color: 'var(--gray-600)', fontSize: 'var(--font-size-sm)', margin: 0}}>
                                {recommendation.application_method}
                              </p>
                            </div>
                          </div>
                          
                          {recommendation.special_notes && (
                            <div style={{backgroundColor: 'var(--yellow-50)', padding: 'var(--space-3)', borderRadius: 'var(--rounded-md)', marginBottom: 'var(--space-4)'}}>
                              <p style={{color: 'var(--yellow-800)', fontSize: 'var(--font-size-sm)', margin: 0}}>
                                <strong>Note:</strong> {recommendation.special_notes}
                              </p>
                            </div>
                          )}
                          
                          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                            <div>
                              <h6 style={{color: 'var(--gray-700)', margin: 0, marginBottom: 'var(--space-1)'}}>Required Documents:</h6>
                              <p style={{color: 'var(--gray-600)', fontSize: 'var(--font-size-sm)', margin: 0}}>
                                {recommendation.docs_required.join(', ')}
                              </p>
                            </div>
                            <div style={{display: 'flex', gap: 'var(--space-2)'}}>
                              <a 
                                href={recommendation.source_url} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="btn btn-secondary" 
                                style={{fontSize: '0.75rem', padding: 'var(--space-2) var(--space-3)'}}
                              >
                                Learn More
                              </a>
                              <button className="btn btn-primary" style={{fontSize: '0.75rem', padding: 'var(--space-2) var(--space-3)'}}>
                                Apply Now
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
