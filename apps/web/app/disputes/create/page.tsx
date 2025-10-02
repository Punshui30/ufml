'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Lightbulb, BarChart3 } from 'lucide-react';
import { api } from '../../lib/api';

interface Client {
  id: string;
  email: string;
  role: string;
  account_id: string | null;
  created_at: string;
}

interface DisputeSuggestion {
  account_name: string;
  creditor: string;
  account_type: string;
  reason_code: string;
  reason_description: string;
  confidence_score: number;
  suggested_narrative: string;
  bureau: string;
}

interface CreditAccount {
  id: string;
  creditor: string;
  account_type: string;
  balance: number;
  status: string;
  dispute_opportunities: Array<{
    reason_code: string;
    success_probability: number;
    impact_score: number;
    personalized_narrative: string;
  }>;
}

interface ReliefRecommendation {
  id: string;
  program_title: string;
  program_description: string;
  match_score: number;
  confidence: number;
  why_recommended: string;
  benefit_amount: string;
  application_method: string;
  source_url: string;
}

export default function CreateDispute() {
  const searchParams = useSearchParams();
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [disputeSuggestions, setDisputeSuggestions] = useState<DisputeSuggestion[]>([]);
  const [reliefRecommendations, setReliefRecommendations] = useState<ReliefRecommendation[]>([]);
  const [showReliefFinder, setShowReliefFinder] = useState(false);
  const [reportData, setReportData] = useState<any>(null);
  const [formData, setFormData] = useState({
    client_id: '',
    bureau: '',
    reason_code: '',
    account_details: '',
    additional_details: ''
  });

  useEffect(() => {
    fetchClients();
    
    // Check for URL parameters to auto-populate from report
    const clientId = searchParams.get('client_id');
    const reportId = searchParams.get('report_id');
    
    if (clientId) {
      if (reportId) {
        // ALWAYS try backend first for real AI analysis
        fetchReportData(reportId);
      } else {
        fetchClientIntegration(clientId);
      }
    }
  }, [searchParams]);

  const autoPopulateFromReportData = (reportData: any) => {
    console.log('Auto-populating from report data:', reportData);
    
    // Set the report data
    setReportData(reportData);
    
    // Auto-populate dispute suggestions based on REAL AI analysis
    const disputeData = reportData.parsed_json || reportData.summary;
    if (disputeData && disputeData.dispute_opportunities) {
      const suggestions: DisputeSuggestion[] = [];
      
      // Use the AI's actual dispute opportunities
      disputeData.dispute_opportunities.forEach((dispute: any) => {
        suggestions.push({
          account_name: dispute.account_name || 'Credit Account',
          creditor: dispute.creditor || 'Unknown Creditor',
          account_type: 'Credit Account',
          reason_code: dispute.reason_code || dispute.specific_reason || 'DISPUTE',
          reason_description: dispute.specific_reason || dispute.detailed_reason || dispute.reason_description || 'Dispute account information',
          confidence_score: dispute.confidence_score || dispute.success_probability || dispute.success_rate || 0.8,
          suggested_narrative: dispute.ai_generated_narrative || dispute.suggested_narrative || 'I dispute the accuracy of this account information. Please verify and correct any inaccuracies.',
          bureau: reportData.bureau
        });
      });
      
      // Also add E Oscar bypass strategies
      if (disputeData.e_oscar_workarounds) {
        disputeData.e_oscar_workarounds.forEach((strategy: any) => {
          suggestions.push({
            account_name: 'E Oscar Bypass',
            creditor: 'Credit Bureau',
            account_type: 'System Dispute',
            reason_code: 'E_OSCAR_BYPASS',
            reason_description: strategy.description || 'E Oscar bypass strategy',
            confidence_score: strategy.success_rate || 0.85,
            suggested_narrative: strategy.technique || 'Implementing advanced dispute validation bypass technique.',
            bureau: reportData.bureau
          });
        });
      }
      
      // Add procedural dispute opportunities
      if (disputeData.procedural_disputes) {
        disputeData.procedural_disputes.forEach((dispute: any) => {
          suggestions.push({
            account_name: 'Factual Dispute',
            creditor: 'Credit Bureau',
            account_type: 'Data Accuracy',
            reason_code: 'FACTUAL_DISPUTE',
            reason_description: dispute.description || 'Factual inaccuracy dispute',
            confidence_score: dispute.success_rate || 0.88,
            suggested_narrative: dispute.technique || 'Disputing factual inaccuracies in reported data.',
            bureau: reportData.bureau
          });
        });
      }
      
      // Add consumer law violations
      if (reportData.parsed_json.consumer_law_violations) {
        reportData.parsed_json.consumer_law_violations.forEach((violation: any) => {
          suggestions.push({
            account_name: 'Consumer Law Violation',
            creditor: 'Creditor/Bureau',
            account_type: 'Legal Violation',
            reason_code: 'CONSUMER_LAW_VIOLATION',
            reason_description: `${violation.law} violation: ${violation.violations?.join(', ') || 'Legal violation'}`,
            confidence_score: violation.success_rate || 0.90,
            suggested_narrative: `Violation of ${violation.law}. Penalties: ${violation.penalties || 'Legal remedies available'}`,
            bureau: reportData.bureau
          });
        });
      }
      
      setDisputeSuggestions(suggestions);
      
      // Auto-populate form with the HIGHEST confidence dispute
      if (suggestions.length > 0) {
        const bestDispute = suggestions.reduce((best, current) => 
          current.confidence_score > best.confidence_score ? current : best
        );
        
        console.log('Auto-populating form with best dispute:', bestDispute);
        
        setFormData(prev => ({
          ...prev,
          bureau: bestDispute.bureau || combinedResponse.summary?.bureau || 'Credit Bureau',
          reason_code: bestDispute.reason_code || bestDispute.reason_description || 'AI-Generated Dispute',
          account_details: `${bestDispute.creditor || bestDispute.account_name || 'Credit Account'} - ${bestDispute.account_type || 'Account'}`,
          additional_details: bestDispute.suggested_narrative || `I dispute the accuracy of the information reported for my ${bestDispute.account_name || 'credit account'}. ${bestDispute.reason_description || 'This information is inaccurate and violates FCRA requirements for accuracy.'} Please investigate and correct this information immediately.`
        }));
      }
    }
  };

  const fetchClients = async () => {
    try {
      const response = await api('/clients');
      setClients(response.clients || []);
    } catch (error) {
      console.error('Failed to fetch clients:', error);
      
      // Fallback to mock clients from localStorage
      const mockClients = JSON.parse(localStorage.getItem('mock_clients') || '[]');
      setClients(mockClients);
    } finally {
      setLoading(false);
      
      // After clients are loaded, check if we need to set client_id from URL
      const clientId = searchParams.get('client_id');
      if (clientId) {
        setFormData(prev => ({ ...prev, client_id: clientId }));
      }
    }
  };

  const fetchReportData = async (reportId: string) => {
    try {
      // Get the AI analysis for this report
      const analysisResponse = await api('/reports/analyze', {
        method: 'POST',
        body: JSON.stringify({ report_id: reportId })
      });
      
      // Also get the basic report data
      const reportResponse = await api(`/reports/${reportId}`);
      
      // Combine both responses
      const combinedResponse = {
        ...reportResponse,
        parsed_json: analysisResponse.summary,
        summary: analysisResponse.summary
      };
      
      setReportData(combinedResponse);
      
      // NO FALLBACKS - Only use real AI analysis
      
      // Auto-populate dispute suggestions based on REAL AI analysis
      if (combinedResponse.parsed_json && combinedResponse.parsed_json.dispute_opportunities && combinedResponse.parsed_json.dispute_opportunities.length > 0) {
        const suggestions: DisputeSuggestion[] = [];
        
        // Use the AI's actual dispute opportunities
        combinedResponse.parsed_json.dispute_opportunities.forEach((dispute: any) => {
          suggestions.push({
            account_name: dispute.account_name || 'Credit Account',
            creditor: dispute.creditor || 'Unknown Creditor',
            account_type: 'Credit Account',
            reason_code: dispute.reason_code || 'DISPUTE',
            reason_description: dispute.reason_description || 'Dispute account information',
            confidence_score: dispute.confidence_score || dispute.success_probability || 0.8,
            suggested_narrative: dispute.suggested_narrative || 'I dispute the accuracy of this account information. Please verify and correct any inaccuracies.',
            bureau: combinedResponse.bureau
          });
        });
        
        // Also add E Oscar bypass strategies
        if (response.parsed_json.e_oscar_bypass_strategies) {
          response.parsed_json.e_oscar_bypass_strategies.forEach((strategy: any) => {
            suggestions.push({
              account_name: 'E Oscar Bypass',
              creditor: 'Credit Bureau',
              account_type: 'System Dispute',
              reason_code: 'E_OSCAR_BYPASS',
              reason_description: strategy.description || 'E Oscar bypass strategy',
              confidence_score: strategy.success_rate || 0.85,
              suggested_narrative: strategy.technique || 'Implementing advanced dispute validation bypass technique.',
              bureau: combinedResponse.bureau
            });
          });
        }
        
        // Add factual dispute opportunities
        if (response.parsed_json.factual_disputes) {
          response.parsed_json.factual_disputes.forEach((dispute: any) => {
            suggestions.push({
              account_name: dispute.account || 'Factual Dispute',
              creditor: dispute.account || 'Credit Bureau',
              account_type: 'Factual Dispute',
              dispute_category: 'FACTUAL',
              reason_code: 'FACTUAL_DISPUTE',
              reason_description: `${dispute.discrepancy_type}: ${dispute.dispute_reason}`,
              confidence_score: 0.85,
              suggested_narrative: `Disputing ${dispute.discrepancy_type} discrepancy: ${dispute.dispute_reason}`,
              bureau: combinedResponse.bureau
            });
          });
        }

        // Add legal dispute opportunities
        if (response.parsed_json.legal_disputes) {
          response.parsed_json.legal_disputes.forEach((dispute: any) => {
            suggestions.push({
              account_name: dispute.account || 'Legal Violation',
              creditor: dispute.account || 'Creditor',
              account_type: 'Legal Dispute',
              dispute_category: 'LEGAL',
              reason_code: 'LEGAL_VIOLATION',
              reason_description: `${dispute.violation_type}: ${dispute.specific_violation}`,
              confidence_score: 0.90,
              suggested_narrative: `Legal violation of ${dispute.violation_type}. ${dispute.dispute_strategy}`,
              bureau: combinedResponse.bureau
            });
          });
        }

        // Add procedural dispute opportunities
        if (response.parsed_json.procedural_disputes) {
          response.parsed_json.procedural_disputes.forEach((dispute: any) => {
            suggestions.push({
              account_name: dispute.account || 'Procedural Error',
              creditor: dispute.account || 'Bureau',
              account_type: 'Procedural Dispute',
              dispute_category: 'PROCEDURAL',
              reason_code: 'PROCEDURAL_ERROR',
              reason_description: `${dispute.procedural_error}: ${dispute.dispute_reason}`,
              confidence_score: dispute.success_likelihood || 0.75,
              suggested_narrative: `Procedural error: ${dispute.procedural_error}. Metro2 violation: ${dispute.metro2_violation}`,
              bureau: combinedResponse.bureau
            });
          });
        }

        // Add equity dispute opportunities
        if (response.parsed_json.equity_disputes) {
          response.parsed_json.equity_disputes.forEach((dispute: any) => {
            suggestions.push({
              account_name: dispute.account || 'Equity Dispute',
              creditor: dispute.account || 'Creditor',
              account_type: 'Equity Dispute',
              dispute_category: 'EQUITY',
              reason_code: 'EQUITY_DISPUTE',
              reason_description: `${dispute.hardship_type}: ${dispute.equity_argument}`,
              confidence_score: 0.70,
              suggested_narrative: `Equity dispute due to ${dispute.hardship_type}. ${dispute.goodwill_approach}`,
              bureau: combinedResponse.bureau
            });
          });
        }

        // Add E-Oscar workarounds
        if (response.parsed_json.e_oscar_workarounds) {
          response.parsed_json.e_oscar_workarounds.forEach((workaround: any) => {
            suggestions.push({
              account_name: workaround.account || 'E-Oscar Bypass',
              creditor: workaround.account || 'Creditor',
              account_type: 'E-Oscar Bypass',
              dispute_category: 'E_OSCAR_BYPASS',
              reason_code: 'E_OSCAR_BYPASS',
              reason_description: `${workaround.bypass_strategy}: ${workaround.bypass_reason}`,
              confidence_score: workaround.success_rate || 0.80,
              suggested_narrative: `E-Oscar bypass using ${workaround.bypass_strategy}. ${workaround.dispute_approach}`,
              bureau: combinedResponse.bureau
            });
          });
        }

        // Add Metro2 compliance issues
        if (response.parsed_json.metro2_compliance_issues) {
          response.parsed_json.metro2_compliance_issues.forEach((violation: any) => {
            suggestions.push({
              account_name: violation.account || 'Metro2 Violation',
              creditor: violation.account || 'Bureau',
              account_type: 'Metro2 Violation',
              dispute_category: 'METRO2_VIOLATION',
              reason_code: 'METRO2_VIOLATION',
              reason_description: `${violation.violation_code}: ${violation.violation_description}`,
              confidence_score: 0.85,
              suggested_narrative: `Metro2 compliance violation: ${violation.violation_code}. ${violation.dispute_opportunity}`,
              bureau: combinedResponse.bureau
            });
          });
        }
        
        // Add consumer law violations
        if (response.parsed_json.consumer_law_violations) {
          response.parsed_json.consumer_law_violations.forEach((violation: any) => {
            suggestions.push({
              account_name: 'Consumer Law Violation',
              creditor: 'Creditor/Bureau',
              account_type: 'Legal Violation',
              reason_code: 'CONSUMER_LAW_VIOLATION',
              reason_description: `${violation.law} violation: ${violation.violations?.join(', ') || 'Legal violation'}`,
              confidence_score: violation.success_rate || 0.90,
              suggested_narrative: `Violation of ${violation.law}. Penalties: ${violation.penalties || 'Legal remedies available'}`,
              bureau: combinedResponse.bureau
            });
          });
        }
        
        setDisputeSuggestions(suggestions);
        
        // Auto-populate form with the HIGHEST confidence dispute
        if (suggestions.length > 0) {
          const bestDispute = suggestions.reduce((best, current) => 
            current.confidence_score > best.confidence_score ? current : best
          );
          
          setFormData(prev => ({
            ...prev,
            bureau: bestDispute.bureau || 'Credit Bureau',
            reason_code: bestDispute.reason_code || bestDispute.reason_description || 'AI-Generated Dispute',
            account_details: `${bestDispute.creditor || bestDispute.account_name || 'Credit Account'} - ${bestDispute.account_type || 'Account'}`,
            additional_details: bestDispute.suggested_narrative || `I dispute the accuracy of the information reported for my ${bestDispute.account_name || 'credit account'}. ${bestDispute.reason_description || 'This information is inaccurate and violates FCRA requirements for accuracy.'} Please investigate and correct this information immediately.`
          }));
        }
      }
    } catch (error) {
      console.error('Failed to fetch report data:', error);
      setReportData(null);
      setDisputeSuggestions([]);
    }
  };

  const fetchClientIntegration = async (clientId: string) => {
    try {
      const response = await api(`/disputes/client/${clientId}/relief-integration`);
      setDisputeSuggestions(response.dispute_suggestions || []);
      setReliefRecommendations(response.relief_recommendations || []);
    } catch (error) {
      console.error('Failed to fetch client integration:', error);
      setDisputeSuggestions([]);
      setReliefRecommendations([]);
    }
  };

  const handleClientChange = (clientId: string) => {
    setFormData(prev => ({ ...prev, client_id: clientId }));
    if (clientId) {
      fetchClientIntegration(clientId);
    } else {
      setDisputeSuggestions([]);
      setReliefRecommendations([]);
    }
  };

  const useDisputeSuggestion = (suggestion: DisputeSuggestion) => {
    setFormData(prev => ({
      ...prev,
      bureau: suggestion.bureau || 'Credit Bureau',
      reason_code: suggestion.reason_code || suggestion.reason_description || 'AI-Generated Dispute',
      account_details: `${suggestion.creditor || suggestion.account_name || 'Credit Account'} - ${suggestion.account_type || 'Account'}`,
      additional_details: suggestion.suggested_narrative || `I dispute the accuracy of the information reported for my ${suggestion.account_name || 'credit account'}. ${suggestion.reason_description || 'This information is inaccurate and violates FCRA requirements for accuracy.'} Please investigate and correct this information immediately.`
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    console.log('Form submit triggered!');
    e.preventDefault();
    
    // Check if form is valid
    if (!formData.client_id || !formData.bureau || !formData.reason_code) {
      console.log('Form validation failed:', formData);
      alert('Please fill in all required fields');
      return;
    }
    
    setSubmitting(true);

    const disputeData = {
      user_id: formData.client_id,
      target: 'CRA',
      bureau: formData.bureau,
      reason_code: formData.reason_code,
      narrative: formData.additional_details
    };

    console.log('Submitting dispute data:', disputeData);

    try {
      const response = await api('/disputes', {
        method: 'POST',
        body: JSON.stringify(disputeData)
      });

      console.log('Dispute creation response:', response);
      alert(`Dispute created successfully! ID: ${response.dispute_id}`);
      window.location.href = '/disputes';
    } catch (error) {
      console.error('Failed to create dispute:', error);
      alert(`Failed to create dispute: ${error.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // If client changed, fetch integration data
    if (name === 'client_id' && value) {
      fetchClientIntegration(value);
    }
  };

  return (
    <>

      {/* Page Header */}
      <section style={{background: 'white', borderBottom: '1px solid var(--gray-200)', padding: 'var(--space-8) 0'}}>
        <div className="container">
          <h1>Create New Dispute</h1>
          <p style={{color: 'var(--gray-600)'}}>Generate a professional dispute letter for credit bureau challenges</p>
        </div>
      </section>

      {/* Create Dispute Form */}
      <section style={{padding: 'var(--space-12) 0'}}>
        <div className="container">
          <div style={{maxWidth: '800px', margin: '0 auto'}}>
            <div className="card">
              <div className="card-header">
                <h3>Dispute Details</h3>
                {reportData && (
                  <div style={{
                    background: '#f0f9ff',
                    border: '1px solid #0ea5e9',
                    borderRadius: '8px',
                    padding: '1rem',
                    marginTop: '1rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}>
                    <Lightbulb className="w-5 h-5 text-blue-600" />
                    <span style={{ fontSize: '0.875rem', color: '#0c4a6e' }}>
                      <strong>Smart Auto-Population:</strong> Form pre-filled from {reportData.bureau} credit report analysis. 
                      Found {disputeSuggestions.length} dispute opportunities.
                    </span>
                  </div>
                )}
              </div>
              <div className="card-body">
                {reportData && reportData.summary && (
                  <div style={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white',
                    padding: 'var(--space-4)',
                    borderRadius: 'var(--radius)',
                    marginBottom: 'var(--space-6)',
                    textAlign: 'center'
                  }}>
                    <h3 style={{margin: '0 0 var(--space-2) 0', fontSize: '1.1rem', fontWeight: '600'}}>
                      🤖 AI-Powered Dispute Generation
                    </h3>
                    <p style={{margin: 0, fontSize: '0.9rem', opacity: 0.9}}>
                      Form auto-populated from {reportData.summary.bureau} credit report analysis. 
                      Found {reportData.summary.dispute_opportunities?.length || 0} dispute opportunities.
                    </p>
                  </div>
                )}
                
                <form onSubmit={handleSubmit} style={{display: 'flex', flexDirection: 'column', gap: 'var(--space-6)'}}>
                  
                  <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)'}}>
                    <div>
                      <label style={{display: 'block', marginBottom: 'var(--space-2)', fontWeight: '500'}}>Client</label>
                      <select 
                        name="client_id"
                        value={formData.client_id}
                        onChange={handleInputChange}
                        style={{width: '100%', padding: 'var(--space-3)', border: '1px solid var(--gray-300)', borderRadius: 'var(--radius)', background: 'white'}}
                        disabled={loading}
                        required
                      >
                        {loading ? (
                          <option>Loading clients...</option>
                        ) : clients.length > 0 ? (
                          <>
                            <option value="">Select a client...</option>
                            {clients.map((client) => (
                              <option key={client.id} value={client.id}>
                                {client.email}
                              </option>
                            ))}
                          </>
                        ) : (
                          <option>No clients found</option>
                        )}
                      </select>
                    </div>
                    <div>
                      <label style={{display: 'block', marginBottom: 'var(--space-2)', fontWeight: '500'}}>Credit Bureau</label>
                      <input 
                        type="text"
                        name="bureau"
                        value={formData.bureau}
                        onChange={handleInputChange}
                        style={{width: '100%', padding: 'var(--space-3)', border: '1px solid var(--gray-300)', borderRadius: 'var(--radius)', background: 'white'}}
                        placeholder="AI will populate this field"
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label style={{display: 'block', marginBottom: 'var(--space-2)', fontWeight: '500'}}>Dispute Reason</label>
                    <input 
                      type="text"
                      name="reason_code"
                      value={formData.reason_code}
                      onChange={handleInputChange}
                      style={{width: '100%', padding: 'var(--space-3)', border: '1px solid var(--gray-300)', borderRadius: 'var(--radius)', background: 'white'}}
                      placeholder="AI will generate specific dispute reason"
                      required
                    />
                  </div>
                  
                  <div>
                    <label style={{display: 'block', marginBottom: 'var(--space-2)', fontWeight: '500'}}>Account Details</label>
                    <input 
                      type="text" 
                      name="account_details"
                      value={formData.account_details}
                      onChange={handleInputChange}
                      placeholder="AI will populate with specific creditor and account details" 
                      style={{width: '100%', padding: 'var(--space-3)', border: '1px solid var(--gray-300)', borderRadius: 'var(--radius)'}} 
                    />
                  </div>
                  
                  <div>
                    <label style={{display: 'block', marginBottom: 'var(--space-2)', fontWeight: '500'}}>Additional Details</label>
                    <textarea 
                      name="additional_details"
                      value={formData.additional_details}
                      onChange={handleInputChange}
                      rows={4} 
                      placeholder="AI will generate comprehensive dispute narrative with legal basis"
                      style={{
                        width: '100%', 
                        padding: 'var(--space-3)', 
                        border: '1px solid var(--gray-300)', 
                        borderRadius: 'var(--radius)',
                        resize: 'vertical',
                        fontFamily: 'inherit'
                      }}
                    />
                  </div>
                  
                  <div className="flex gap-4">
                    <button 
                      type="submit" 
                      className="btn btn-primary"
                      disabled={submitting}
                    >
                      {submitting ? 'Creating...' : 'Create Dispute Letter'}
                    </button>
                    <a href="/disputes" className="btn btn-secondary">Cancel</a>
                  </div>
                </form>
              </div>
            </div>

            {/* ReliefFinder Integration */}
            {formData.client_id && (disputeSuggestions.length > 0 || reliefRecommendations.length > 0) && (
              <div className="card" style={{marginTop: 'var(--space-8)'}}>
                <div className="card-header">
                  <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                    <h3>🤖 AI-Powered Recommendations</h3>
                    <button 
                      type="button"
                      onClick={() => setShowReliefFinder(!showReliefFinder)}
                      className="btn btn-secondary"
                      style={{fontSize: '0.875rem'}}
                    >
                      {showReliefFinder ? 'Hide' : 'Show'} ReliefFinder
                    </button>
                  </div>
                </div>
                <div className="card-body">
                  
                  {/* Dispute Suggestions */}
                  {disputeSuggestions.length > 0 && (
                    <div style={{marginBottom: 'var(--space-6)'}}>
                      <h4 style={{marginBottom: 'var(--space-4)', color: 'var(--blue-600)'}}>
                        <Lightbulb className="inline-block w-4 h-4 mr-2" /> Smart Dispute Suggestions ({disputeSuggestions.length} found)
                      </h4>
                      <div style={{display: 'flex', flexDirection: 'column', gap: 'var(--space-3)'}}>
                        {disputeSuggestions.slice(0, 3).map((suggestion, index) => (
                          <div key={index} style={{
                            padding: 'var(--space-4)',
                            border: '1px solid var(--gray-200)',
                            borderRadius: 'var(--radius)',
                            backgroundColor: 'var(--blue-50)'
                          }}>
                            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--space-2)'}}>
                              <div>
                                <strong>{suggestion.creditor} - {suggestion.account_type}</strong>
                                <div style={{fontSize: '0.875rem', color: 'var(--gray-600)'}}>
                                  {suggestion.reason_description}
                                </div>
                              </div>
                              <div style={{textAlign: 'right'}}>
                                <div className="badge badge-success">
                                  {Math.round(suggestion.confidence_score * 100)}% Match
                                </div>
                              </div>
                            </div>
                            <p style={{fontSize: '0.875rem', color: 'var(--gray-700)', marginBottom: 'var(--space-3)'}}>
                              {suggestion.suggested_narrative}
                            </p>
                            <button 
                              type="button"
                              onClick={() => useDisputeSuggestion(suggestion)}
                              className="btn btn-primary"
                              style={{fontSize: '0.75rem', padding: 'var(--space-2) var(--space-3)'}}
                            >
                              Use This Suggestion
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* ReliefFinder Recommendations */}
                  {showReliefFinder && reliefRecommendations.length > 0 && (
                    <div>
                      <h4 style={{marginBottom: 'var(--space-4)', color: 'var(--green-600)'}}>
                        🆘 ReliefFinder - Financial Assistance Programs ({reliefRecommendations.length} matches)
                      </h4>
                      <div style={{display: 'flex', flexDirection: 'column', gap: 'var(--space-3)'}}>
                        {reliefRecommendations.slice(0, 2).map((program, index) => (
                          <div key={index} style={{
                            padding: 'var(--space-4)',
                            border: '1px solid var(--gray-200)',
                            borderRadius: 'var(--radius)',
                            backgroundColor: 'var(--green-50)'
                          }}>
                            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--space-2)'}}>
                              <div>
                                <strong>{program.program_title}</strong>
                                <div style={{fontSize: '0.875rem', color: 'var(--gray-600)'}}>
                                  {program.benefit_amount}
                                </div>
                              </div>
                              <div style={{textAlign: 'right'}}>
                                <div className="badge badge-success">
                                  {Math.round(program.match_score * 100)}% Match
                                </div>
                              </div>
                            </div>
                            <p style={{fontSize: '0.875rem', color: 'var(--gray-700)', marginBottom: 'var(--space-2)'}}>
                              {program.program_description}
                            </p>
                            <p style={{fontSize: '0.875rem', color: 'var(--blue-600)', marginBottom: 'var(--space-3)'}}>
                              <strong>Why recommended:</strong> {program.why_recommended}
                            </p>
                            <div style={{display: 'flex', gap: 'var(--space-2)'}}>
                              <a 
                                href={program.source_url} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="btn btn-secondary"
                                style={{fontSize: '0.75rem', padding: 'var(--space-2) var(--space-3)'}}
                              >
                                Apply Now
                              </a>
                              <span style={{fontSize: '0.75rem', color: 'var(--gray-500)', alignSelf: 'center'}}>
                                {program.application_method}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div style={{textAlign: 'center', marginTop: 'var(--space-4)'}}>
                        <a 
                          href="/relief" 
                          className="btn btn-outline"
                          style={{fontSize: '0.875rem'}}
                        >
                          View All Relief Programs
                        </a>
                      </div>
                    </div>
                  )}

                  {disputeSuggestions.length === 0 && reliefRecommendations.length === 0 && (
                    <div style={{textAlign: 'center', padding: 'var(--space-8)', color: 'var(--gray-500)'}}>
                      <div style={{marginBottom: 'var(--space-2)'}}><BarChart3 className="w-6 h-6 text-blue-600" /></div>
                      <p>No credit reports found for this client.</p>
                      <p style={{fontSize: '0.875rem'}}>Upload a credit report to get AI-powered dispute suggestions and relief program recommendations.</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}