'use client';

import { useState, useEffect } from 'react';
import { Building2, Target, Zap, Shield, CheckCircle, AlertTriangle, Clock, FileText } from 'lucide-react';
import { api } from '../../../lib/api';

interface SpecialtyBureau {
  id: string;
  name: string;
  full_name: string;
  type: 'consumer' | 'commercial' | 'banking' | 'automotive' | 'employment';
  address: string;
  city: string;
  state: string;
  zip: string;
  phone: string;
  email: string;
  website: string;
  description: string;
  data_types: string[];
  success_rate: number;
  dispute_method: 'mail' | 'online' | 'both';
  response_time: string;
  special_requirements: string[];
}

export default function SpecialtyBureausDisputing() {
  const [selectedBureaus, setSelectedBureaus] = useState<string[]>([]);
  const [disputeType, setDisputeType] = useState<string>('');
  const [isLaunching, setIsLaunching] = useState(false);
  const [disputeResults, setDisputeResults] = useState<any>(null);

  const specialtyBureaus: SpecialtyBureau[] = [
    {
      id: 'lexisnexis',
      name: 'LexisNexis',
      full_name: 'LexisNexis Risk Solutions',
      type: 'consumer',
      address: '9443 Springboro Pike',
      city: 'Miamisburg',
      state: 'OH',
      zip: '45342',
      phone: '(800) 456-1244',
      email: 'consumer.requests@lexisnexis.com',
      website: 'https://personalreports.lexisnexis.com',
      description: 'One of the largest consumer reporting agencies specializing in risk assessment and fraud prevention',
      data_types: ['Public Records', 'Identity Verification', 'Risk Scores', 'Address History'],
      success_rate: 72,
      dispute_method: 'both',
      response_time: '30 days',
      special_requirements: ['Government-issued ID', 'Proof of address', 'SSN verification']
    },
    {
      id: 'lci',
      name: 'LCI',
      full_name: 'LCI Credit Services',
      type: 'consumer',
      address: 'P.O. Box 1357',
      city: 'Carmel',
      state: 'IN',
      zip: '46082',
      phone: '(800) 875-4378',
      email: 'consumer@lci.com',
      website: 'https://www.lci.com',
      description: 'Specializes in consumer credit information and employment screening',
      data_types: ['Credit Information', 'Employment History', 'Identity Verification'],
      success_rate: 85,
      dispute_method: 'both',
      response_time: '30 days',
      special_requirements: ['Government-issued ID', 'Proof of identity']
    },
    {
      id: 'innovis',
      name: 'Innovis',
      full_name: 'Innovis Data Solutions',
      type: 'consumer',
      address: 'P.O. Box 1689',
      city: 'Pittsburgh',
      state: 'PA',
      zip: '15230',
      phone: '(800) 540-2505',
      email: 'optout@innovis.com',
      website: 'https://www.innovis.com',
      description: 'Fourth major credit bureau focusing on credit reporting and fraud prevention',
      data_types: ['Credit Reports', 'Fraud Alerts', 'Credit Monitoring'],
      success_rate: 78,
      dispute_method: 'both',
      response_time: '30 days',
      special_requirements: ['Government-issued ID', 'Proof of address']
    },
    {
      id: 'ars',
      name: 'ARS',
      full_name: 'Automotive Remarketing Services',
      type: 'automotive',
      address: 'P.O. Box 5000',
      city: 'Costa Mesa',
      state: 'CA',
      zip: '92628',
      phone: '(800) 892-7957',
      email: 'consumer@ars.com',
      website: 'https://www.ars.com',
      description: 'Specializes in automotive lending and leasing information',
      data_types: ['Auto Loan History', 'Lease Information', 'Repossession Records'],
      success_rate: 80,
      dispute_method: 'mail',
      response_time: '30 days',
      special_requirements: ['Government-issued ID', 'Vehicle information', 'Loan documentation']
    },
    {
      id: 'clarity',
      name: 'Clarity',
      full_name: 'Clarity Services',
      type: 'consumer',
      address: 'P.O. Box 112069',
      city: 'Carrollton',
      state: 'TX',
      zip: '75011',
      phone: '(866) 222-5880',
      email: 'disputes@clarityservices.com',
      website: 'https://www.clarityservices.com',
      description: 'Specializes in alternative credit data and short-term lending information',
      data_types: ['Alternative Credit', 'Payday Loans', 'Short-term Lending', 'Bank Account History'],
      success_rate: 88,
      dispute_method: 'both',
      response_time: '30 days',
      special_requirements: ['Government-issued ID', 'Bank statements', 'Proof of payments']
    },
    {
      id: 'datax',
      name: 'DataX',
      full_name: 'DataX Limited',
      type: 'consumer',
      address: 'P.O. Box 105028',
      city: 'Atlanta',
      state: 'GA',
      zip: '30348',
      phone: '(800) 764-0141',
      email: 'consumer@datax.com',
      website: 'https://www.datax.com',
      description: 'Consumer reporting agency specializing in credit and identity verification',
      data_types: ['Credit Information', 'Identity Verification', 'Address History', 'Phone Records'],
      success_rate: 82,
      dispute_method: 'both',
      response_time: '30 days',
      special_requirements: ['Government-issued ID', 'Proof of address', 'Phone records']
    },
    {
      id: 'microbilt',
      name: 'MicroBilt',
      full_name: 'MicroBilt Corporation',
      type: 'consumer',
      address: 'P.O. Box 15015',
      city: 'Wilmington',
      state: 'DE',
      zip: '19850',
      phone: '(800) 884-4747',
      email: 'consumer@microbilt.com',
      website: 'https://www.microbilt.com',
      description: 'Provides consumer and commercial credit information and risk assessment',
      data_types: ['Credit Reports', 'Risk Scores', 'Identity Verification', 'Commercial Data'],
      success_rate: 75,
      dispute_method: 'both',
      response_time: '30 days',
      special_requirements: ['Government-issued ID', 'Proof of identity', 'Business documentation']
    },
    {
      id: 'factor_trust',
      name: 'Factor Trust',
      full_name: 'Factor Trust',
      type: 'consumer',
      address: 'P.O. Box 30501',
      city: 'Salt Lake City',
      state: 'UT',
      zip: '84130',
      phone: '(800) 584-0159',
      email: 'consumer@factortrust.com',
      website: 'https://www.factortrust.com',
      description: 'Consumer reporting agency focusing on alternative credit data and lending information',
      data_types: ['Alternative Credit', 'Lending History', 'Payment Patterns', 'Risk Assessment'],
      success_rate: 83,
      dispute_method: 'both',
      response_time: '30 days',
      special_requirements: ['Government-issued ID', 'Payment history', 'Lending documentation']
    },
    {
      id: 'credco',
      name: 'CREDCO',
      full_name: 'CREDCO',
      type: 'consumer',
      address: 'P.O. Box 105028',
      city: 'Atlanta',
      state: 'GA',
      zip: '30348',
      phone: '(800) 443-9342',
      email: 'consumer@credco.com',
      website: 'https://www.credco.com',
      description: 'Consumer reporting agency specializing in mortgage and lending credit information',
      data_types: ['Mortgage Credit', 'Lending History', 'Property Information', 'Credit Scores'],
      success_rate: 77,
      dispute_method: 'both',
      response_time: '30 days',
      special_requirements: ['Government-issued ID', 'Mortgage documents', 'Property information']
    },
    {
      id: 'chexsystems',
      name: 'ChexSystems',
      full_name: 'ChexSystems',
      type: 'banking',
      address: '7805 Hudson Road, Suite 100',
      city: 'Woodbury',
      state: 'MN',
      zip: '55125',
      phone: '(800) 428-9623',
      email: 'consumer@chexsystems.com',
      website: 'https://www.chexsystems.com',
      description: 'Specializes in banking and checking account history',
      data_types: ['Banking History', 'Checking Account Records', 'Fraud Reports', 'Account Closures'],
      success_rate: 88,
      dispute_method: 'both',
      response_time: '30 days',
      special_requirements: ['Government-issued ID', 'Bank statements', 'Account documentation']
    },
    {
      id: 'earlywarning',
      name: 'Early Warning',
      full_name: 'Early Warning Services',
      type: 'banking',
      address: '16552 North 90th Street',
      city: 'Scottsdale',
      state: 'AZ',
      zip: '85260',
      phone: '(800) 325-7775',
      email: 'consumer@earlywarning.com',
      website: 'https://www.earlywarning.com',
      description: 'Banking verification and fraud prevention services',
      data_types: ['Bank Account Verification', 'Fraud Prevention', 'Identity Verification', 'Account History'],
      success_rate: 82,
      dispute_method: 'both',
      response_time: '30 days',
      special_requirements: ['Government-issued ID', 'Bank account information', 'Proof of identity']
    }
  ];

  const disputeTypes = [
    {
      id: 'not_mine',
      name: 'Not Mine Dispute',
      description: 'Simple "not mine" dispute for unrecognized information',
      success_rate: 75,
      complexity: 'basic'
    },
    {
      id: 'factual_error',
      name: 'Factual Error Dispute',
      description: 'Dispute factual inaccuracies with supporting documentation',
      success_rate: 80,
      complexity: 'intermediate'
    },
    {
      id: 'identity_theft',
      name: 'Identity Theft Dispute',
      description: 'Claim information is due to identity theft with police report',
      success_rate: 95,
      complexity: 'advanced'
    },
    {
      id: 'outdated_info',
      name: 'Outdated Information Dispute',
      description: 'Dispute information beyond reporting time limits',
      success_rate: 92,
      complexity: 'basic'
    },
    {
      id: 'mixed_file',
      name: 'Mixed File Dispute',
      description: 'Claim information belongs to someone else',
      success_rate: 88,
      complexity: 'advanced'
    }
  ];

  const handleBureauToggle = (bureauId: string) => {
    setSelectedBureaus(prev => {
      if (prev.includes(bureauId)) {
        return prev.filter(id => id !== bureauId);
      } else {
        return [...prev, bureauId];
      }
    });
  };

  const handleDisputeTypeSelect = (typeId: string) => {
    setDisputeType(typeId);
  };

  const launchSpecialtyDisputes = async () => {
    if (selectedBureaus.length === 0 || !disputeType) {
      alert('Please select bureaus and dispute type');
      return;
    }

    setIsLaunching(true);
    try {
      const response = await api('/disputes/specialty-bureaus', {
        method: 'POST',
        body: JSON.stringify({
          bureaus: selectedBureaus,
          dispute_type: disputeType,
          user_id: 'current',
          certified_mail: true,
          return_receipt: true,
          tracking_enabled: true
        })
      });

      setDisputeResults(response);
      
    } catch (err: any) {
      console.error('Specialty disputes failed:', err);
    } finally {
      setIsLaunching(false);
    }
  };

  const getTypeColor = (type: SpecialtyBureau['type']) => {
    switch (type) {
      case 'consumer': return '#3b82f6';
      case 'commercial': return '#8b5cf6';
      case 'banking': return '#10b981';
      case 'automotive': return '#f59e0b';
      case 'employment': return '#ef4444';
    }
  };

  const getSuccessRateColor = (rate: number) => {
    if (rate >= 85) return '#10b981';
    if (rate >= 75) return '#f59e0b';
    return '#ef4444';
  };

  return (
    <div style={{ padding: '2rem 1rem', maxWidth: '1400px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: '3rem' }}>
        <h1 style={{ 
          fontSize: '2.5rem', 
          fontWeight: 'bold', 
          marginBottom: '1rem',
          background: 'linear-gradient(135deg, #059669, #047857)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          Specialty Credit Bureaus
        </h1>
        <p style={{ fontSize: '1.2rem', color: '#6b7280', marginBottom: '2rem' }}>
          Target secondary credit bureaus and specialty reporting agencies with precision disputes.
        </p>
      </div>

      {/* Bureau Selection */}
      <div style={{ marginBottom: '3rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Building2 className="w-6 h-6 text-green-500" />
          Select Specialty Bureaus
        </h2>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '1.5rem' }}>
          {specialtyBureaus.map(bureau => (
            <div key={bureau.id} style={{
              border: selectedBureaus.includes(bureau.id) ? '2px solid #059669' : '1px solid #e5e7eb',
              borderRadius: '12px',
              padding: '1.5rem',
              cursor: 'pointer',
              transition: 'all 0.2s',
              background: 'white',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            }}
            onClick={() => handleBureauToggle(bureau.id)}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <div>
                  <h3 style={{ fontWeight: '600', marginBottom: '0.25rem' }}>{bureau.full_name}</h3>
                  <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>{bureau.description}</p>
                </div>
                <div style={{
                  background: getTypeColor(bureau.type),
                  color: 'white',
                  padding: '0.25rem 0.5rem',
                  borderRadius: '12px',
                  fontSize: '0.75rem',
                  fontWeight: '500'
                }}>
                  {bureau.type.toUpperCase()}
                </div>
              </div>
              
              <div style={{ marginBottom: '1rem' }}>
                <div style={{ fontSize: '0.75rem', color: '#6b7280', marginBottom: '0.25rem' }}>
                  <strong>Address:</strong> {bureau.address}, {bureau.city}, {bureau.state} {bureau.zip}
                </div>
                <div style={{ fontSize: '0.75rem', color: '#6b7280', marginBottom: '0.25rem' }}>
                  <strong>Phone:</strong> {bureau.phone}
                </div>
                <div style={{ fontSize: '0.75rem', color: '#6b7280', marginBottom: '0.25rem' }}>
                  <strong>Email:</strong> {bureau.email}
                </div>
                <div style={{ fontSize: '0.75rem', color: '#6b7280', marginBottom: '0.5rem' }}>
                  <strong>Data Types:</strong> {bureau.data_types.join(', ')}
                </div>
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{
                  background: getSuccessRateColor(bureau.success_rate),
                  color: 'white',
                  padding: '0.25rem 0.75rem',
                  borderRadius: '12px',
                  fontSize: '0.75rem',
                  fontWeight: '500'
                }}>
                  {bureau.success_rate}% Success Rate
                </div>
                <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                  Response: {bureau.response_time}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Dispute Type Selection */}
      <div style={{ marginBottom: '3rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Target className="w-6 h-6 text-blue-500" />
          Choose Dispute Strategy
        </h2>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
          {disputeTypes.map(type => (
            <div key={type.id} style={{
              border: disputeType === type.id ? '2px solid #3b82f6' : '1px solid #e5e7eb',
              borderRadius: '8px',
              padding: '1.5rem',
              cursor: 'pointer',
              transition: 'all 0.2s',
              background: 'white',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            }}
            onClick={() => handleDisputeTypeSelect(type.id)}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                <h3 style={{ fontWeight: '600', fontSize: '1rem' }}>{type.name}</h3>
                <div style={{
                  background: type.complexity === 'basic' ? '#10b981' : type.complexity === 'intermediate' ? '#f59e0b' : '#ef4444',
                  color: 'white',
                  padding: '0.25rem 0.5rem',
                  borderRadius: '12px',
                  fontSize: '0.75rem',
                  fontWeight: '500'
                }}>
                  {type.complexity.toUpperCase()}
                </div>
              </div>
              
              <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '1rem' }}>
                {type.description}
              </p>
              
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                  Success Rate: <strong style={{ color: getSuccessRateColor(type.success_rate) }}>
                    {type.success_rate}%
                  </strong>
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Launch Disputes */}
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <div style={{
          background: 'linear-gradient(135deg, #059669, #047857)',
          color: 'white',
          padding: '2rem',
          borderRadius: '12px',
          marginBottom: '2rem'
        }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '1rem' }}>
            Ready to Launch Specialty Disputes?
          </h2>
          <p style={{ opacity: 0.9, marginBottom: '1.5rem' }}>
            {selectedBureaus.length} bureaus selected • {disputeType ? disputeTypes.find(t => t.id === disputeType)?.name : 'No strategy selected'}
          </p>
          <button
            onClick={launchSpecialtyDisputes}
            disabled={isLaunching || selectedBureaus.length === 0 || !disputeType}
            style={{
              background: isLaunching ? '#9ca3af' : 'white',
              color: isLaunching ? '#6b7280' : '#059669',
              border: 'none',
              padding: '1rem 2rem',
              borderRadius: '8px',
              fontSize: '1.1rem',
              fontWeight: '600',
              cursor: isLaunching ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              margin: '0 auto'
            }}
          >
            {isLaunching ? (
              <>
                <Clock className="w-5 h-5 animate-spin" />
                Launching Disputes...
              </>
            ) : (
              <>
                <Zap className="w-5 h-5" />
                Launch Disputes ({selectedBureaus.length} bureaus)
              </>
            )}
          </button>
        </div>
      </div>

      {/* Dispute Results */}
      {disputeResults && (
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
            Specialty Disputes Launched
          </h3>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            <div style={{ textAlign: 'center', padding: '1rem', background: '#f0f9ff', borderRadius: '8px' }}>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#3b82f6' }}>{disputeResults.disputes_sent}</div>
              <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Disputes Sent</div>
            </div>
            <div style={{ textAlign: 'center', padding: '1rem', background: '#f0fdf4', borderRadius: '8px' }}>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#10b981' }}>{disputeResults.certified_mail ? 'Yes' : 'No'}</div>
              <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Certified Mail</div>
            </div>
            <div style={{ textAlign: 'center', padding: '1rem', background: '#fefce8', borderRadius: '8px' }}>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#f59e0b' }}>{disputeResults.estimated_success}</div>
              <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Est. Success Rate</div>
            </div>
            <div style={{ textAlign: 'center', padding: '1rem', background: '#fdf2f8', borderRadius: '8px' }}>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#ec4899' }}>30</div>
              <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Days to Respond</div>
            </div>
          </div>
        </div>
      )}

      {/* Bureau Information */}
      <div style={{
        background: 'white',
        border: '1px solid #e5e7eb',
        borderRadius: '12px',
        padding: '2rem',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
      }}>
        <h3 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <FileText className="w-6 h-6 text-green-500" />
          Specialty Bureau Information
        </h3>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
          <div style={{
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            padding: '1.5rem',
            textAlign: 'center'
          }}>
            <Shield className="w-8 h-8 text-blue-500 mx-auto mb-2" />
            <h4 style={{ fontWeight: '600', marginBottom: '0.5rem' }}>FCRA Compliance</h4>
            <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '1rem' }}>
              All specialty bureaus must comply with FCRA requirements for dispute resolution
            </p>
          </div>
          
          <div style={{
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            padding: '1.5rem',
            textAlign: 'center'
          }}>
            <Clock className="w-8 h-8 text-green-500 mx-auto mb-2" />
            <h4 style={{ fontWeight: '600', marginBottom: '0.5rem' }}>30-Day Response</h4>
            <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '1rem' }}>
              Bureaus have 30 days to investigate and respond to disputes
            </p>
          </div>
          
          <div style={{
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            padding: '1.5rem',
            textAlign: 'center'
          }}>
            <AlertTriangle className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
            <h4 style={{ fontWeight: '600', marginBottom: '0.5rem' }}>Special Requirements</h4>
            <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '1rem' }}>
              Each bureau may have specific documentation requirements
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

