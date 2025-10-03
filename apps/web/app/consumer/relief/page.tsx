'use client';

import { useState, useEffect } from 'react';
import { Target, Heart, DollarSign, FileText } from 'lucide-react';
import { api } from '../../lib/api';

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

export default function ConsumerRelief() {
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

  return (
    <div style={{minHeight: '100vh', backgroundColor: '#f9fafb'}}>
      {/* Page Header */}
      <section style={{background: 'white', borderBottom: '1px solid #e5e7eb', padding: '2rem 0'}}>
        <div className="container">
          <div>
            <h1>Financial Relief Programs</h1>
            <p style={{color: '#6b7280'}}>Discover government and private relief programs you qualify for</p>
          </div>
        </div>
      </section>

      <section style={{padding: '3rem 0'}}>
        <div className="container">
          <div style={{display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem'}}>
            
            {/* Personal Profile Form */}
            <div className="card">
              <div className="card-header">
                <h3>Your Profile</h3>
              </div>
              <div className="card-body">
                <form>
                  <div style={{marginBottom: '1.5rem'}}>
                    <label htmlFor="income" style={{display: 'block', color: '#374151', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.5rem'}}>
                      Annual Income
                    </label>
                    <input
                      type="text"
                      id="income"
                      value={clientProfile.income}
                      onChange={(e) => handleProfileChange('income', e.target.value)}
                      style={{display: 'block', width: '100%', padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '0.375rem', boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)', fontSize: '1rem'}}
                      placeholder="e.g., 45000"
                    />
                  </div>

                  <div style={{marginBottom: '1.5rem'}}>
                    <label htmlFor="household_size" style={{display: 'block', color: '#374151', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.5rem'}}>
                      Household Size
                    </label>
                    <select
                      id="household_size"
                      value={clientProfile.household_size}
                      onChange={(e) => handleProfileChange('household_size', e.target.value)}
                      style={{display: 'block', width: '100%', padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '0.375rem', boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)', fontSize: '1rem'}}
                    >
                      <option value="">Select household size</option>
                      <option value="1">1 person</option>
                      <option value="2">2 people</option>
                      <option value="3">3 people</option>
                      <option value="4">4 people</option>
                      <option value="5">5+ people</option>
                    </select>
                  </div>

                  <div style={{marginBottom: '1.5rem'}}>
                    <label htmlFor="state" style={{display: 'block', color: '#374151', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.5rem'}}>
                      State
                    </label>
                    <input
                      type="text"
                      id="state"
                      value={clientProfile.state}
                      onChange={(e) => handleProfileChange('state', e.target.value)}
                      style={{display: 'block', width: '100%', padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '0.375rem', boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)', fontSize: '1rem'}}
                      placeholder="e.g., CA, TX, NY"
                      maxLength={2}
                    />
                  </div>

                  <div style={{marginBottom: '1.5rem'}}>
                    <label htmlFor="employment_status" style={{display: 'block', color: '#374151', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.5rem'}}>
                      Employment Status
                    </label>
                    <select
                      id="employment_status"
                      value={clientProfile.employment_status}
                      onChange={(e) => handleProfileChange('employment_status', e.target.value)}
                      style={{display: 'block', width: '100%', padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '0.375rem', boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)', fontSize: '1rem'}}
                    >
                      <option value="">Select employment status</option>
                      <option value="employed">Employed</option>
                      <option value="unemployed">Unemployed</option>
                      <option value="self_employed">Self-Employed</option>
                      <option value="retired">Retired</option>
                      <option value="disabled">Disabled</option>
                    </select>
                  </div>

                  <div style={{marginBottom: '1.5rem'}}>
                    <h4 style={{marginBottom: '1rem'}}>Special Circumstances</h4>
                    <div style={{display: 'flex', flexDirection: 'column', gap: '0.75rem'}}>
                      <label style={{display: 'flex', alignItems: 'center', gap: '0.75rem'}}>
                        <input
                          type="checkbox"
                          checked={clientProfile.has_disabilities}
                          onChange={(e) => handleProfileChange('has_disabilities', e.target.checked)}
                          style={{width: '16px', height: '16px'}}
                        />
                        <span>Has Disabilities</span>
                      </label>
                      <label style={{display: 'flex', alignItems: 'center', gap: '0.75rem'}}>
                        <input
                          type="checkbox"
                          checked={clientProfile.is_veteran}
                          onChange={(e) => handleProfileChange('is_veteran', e.target.checked)}
                          style={{width: '16px', height: '16px'}}
                        />
                        <span>Military Veteran</span>
                      </label>
                      <label style={{display: 'flex', alignItems: 'center', gap: '0.75rem'}}>
                        <input
                          type="checkbox"
                          checked={clientProfile.is_senior}
                          onChange={(e) => handleProfileChange('is_senior', e.target.checked)}
                          style={{width: '16px', height: '16px'}}
                        />
                        <span>Senior Citizen (65+)</span>
                      </label>
                      <label style={{display: 'flex', alignItems: 'center', gap: '0.75rem'}}>
                        <input
                          type="checkbox"
                          checked={clientProfile.is_pregnant}
                          onChange={(e) => handleProfileChange('is_pregnant', e.target.checked)}
                          style={{width: '16px', height: '16px'}}
                        />
                        <span>Pregnant or Postpartum</span>
                      </label>
                      <label style={{display: 'flex', alignItems: 'center', gap: '0.75rem'}}>
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
                    <div style={{textAlign: 'center', padding: '2rem'}}>
                      <div style={{fontSize: '1.2rem', color: '#6b7280'}}>Finding relief programs...</div>
                    </div>
                  ) : error ? (
                    <div style={{textAlign: 'center', padding: '2rem', color: '#dc2626'}}>
                      <div style={{fontSize: '1.2rem'}}>{error}</div>
                      <button 
                        onClick={handleSearchPrograms} 
                        className="btn btn-secondary" 
                        style={{marginTop: '1rem'}}
                      >
                        Retry
                      </button>
                    </div>
                  ) : recommendations.length === 0 ? (
                    <div style={{textAlign: 'center', padding: '2rem'}}>
                      <div style={{fontSize: '1.2rem', color: '#6b7280', marginBottom: '1rem'}}>
                        No relief programs found
                      </div>
                      <p style={{color: '#9ca3af', marginBottom: '1.5rem'}}>
                        Fill out your profile and click "Find Relief Programs" to search for available programs.
                      </p>
                      <div style={{backgroundColor: '#f0fdf4', padding: '1.5rem', borderRadius: '0.5rem', textAlign: 'left'}}>
                        <h4 style={{color: '#166534', marginBottom: '0.75rem'}}><Target className="inline-block w-4 h-4 mr-2" />ReliefFinder is Live!</h4>
                        <p style={{color: '#15803d', fontSize: '0.875rem', marginBottom: '0.75rem'}}>
                          Our intelligent system matches you with real government and private relief programs based on your financial profile.
                        </p>
                        <p style={{color: '#15803d', fontSize: '0.875rem', marginBottom: 0}}>
                          <strong>Features:</strong> 12+ major programs, eligibility matching, confidence scoring, and direct application links.
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div style={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>
                      {recommendations.map((recommendation) => (
                        <div key={recommendation.id} style={{padding: '1.5rem', border: '1px solid #e5e7eb', borderRadius: '0.5rem', backgroundColor: 'white'}}>
                          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem'}}>
                            <div style={{flex: 1}}>
                              <h4 style={{margin: 0, marginBottom: '0.5rem', color: '#111827'}}>
                                {recommendation.program_title}
                              </h4>
                              <div style={{display: 'flex', gap: '0.75rem', alignItems: 'center', marginBottom: '0.5rem'}}>
                                <span className="badge badge-info">{recommendation.jurisdiction}</span>
                                <span style={{color: '#6b7280', fontSize: '0.875rem'}}>
                                  {Math.round(recommendation.match_score * 100)}% Match
                                </span>
                                <span style={{color: '#16a34a', fontSize: '0.875rem', fontWeight: '500'}}>
                                  {Math.round(recommendation.confidence * 100)}% Confidence
                                </span>
                              </div>
                            </div>
                          </div>
                          
                          <p style={{color: '#374151', fontSize: '1rem', marginBottom: '1rem'}}>
                            {recommendation.program_description}
                          </p>
                          
                          <div style={{backgroundColor: '#eff6ff', padding: '1rem', borderRadius: '0.5rem', marginBottom: '1rem'}}>
                            <h5 style={{color: '#1e40af', margin: 0, marginBottom: '0.5rem'}}>Why This Program:</h5>
                            <p style={{color: '#1d4ed8', fontSize: '0.875rem', margin: 0}}>
                              {recommendation.why_recommended}
                            </p>
                          </div>
                          
                          <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem'}}>
                            <div>
                              <h6 style={{color: '#374151', margin: 0, marginBottom: '0.25rem'}}>Benefits:</h6>
                              <p style={{color: '#6b7280', fontSize: '0.875rem', margin: 0}}>
                                {recommendation.benefit_amount}
                              </p>
                            </div>
                            <div>
                              <h6 style={{color: '#374151', margin: 0, marginBottom: '0.25rem'}}>How to Apply:</h6>
                              <p style={{color: '#6b7280', fontSize: '0.875rem', margin: 0}}>
                                {recommendation.application_method}
                              </p>
                            </div>
                          </div>
                          
                          {recommendation.special_notes && (
                            <div style={{backgroundColor: '#fef3c7', padding: '0.75rem', borderRadius: '0.5rem', marginBottom: '1rem'}}>
                              <p style={{color: '#92400e', fontSize: '0.875rem', margin: 0}}>
                                <strong>Note:</strong> {recommendation.special_notes}
                              </p>
                            </div>
                          )}
                          
                          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                            <div>
                              <h6 style={{color: '#374151', margin: 0, marginBottom: '0.25rem'}}>Required Documents:</h6>
                              <p style={{color: '#6b7280', fontSize: '0.875rem', margin: 0}}>
                                {recommendation.docs_required.join(', ')}
                              </p>
                            </div>
                            <div style={{display: 'flex', gap: '0.5rem'}}>
                              <a 
                                href={recommendation.source_url} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="btn btn-secondary" 
                                style={{fontSize: '0.75rem', padding: '0.5rem 0.75rem'}}
                              >
                                Learn More
                              </a>
                              <button className="btn btn-primary" style={{fontSize: '0.75rem', padding: '0.5rem 0.75rem'}}>
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
    </div>
  );
}



