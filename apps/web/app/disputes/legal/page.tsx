'use client';

import { useState, useEffect } from 'react';
import { Scale, FileText, Shield, Gavel, AlertCircle, CheckCircle, Clock, BookOpen, Users, Building2 } from 'lucide-react';
import { api } from '../../lib/api';

interface LegalStrategy {
  id: string;
  name: string;
  description: string;
  law_reference: string;
  success_rate: number;
  complexity: 'basic' | 'intermediate' | 'advanced' | 'expert';
  applicable_to: string[];
  template: string;
  evidence_required: string[];
  time_limit: string;
  penalties: string;
}

interface FactualDispute {
  id: string;
  account_name: string;
  creditor: string;
  dispute_type: 'factual' | 'legal' | 'procedural';
  issue_description: string;
  evidence_type: string[];
  legal_basis: string[];
  status: 'pending' | 'investigating' | 'resolved' | 'escalated';
  created_at: string;
  deadline: string;
}

interface ConsumerLawViolation {
  id: string;
  violation_type: string;
  law_section: string;
  description: string;
  penalty_amount: string;
  statute_of_limitations: string;
  evidence_needed: string[];
}

export default function ConsumerLawDisputing() {
  const [selectedStrategy, setSelectedStrategy] = useState<string>('');
  const [factualDisputes, setFactualDisputes] = useState<FactualDispute[]>([]);
  const [violations, setViolations] = useState<ConsumerLawViolation[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [legalResults, setLegalResults] = useState<any>(null);

  const legalStrategies: LegalStrategy[] = [
    // FCRA Violations
    {
      id: 'fcra_investigation',
      name: 'FCRA Investigation Violation',
      description: 'Credit bureau failed to conduct reasonable investigation of dispute',
      law_reference: '15 U.S.C. § 1681i(a)(1)(A)',
      success_rate: 92,
      complexity: 'advanced',
      applicable_to: ['bureau'],
      template: 'fcra_investigation',
      evidence_required: ['dispute_letter', 'bureau_response', 'credit_report'],
      time_limit: '30 days',
      penalties: '$100-$1,000 per violation + attorney fees'
    },
    {
      id: 'fcra_accuracy',
      name: 'FCRA Accuracy Violation',
      description: 'Credit bureau reporting inaccurate information after dispute',
      law_reference: '15 U.S.C. § 1681e(b)',
      success_rate: 88,
      complexity: 'intermediate',
      applicable_to: ['bureau'],
      template: 'fcra_accuracy',
      evidence_required: ['credit_report', 'supporting_documents', 'dispute_history'],
      time_limit: '30 days',
      penalties: '$100-$1,000 per violation'
    },
    {
      id: 'fcra_reinsertion',
      name: 'FCRA Reinsertion Violation',
      description: 'Credit bureau reinserted disputed information without proper notice',
      law_reference: '15 U.S.C. § 1681i(a)(5)(B)',
      success_rate: 95,
      complexity: 'expert',
      applicable_to: ['bureau'],
      template: 'fcra_reinsertion',
      evidence_required: ['original_dispute', 'deletion_confirmation', 'reinsertion_notice'],
      time_limit: '5 days',
      penalties: '$100-$1,000 per violation'
    },
    // FDCPA Violations
    {
      id: 'fdcpa_validation',
      name: 'FDCPA Debt Validation Violation',
      description: 'Debt collector failed to provide proper debt validation',
      law_reference: '15 U.S.C. § 1692g(b)',
      success_rate: 90,
      complexity: 'basic',
      applicable_to: ['collection_agency'],
      template: 'fdcpa_validation',
      evidence_required: ['collection_letter', 'validation_request', 'collector_response'],
      time_limit: '30 days',
      penalties: '$1,000 per violation + actual damages'
    },
    {
      id: 'fdcpa_harassment',
      name: 'FDCPA Harassment Violation',
      description: 'Debt collector engaged in harassing or abusive conduct',
      law_reference: '15 U.S.C. § 1692d',
      success_rate: 85,
      complexity: 'intermediate',
      applicable_to: ['collection_agency'],
      template: 'fdcpa_harassment',
      evidence_required: ['call_logs', 'recordings', 'witness_statements'],
      time_limit: '1 year',
      penalties: '$1,000 per violation + actual damages'
    },
    {
      id: 'fdcpa_cease_desist',
      name: 'FDCPA Cease and Desist Violation',
      description: 'Debt collector continued contact after cease and desist notice',
      law_reference: '15 U.S.C. § 1692c(c)',
      success_rate: 98,
      complexity: 'basic',
      applicable_to: ['collection_agency'],
      template: 'fdcpa_cease_desist',
      evidence_required: ['cease_desist_letter', 'proof_of_delivery', 'continued_contact'],
      time_limit: '30 days',
      penalties: '$1,000 per violation + actual damages'
    },
    // Factual Disputes
    {
      id: 'factual_payment_history',
      name: 'Factual Payment History Dispute',
      description: 'Dispute incorrect payment history with bank statements',
      law_reference: '15 U.S.C. § 1681i(a)(1)(A)',
      success_rate: 80,
      complexity: 'intermediate',
      applicable_to: ['bureau', 'creditor'],
      template: 'factual_payment',
      evidence_required: ['bank_statements', 'payment_records', 'account_statements'],
      time_limit: '30 days',
      penalties: 'Correction of credit report'
    },
    {
      id: 'factual_account_status',
      name: 'Factual Account Status Dispute',
      description: 'Dispute incorrect account status (open vs closed)',
      law_reference: '15 U.S.C. § 1681i(a)(1)(A)',
      success_rate: 75,
      complexity: 'basic',
      applicable_to: ['bureau', 'creditor'],
      template: 'factual_status',
      evidence_required: ['account_closing_letter', 'final_statement', 'creditor_confirmation'],
      time_limit: '30 days',
      penalties: 'Correction of credit report'
    },
    {
      id: 'factual_balance',
      name: 'Factual Balance Dispute',
      description: 'Dispute incorrect account balance with documentation',
      law_reference: '15 U.S.C. § 1681i(a)(1)(A)',
      success_rate: 82,
      complexity: 'basic',
      applicable_to: ['bureau', 'creditor'],
      template: 'factual_balance',
      evidence_required: ['account_statements', 'payment_confirmations', 'balance_verification'],
      time_limit: '30 days',
      penalties: 'Correction of credit report'
    },
    // Procedural Violations
    {
      id: 'procedural_notice',
      name: 'Procedural Notice Violation',
      description: 'Creditor failed to provide required notices under law',
      law_reference: 'Various state and federal laws',
      success_rate: 70,
      complexity: 'advanced',
      applicable_to: ['creditor'],
      template: 'procedural_notice',
      evidence_required: ['account_documents', 'notice_history', 'legal_requirements'],
      time_limit: 'Varies by state',
      penalties: 'Varies by law'
    }
  ];

  const consumerLawViolations: ConsumerLawViolation[] = [
    {
      id: 'fcra_violations',
      violation_type: 'Fair Credit Reporting Act',
      law_section: '15 U.S.C. § 1681',
      description: 'Credit reporting violations including inaccurate information, improper investigations, and reinsertion violations',
      penalty_amount: '$100-$1,000 per violation',
      statute_of_limitations: '2 years (5 years for willful violations)',
      evidence_needed: ['credit_reports', 'dispute_letters', 'bureau_responses']
    },
    {
      id: 'fdcpa_violations',
      violation_type: 'Fair Debt Collection Practices Act',
      law_section: '15 U.S.C. § 1692',
      description: 'Debt collection violations including harassment, improper validation, and cease and desist violations',
      penalty_amount: '$1,000 per violation + actual damages',
      statute_of_limitations: '1 year',
      evidence_needed: ['collection_letters', 'call_records', 'validation_requests']
    },
    {
      id: 'fdcpa_violations',
      violation_type: 'Truth in Lending Act',
      law_section: '15 U.S.C. § 1601',
      description: 'Lending disclosure violations and billing error disputes',
      penalty_amount: '$2,000-$4,000 per violation',
      statute_of_limitations: '1 year',
      evidence_needed: ['loan_documents', 'billing_statements', 'disclosure_forms']
    },
    {
      id: 'state_fdcpa',
      violation_type: 'State FDCPA Laws',
      law_section: 'Varies by state',
      description: 'State-specific debt collection laws often more stringent than federal',
      penalty_amount: 'Varies by state ($500-$5,000)',
      statute_of_limitations: 'Varies by state',
      evidence_needed: ['state_law_references', 'violation_evidence', 'damage_documentation']
    }
  ];

  const sampleFactualDisputes: FactualDispute[] = [
    {
      id: 'dispute_1',
      account_name: 'Chase Credit Card',
      creditor: 'JPMorgan Chase Bank',
      dispute_type: 'factual',
      issue_description: 'Account shows as "charged off" but was paid in full with settlement',
      evidence_type: ['settlement_agreement', 'payment_confirmation', 'final_statement'],
      legal_basis: ['FCRA § 1681i(a)(1)(A)', 'State consumer protection laws'],
      status: 'pending',
      created_at: '2024-01-15',
      deadline: '2024-02-15'
    },
    {
      id: 'dispute_2',
      account_name: 'Capital One Auto Loan',
      creditor: 'Capital One Bank',
      dispute_type: 'legal',
      issue_description: 'Late payments reported but account was in forbearance',
      evidence_type: ['forbearance_agreement', 'payment_history', 'creditor_correspondence'],
      legal_basis: ['FCRA § 1681e(b)', 'Contract law'],
      status: 'investigating',
      created_at: '2024-01-10',
      deadline: '2024-02-10'
    }
  ];

  useEffect(() => {
    setFactualDisputes(sampleFactualDisputes);
    setViolations(consumerLawViolations);
  }, []);

  const handleStrategySelect = (strategyId: string) => {
    setSelectedStrategy(strategyId);
  };

  const launchLegalDispute = async () => {
    if (!selectedStrategy) {
      alert('Please select a legal strategy');
      return;
    }

    setIsProcessing(true);
    try {
      const response = await api('/disputes/legal-action', {
        method: 'POST',
        body: JSON.stringify({
          strategy: selectedStrategy,
          user_id: 'current',
          include_legal_demand: true,
          request_attorney_fees: true,
          certified_mail: true,
          return_receipt: true
        })
      });

      setLegalResults(response);
      
    } catch (err: any) {
      console.error('Legal dispute failed:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  const getComplexityColor = (complexity: LegalStrategy['complexity']) => {
    switch (complexity) {
      case 'basic': return '#10b981';
      case 'intermediate': return '#f59e0b';
      case 'advanced': return '#ef4444';
      case 'expert': return '#8b5cf6';
    }
  };

  const getStatusColor = (status: FactualDispute['status']) => {
    switch (status) {
      case 'pending': return '#f59e0b';
      case 'investigating': return '#3b82f6';
      case 'resolved': return '#10b981';
      case 'escalated': return '#ef4444';
    }
  };

  return (
    <div style={{ padding: '2rem 1rem', maxWidth: '1400px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: '3rem' }}>
        <h1 style={{ 
          fontSize: '2.5rem', 
          fontWeight: 'bold', 
          marginBottom: '1rem',
          background: 'linear-gradient(135deg, #7c3aed, #5b21b6)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          Consumer Law & Factual Disputing
        </h1>
        <p style={{ fontSize: '1.2rem', color: '#6b7280', marginBottom: '2rem' }}>
          Leverage consumer protection laws and factual evidence to force corrections and collect penalties.
        </p>
      </div>

      {/* Legal Strategy Dashboard */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '3rem' }}>
        
        {/* Legal Strategy Selection */}
        <div style={{
          background: 'white',
          border: '1px solid #e5e7eb',
          borderRadius: '12px',
          padding: '2rem',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
        }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Gavel className="w-6 h-6 text-purple-500" />
            Legal Strategies
          </h2>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxHeight: '500px', overflowY: 'auto' }}>
            {legalStrategies.map(strategy => (
              <div key={strategy.id} style={{
                border: selectedStrategy === strategy.id ? '2px solid #7c3aed' : '1px solid #e5e7eb',
                borderRadius: '8px',
                padding: '1rem',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              onClick={() => handleStrategySelect(strategy.id)}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <h3 style={{ fontWeight: '600', fontSize: '0.875rem' }}>{strategy.name}</h3>
                  <div style={{
                    background: getComplexityColor(strategy.complexity),
                    color: 'white',
                    padding: '0.25rem 0.5rem',
                    borderRadius: '12px',
                    fontSize: '0.75rem',
                    fontWeight: '500'
                  }}>
                    {strategy.complexity.toUpperCase()}
                  </div>
                </div>
                <p style={{ fontSize: '0.75rem', color: '#6b7280', marginBottom: '0.5rem' }}>
                  {strategy.description}
                </p>
                <div style={{ fontSize: '0.75rem', color: '#7c3aed', fontWeight: '500', marginBottom: '0.5rem' }}>
                  {strategy.law_reference}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                    Success: <strong style={{ color: strategy.success_rate > 85 ? '#10b981' : strategy.success_rate > 75 ? '#f59e0b' : '#ef4444' }}>
                      {strategy.success_rate}%
                    </strong>
                  </span>
                  <span style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: '500' }}>
                    {strategy.penalties}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Consumer Law Violations */}
        <div style={{
          background: 'white',
          border: '1px solid #e5e7eb',
          borderRadius: '12px',
          padding: '2rem',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
        }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Scale className="w-6 h-6 text-blue-500" />
            Consumer Law Violations
          </h2>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxHeight: '500px', overflowY: 'auto' }}>
            {violations.map(violation => (
              <div key={violation.id} style={{
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                padding: '1rem',
                background: '#f8fafc'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <h3 style={{ fontWeight: '600', fontSize: '0.875rem' }}>{violation.violation_type}</h3>
                  <div style={{
                    background: '#3b82f6',
                    color: 'white',
                    padding: '0.25rem 0.5rem',
                    borderRadius: '12px',
                    fontSize: '0.75rem',
                    fontWeight: '500'
                  }}>
                    LAW
                  </div>
                </div>
                <p style={{ fontSize: '0.75rem', color: '#6b7280', marginBottom: '0.5rem' }}>
                  {violation.description}
                </p>
                <div style={{ fontSize: '0.75rem', color: '#3b82f6', fontWeight: '500', marginBottom: '0.5rem' }}>
                  {violation.law_section}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: '500' }}>
                    {violation.penalty_amount}
                  </span>
                  <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                    SOL: {violation.statute_of_limitations}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Launch Legal Action */}
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <div style={{
          background: 'linear-gradient(135deg, #7c3aed, #5b21b6)',
          color: 'white',
          padding: '2rem',
          borderRadius: '12px',
          marginBottom: '2rem'
        }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '1rem' }}>
            Ready to Launch Legal Action?
          </h2>
          <p style={{ opacity: 0.9, marginBottom: '1.5rem' }}>
            {selectedStrategy ? legalStrategies.find(s => s.id === selectedStrategy)?.name : 'No strategy selected'}
          </p>
          <button
            onClick={launchLegalDispute}
            disabled={isProcessing || !selectedStrategy}
            style={{
              background: isProcessing ? '#9ca3af' : 'white',
              color: isProcessing ? '#6b7280' : '#7c3aed',
              border: 'none',
              padding: '1rem 2rem',
              borderRadius: '8px',
              fontSize: '1.1rem',
              fontWeight: '600',
              cursor: isProcessing ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              margin: '0 auto'
            }}
          >
            {isProcessing ? (
              <>
                <Clock className="w-5 h-5 animate-spin" />
                Processing Legal Action...
              </>
            ) : (
              <>
                <Gavel className="w-5 h-5" />
                Launch Legal Action
              </>
            )}
          </button>
        </div>
      </div>

      {/* Legal Action Results */}
      {legalResults && (
        <div style={{
          background: 'white',
          border: '1px solid #e5e7eb',
          borderRadius: '12px',
          padding: '2rem',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
          marginBottom: '3rem'
        }}>
          <h3 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <CheckCircle className="w-6 h-6 text-green-500" />
            Legal Action Launched
          </h3>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            <div style={{ textAlign: 'center', padding: '1rem', background: '#f0f9ff', borderRadius: '8px' }}>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#3b82f6' }}>{legalResults.demand_letter_sent ? 'Yes' : 'No'}</div>
              <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Demand Letter</div>
            </div>
            <div style={{ textAlign: 'center', padding: '1rem', background: '#f0fdf4', borderRadius: '8px' }}>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#10b981' }}>{legalResults.attorney_fees_requested ? 'Yes' : 'No'}</div>
              <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Attorney Fees</div>
            </div>
            <div style={{ textAlign: 'center', padding: '1rem', background: '#fefce8', borderRadius: '8px' }}>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#f59e0b' }}>{legalResults.penalty_amount}</div>
              <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Potential Penalty</div>
            </div>
            <div style={{ textAlign: 'center', padding: '1rem', background: '#fdf2f8', borderRadius: '8px' }}>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#ec4899' }}>{legalResults.response_deadline}</div>
              <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Days to Respond</div>
            </div>
          </div>
        </div>
      )}

      {/* Factual Disputes */}
      <div style={{
        background: 'white',
        border: '1px solid #e5e7eb',
        borderRadius: '12px',
        padding: '2rem',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        marginBottom: '3rem'
      }}>
        <h3 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <FileText className="w-6 h-6 text-green-500" />
          Active Factual Disputes
        </h3>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {factualDisputes.map(dispute => (
            <div key={dispute.id} style={{
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              padding: '1.5rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <div>
                  <h4 style={{ fontWeight: '600', marginBottom: '0.25rem' }}>{dispute.account_name}</h4>
                  <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                    {dispute.creditor} • {dispute.dispute_type.toUpperCase()}
                  </p>
                </div>
                <div style={{
                  background: getStatusColor(dispute.status),
                  color: 'white',
                  padding: '0.25rem 0.75rem',
                  borderRadius: '12px',
                  fontSize: '0.75rem',
                  fontWeight: '500'
                }}>
                  {dispute.status.toUpperCase()}
                </div>
              </div>
              
              <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '1rem' }}>
                {dispute.issue_description}
              </p>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                <div>
                  <h5 style={{ fontSize: '0.75rem', fontWeight: '600', color: '#6b7280', marginBottom: '0.25rem' }}>EVIDENCE REQUIRED</h5>
                  <div style={{ fontSize: '0.75rem', color: '#374151' }}>
                    {dispute.evidence_type.join(', ')}
                  </div>
                </div>
                <div>
                  <h5 style={{ fontSize: '0.75rem', fontWeight: '600', color: '#6b7280', marginBottom: '0.25rem' }}>LEGAL BASIS</h5>
                  <div style={{ fontSize: '0.75rem', color: '#374151' }}>
                    {dispute.legal_basis.join(', ')}
                  </div>
                </div>
                <div>
                  <h5 style={{ fontSize: '0.75rem', fontWeight: '600', color: '#6b7280', marginBottom: '0.25rem' }}>DEADLINE</h5>
                  <div style={{ fontSize: '0.75rem', color: '#ef4444', fontWeight: '500' }}>
                    {dispute.deadline}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Legal Resources */}
      <div style={{
        background: 'white',
        border: '1px solid #e5e7eb',
        borderRadius: '12px',
        padding: '2rem',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
      }}>
        <h3 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <BookOpen className="w-6 h-6 text-blue-500" />
          Legal Resources & Templates
        </h3>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
          <div style={{
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            padding: '1.5rem',
            textAlign: 'center'
          }}>
            <FileText className="w-8 h-8 text-blue-500 mx-auto mb-2" />
            <h4 style={{ fontWeight: '600', marginBottom: '0.5rem' }}>FCRA Dispute Letters</h4>
            <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '1rem' }}>
              Professional dispute letters citing specific FCRA violations
            </p>
            <button style={{
              background: '#3b82f6',
              color: 'white',
              border: 'none',
              padding: '0.5rem 1rem',
              borderRadius: '6px',
              fontSize: '0.875rem',
              fontWeight: '500',
              cursor: 'pointer'
            }}>
              Download Templates
            </button>
          </div>
          
          <div style={{
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            padding: '1.5rem',
            textAlign: 'center'
          }}>
            <Gavel className="w-8 h-8 text-purple-500 mx-auto mb-2" />
            <h4 style={{ fontWeight: '600', marginBottom: '0.5rem' }}>Legal Demand Letters</h4>
            <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '1rem' }}>
              Formal legal demands with penalty calculations
            </p>
            <button style={{
              background: '#7c3aed',
              color: 'white',
              border: 'none',
              padding: '0.5rem 1rem',
              borderRadius: '6px',
              fontSize: '0.875rem',
              fontWeight: '500',
              cursor: 'pointer'
            }}>
              Generate Demand
            </button>
          </div>
          
          <div style={{
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            padding: '1.5rem',
            textAlign: 'center'
          }}>
            <Scale className="w-8 h-8 text-green-500 mx-auto mb-2" />
            <h4 style={{ fontWeight: '600', marginBottom: '0.5rem' }}>Violation Calculator</h4>
            <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '1rem' }}>
              Calculate potential penalties and damages
            </p>
            <button style={{
              background: '#10b981',
              color: 'white',
              border: 'none',
              padding: '0.5rem 1rem',
              borderRadius: '6px',
              fontSize: '0.875rem',
              fontWeight: '500',
              cursor: 'pointer'
            }}>
              Calculate Damages
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}


