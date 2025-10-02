'use client';

import { useState, useEffect } from 'react';
import { Target, Shield, Zap, Mail, FileText, Clock, CheckCircle, AlertTriangle, Users, Building2 } from 'lucide-react';
import { api } from '../../lib/api';

interface DisputeTarget {
  id: string;
  name: string;
  type: 'bureau' | 'creditor' | 'collection_agency';
  address: string;
  city: string;
  state: string;
  zip: string;
  phone: string;
  email?: string;
  status: 'active' | 'inactive' | 'verified';
  success_rate: number;
  last_attacked?: string;
}

interface DisputeStrategy {
  id: string;
  name: string;
  description: string;
  success_rate: number;
  complexity: 'basic' | 'advanced' | 'expert';
  targets: string[];
  template: string;
}

interface AttackCampaign {
  id: string;
  name: string;
  targets: DisputeTarget[];
  strategy: DisputeStrategy;
  status: 'draft' | 'active' | 'completed' | 'paused';
  created_at: string;
  letters_sent: number;
  responses_received: number;
}

export default function DisputeAttackSystem() {
  const [selectedTargets, setSelectedTargets] = useState<string[]>([]);
  const [selectedStrategy, setSelectedStrategy] = useState<string>('');
  const [campaigns, setCampaigns] = useState<AttackCampaign[]>([]);
  const [isLaunching, setIsLaunching] = useState(false);
  const [attackResults, setAttackResults] = useState<any>(null);

  const disputeTargets: DisputeTarget[] = [
    // Major Secondary Credit Bureaus
    {
      id: 'lexisnexis',
      name: 'LexisNexis Risk Solutions',
      type: 'bureau',
      address: '9443 Springboro Pike',
      city: 'Miamisburg',
      state: 'OH',
      zip: '45342',
      phone: '(800) 456-1244',
      email: 'consumer.requests@lexisnexis.com',
      status: 'active',
      success_rate: 72
    },
    {
      id: 'lci',
      name: 'LCI Credit Services',
      type: 'bureau',
      address: 'P.O. Box 1357',
      city: 'Carmel',
      state: 'IN',
      zip: '46082',
      phone: '(800) 875-4378',
      email: 'consumer@lci.com',
      status: 'active',
      success_rate: 85
    },
    {
      id: 'innovis',
      name: 'Innovis Data Solutions',
      type: 'bureau',
      address: 'P.O. Box 1689',
      city: 'Pittsburgh',
      state: 'PA',
      zip: '15230',
      phone: '(800) 540-2505',
      email: 'optout@innovis.com',
      status: 'active',
      success_rate: 78
    },
    {
      id: 'ars',
      name: 'ARS (Automotive Remarketing Services)',
      type: 'bureau',
      address: 'P.O. Box 5000',
      city: 'Costa Mesa',
      state: 'CA',
      zip: '92628',
      phone: '(800) 892-7957',
      email: 'consumer@ars.com',
      status: 'active',
      success_rate: 80
    },
    {
      id: 'clarity',
      name: 'Clarity Services',
      type: 'bureau',
      address: 'P.O. Box 112069',
      city: 'Carrollton',
      state: 'TX',
      zip: '75011',
      phone: '(866) 222-5880',
      email: 'disputes@clarityservices.com',
      status: 'active',
      success_rate: 88
    },
    {
      id: 'datax',
      name: 'DataX Limited',
      type: 'bureau',
      address: 'P.O. Box 105028',
      city: 'Atlanta',
      state: 'GA',
      zip: '30348',
      phone: '(800) 764-0141',
      email: 'consumer@datax.com',
      status: 'active',
      success_rate: 82
    },
    {
      id: 'microbilt',
      name: 'MicroBilt Corporation',
      type: 'bureau',
      address: 'P.O. Box 15015',
      city: 'Wilmington',
      state: 'DE',
      zip: '19850',
      phone: '(800) 884-4747',
      email: 'consumer@microbilt.com',
      status: 'active',
      success_rate: 75
    },
    {
      id: 'factor_trust',
      name: 'Factor Trust',
      type: 'bureau',
      address: 'P.O. Box 30501',
      city: 'Salt Lake City',
      state: 'UT',
      zip: '84130',
      phone: '(800) 584-0159',
      email: 'consumer@factortrust.com',
      status: 'active',
      success_rate: 83
    },
    {
      id: 'credco',
      name: 'CREDCO',
      type: 'bureau',
      address: 'P.O. Box 105028',
      city: 'Atlanta',
      state: 'GA',
      zip: '30348',
      phone: '(800) 443-9342',
      email: 'consumer@credco.com',
      status: 'active',
      success_rate: 77
    },
    {
      id: 'sagestream',
      name: 'SageStream LLC',
      type: 'bureau',
      address: 'P.O. Box 503793',
      city: 'San Diego',
      state: 'CA',
      zip: '92150',
      phone: '(877) 256-3836',
      email: 'consumer@sagestream.com',
      status: 'active',
      success_rate: 85
    },
    {
      id: 'chexsystems',
      name: 'ChexSystems',
      type: 'bureau',
      address: '7805 Hudson Road, Suite 100',
      city: 'Woodbury',
      state: 'MN',
      zip: '55125',
      phone: '(800) 428-9623',
      email: 'consumer@chexsystems.com',
      status: 'active',
      success_rate: 88
    },
    {
      id: 'earlywarning',
      name: 'Early Warning Services',
      type: 'bureau',
      address: '16552 North 90th Street',
      city: 'Scottsdale',
      state: 'AZ',
      zip: '85260',
      phone: '(800) 325-7775',
      email: 'consumer@earlywarning.com',
      status: 'active',
      success_rate: 82
    },
    // Major Creditors
    {
      id: 'chase',
      name: 'JPMorgan Chase Bank',
      type: 'creditor',
      address: 'P.O. Box 15129',
      city: 'Wilmington',
      state: 'DE',
      zip: '19886',
      phone: '(800) 935-9935',
      email: 'chase@jpmchase.com',
      status: 'active',
      success_rate: 65
    },
    {
      id: 'capital_one',
      name: 'Capital One Bank',
      type: 'creditor',
      address: 'P.O. Box 30285',
      city: 'Salt Lake City',
      state: 'UT',
      zip: '84130',
      phone: '(800) 955-6600',
      email: 'disputes@capitalone.com',
      status: 'active',
      success_rate: 70
    },
    {
      id: 'wells_fargo',
      name: 'Wells Fargo Bank',
      type: 'creditor',
      address: 'P.O. Box 51193',
      city: 'Los Angeles',
      state: 'CA',
      zip: '90051',
      phone: '(800) 869-3557',
      email: 'disputes@wellsfargo.com',
      status: 'active',
      success_rate: 68
    },
    {
      id: 'bank_of_america',
      name: 'Bank of America',
      type: 'creditor',
      address: 'P.O. Box 982234',
      city: 'El Paso',
      state: 'TX',
      zip: '79998',
      phone: '(800) 732-9194',
      email: 'disputes@bankofamerica.com',
      status: 'active',
      success_rate: 62
    },
    // Collection Agencies
    {
      id: 'portfolio_recovery',
      name: 'Portfolio Recovery Associates',
      type: 'collection_agency',
      address: '120 Corporate Blvd',
      city: 'Norfolk',
      state: 'VA',
      zip: '23502',
      phone: '(800) 772-1413',
      email: 'disputes@portfoliorecovery.com',
      status: 'active',
      success_rate: 90
    },
    {
      id: 'midland_credit',
      name: 'Midland Credit Management',
      type: 'collection_agency',
      address: '8875 Aero Drive, Suite 200',
      city: 'San Diego',
      state: 'CA',
      zip: '92123',
      phone: '(800) 825-8131',
      email: 'disputes@midlandcredit.com',
      status: 'active',
      success_rate: 87
    }
  ];

  const disputeStrategies: DisputeStrategy[] = [
    {
      id: 'identity_theft',
      name: 'Identity Theft Dispute',
      description: 'Claim unauthorized accounts due to identity theft with police report',
      success_rate: 95,
      complexity: 'advanced',
      targets: ['bureau', 'creditor', 'collection_agency'],
      template: 'identity_theft'
    },
    {
      id: 'not_mine',
      name: 'Not Mine Dispute',
      description: 'Simple "not mine" dispute for unrecognized accounts',
      success_rate: 75,
      complexity: 'basic',
      targets: ['bureau', 'creditor', 'collection_agency'],
      template: 'not_mine'
    },
    {
      id: 'never_late',
      name: 'Never Late Dispute',
      description: 'Dispute late payments with payment history evidence',
      success_rate: 80,
      complexity: 'advanced',
      targets: ['bureau', 'creditor'],
      template: 'never_late'
    },
    {
      id: 'duplicate_account',
      name: 'Duplicate Account Dispute',
      description: 'Identify and dispute duplicate or merged accounts',
      success_rate: 85,
      complexity: 'advanced',
      targets: ['bureau', 'creditor'],
      template: 'duplicate'
    },
    {
      id: 'outdated_info',
      name: 'Outdated Information Dispute',
      description: 'Dispute accounts beyond 7-year reporting limit',
      success_rate: 92,
      complexity: 'basic',
      targets: ['bureau'],
      template: 'outdated'
    },
    {
      id: 'account_mixed',
      name: 'Account Mixed File Dispute',
      description: 'Claim account information belongs to someone else',
      success_rate: 88,
      complexity: 'expert',
      targets: ['bureau', 'creditor'],
      template: 'mixed_file'
    },
    {
      id: 'validation_request',
      name: 'Debt Validation Request',
      description: 'Request complete validation of debt from collector',
      success_rate: 70,
      complexity: 'basic',
      targets: ['collection_agency'],
      template: 'validation'
    },
    {
      id: 'cease_desist',
      name: 'Cease and Desist',
      description: 'Demand collector stop all communication',
      success_rate: 95,
      complexity: 'basic',
      targets: ['collection_agency'],
      template: 'cease_desist'
    }
  ];

  const handleTargetToggle = (targetId: string) => {
    setSelectedTargets(prev => {
      if (prev.includes(targetId)) {
        return prev.filter(id => id !== targetId);
      } else {
        return [...prev, targetId];
      }
    });
  };

  const handleStrategySelect = (strategyId: string) => {
    setSelectedStrategy(strategyId);
  };

  const launchAttack = async () => {
    if (selectedTargets.length === 0 || !selectedStrategy) {
      alert('Please select targets and strategy');
      return;
    }

    setIsLaunching(true);
    try {
      const response = await api('/disputes/launch-attack', {
        method: 'POST',
        body: JSON.stringify({
          targets: selectedTargets,
          strategy: selectedStrategy,
          user_id: 'current',
          certified_mail: true,
          return_receipt: true,
          tracking_enabled: true
        })
      });

      setAttackResults(response);
      
      // Add to campaigns
      const newCampaign: AttackCampaign = {
        id: `campaign_${Date.now()}`,
        name: `${disputeStrategies.find(s => s.id === selectedStrategy)?.name} Attack`,
        targets: disputeTargets.filter(t => selectedTargets.includes(t.id)),
        strategy: disputeStrategies.find(s => s.id === selectedStrategy)!,
        status: 'active',
        created_at: new Date().toISOString(),
        letters_sent: selectedTargets.length,
        responses_received: 0
      };

      setCampaigns(prev => [...prev, newCampaign]);
      
    } catch (err: any) {
      console.error('Attack failed:', err);
    } finally {
      setIsLaunching(false);
    }
  };

  const getTargetIcon = (type: DisputeTarget['type']) => {
    switch (type) {
      case 'bureau': return <Building2 className="w-5 h-5" />;
      case 'creditor': return <Users className="w-5 h-5" />;
      case 'collection_agency': return <AlertTriangle className="w-5 h-5" />;
    }
  };

  const getComplexityColor = (complexity: DisputeStrategy['complexity']) => {
    switch (complexity) {
      case 'basic': return '#10b981';
      case 'advanced': return '#f59e0b';
      case 'expert': return '#ef4444';
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
          background: 'linear-gradient(135deg, #dc2626, #991b1b)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          Direct Dispute Attack System
        </h1>
        <p style={{ fontSize: '1.2rem', color: '#6b7280', marginBottom: '2rem' }}>
          Launch targeted disputes against secondary bureaus, creditors, and collection agencies with advanced strategies.
        </p>
      </div>

      {/* Attack Dashboard */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '3rem' }}>
        
        {/* Target Selection */}
        <div style={{
          background: 'white',
          border: '1px solid #e5e7eb',
          borderRadius: '12px',
          padding: '2rem',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
        }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Target className="w-6 h-6 text-red-500" />
            Select Attack Targets
          </h2>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxHeight: '400px', overflowY: 'auto' }}>
            {disputeTargets.map(target => (
              <div key={target.id} style={{
                border: selectedTargets.includes(target.id) ? '2px solid #dc2626' : '1px solid #e5e7eb',
                borderRadius: '8px',
                padding: '1rem',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              onClick={() => handleTargetToggle(target.id)}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{ color: selectedTargets.includes(target.id) ? '#dc2626' : '#6b7280' }}>
                      {getTargetIcon(target.type)}
                    </div>
                    <h3 style={{ fontWeight: '600', fontSize: '0.875rem' }}>{target.name}</h3>
                  </div>
                  <div style={{
                    background: target.success_rate > 80 ? '#10b981' : target.success_rate > 70 ? '#f59e0b' : '#ef4444',
                    color: 'white',
                    padding: '0.25rem 0.5rem',
                    borderRadius: '12px',
                    fontSize: '0.75rem',
                    fontWeight: '500'
                  }}>
                    {target.success_rate}% Success
                  </div>
                </div>
                <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                  {target.address}, {target.city}, {target.state} {target.zip}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Strategy Selection */}
        <div style={{
          background: 'white',
          border: '1px solid #e5e7eb',
          borderRadius: '12px',
          padding: '2rem',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
        }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Zap className="w-6 h-6 text-yellow-500" />
            Choose Attack Strategy
          </h2>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxHeight: '400px', overflowY: 'auto' }}>
            {disputeStrategies.map(strategy => (
              <div key={strategy.id} style={{
                border: selectedStrategy === strategy.id ? '2px solid #f59e0b' : '1px solid #e5e7eb',
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
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                    Success Rate: <strong style={{ color: strategy.success_rate > 80 ? '#10b981' : strategy.success_rate > 70 ? '#f59e0b' : '#ef4444' }}>
                      {strategy.success_rate}%
                    </strong>
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Launch Attack Section */}
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <div style={{
          background: 'linear-gradient(135deg, #dc2626, #991b1b)',
          color: 'white',
          padding: '2rem',
          borderRadius: '12px',
          marginBottom: '2rem'
        }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '1rem' }}>
            Ready to Launch Attack?
          </h2>
          <p style={{ opacity: 0.9, marginBottom: '1.5rem' }}>
            {selectedTargets.length} targets selected • {selectedStrategy ? disputeStrategies.find(s => s.id === selectedStrategy)?.name : 'No strategy selected'}
          </p>
          <button
            onClick={launchAttack}
            disabled={isLaunching || selectedTargets.length === 0 || !selectedStrategy}
            style={{
              background: isLaunching ? '#9ca3af' : 'white',
              color: isLaunching ? '#6b7280' : '#dc2626',
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
                Launching Attack...
              </>
            ) : (
              <>
                <Zap className="w-5 h-5" />
                Launch Attack ({selectedTargets.length} targets)
              </>
            )}
          </button>
        </div>
      </div>

      {/* Attack Results */}
      {attackResults && (
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
            Attack Launched Successfully
          </h3>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            <div style={{ textAlign: 'center', padding: '1rem', background: '#f0f9ff', borderRadius: '8px' }}>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#2563eb' }}>{attackResults.letters_sent}</div>
              <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Letters Sent</div>
            </div>
            <div style={{ textAlign: 'center', padding: '1rem', background: '#f0fdf4', borderRadius: '8px' }}>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#10b981' }}>{attackResults.certified_mail ? 'Yes' : 'No'}</div>
              <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Certified Mail</div>
            </div>
            <div style={{ textAlign: 'center', padding: '1rem', background: '#fefce8', borderRadius: '8px' }}>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#f59e0b' }}>{attackResults.tracking_id}</div>
              <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Tracking ID</div>
            </div>
            <div style={{ textAlign: 'center', padding: '1rem', background: '#fdf2f8', borderRadius: '8px' }}>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#ec4899' }}>30</div>
              <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>Days to Respond</div>
            </div>
          </div>
        </div>
      )}

      {/* Active Campaigns */}
      {campaigns.length > 0 && (
        <div style={{
          background: 'white',
          border: '1px solid #e5e7eb',
          borderRadius: '12px',
          padding: '2rem',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
        }}>
          <h3 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '1.5rem' }}>
            Active Attack Campaigns
          </h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {campaigns.map(campaign => (
              <div key={campaign.id} style={{
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                padding: '1.5rem'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                  <div>
                    <h4 style={{ fontWeight: '600', marginBottom: '0.25rem' }}>{campaign.name}</h4>
                    <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                      {campaign.targets.length} targets • {campaign.strategy.name}
                    </p>
                  </div>
                  <div style={{
                    background: campaign.status === 'active' ? '#10b981' : '#6b7280',
                    color: 'white',
                    padding: '0.25rem 0.75rem',
                    borderRadius: '12px',
                    fontSize: '0.75rem',
                    fontWeight: '500'
                  }}>
                    {campaign.status.toUpperCase()}
                  </div>
                </div>
                
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem' }}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#2563eb' }}>{campaign.letters_sent}</div>
                    <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>Letters Sent</div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#10b981' }}>{campaign.responses_received}</div>
                    <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>Responses</div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#f59e0b' }}>{campaign.strategy.success_rate}%</div>
                    <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>Success Rate</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
