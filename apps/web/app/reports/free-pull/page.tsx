'use client';

import { useState, useEffect } from 'react';
import { CreditCard, Shield, Clock, Download, AlertCircle, CheckCircle, Upload, FileText, Camera, Brain, Target } from 'lucide-react';
import { api } from '../../api';

interface BureauStatus {
  annual_credit_report: {
    available: boolean;
    last_pull: string | null;
    next_available: string;
    cost: string;
    api_available?: boolean;
    connected?: boolean;
  };
  experian: {
    connected: boolean;
    api_available: boolean;
    last_pull: string | null;
    cost: string;
  };
  equifax: {
    connected: boolean;
    api_available: boolean;
    last_pull: string | null;
    cost: string;
  };
  transunion: {
    connected: boolean;
    api_available: boolean;
    last_pull: string | null;
    cost: string;
  };
}

interface PullResult {
  success: boolean;
  user_id: string;
  reports_pulled: Record<string, any>;
  next_available_date: string;
  instructions: any;
  portal_integration_available?: boolean;
  message?: string;
  available_portals?: Array<{ name: string }>;
}

interface DocumentUpload {
  id: string;
  file: File;
  type: 'drivers_license' | 'passport' | 'utility_bill' | 'bank_statement' | 'ssn_card' | 'pay_stub';
  status: 'uploading' | 'uploaded' | 'verified' | 'rejected';
}

export default function FreeCreditReportPull() {
  const [userInfo, setUserInfo] = useState({
    first_name: '',
    last_name: '',
    ssn: '',
    date_of_birth: '',
    address: '',
    city: '',
    state: '',
    zip_code: '',
    email: '',
    phone: ''
  });
  
  const [selectedBureaus, setSelectedBureaus] = useState(['ai_analysis']);
  const [bureauStatus, setBureauStatus] = useState<BureauStatus | null>(null);
  const [isPulling, setIsPulling] = useState(false);
  const [pullResult, setPullResult] = useState<PullResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [uploadedDocuments, setUploadedDocuments] = useState<DocumentUpload[]>([]);
  const [eOscarBypassEnabled, setEOscarBypassEnabled] = useState(false);
  const [creditAnalysis, setCreditAnalysis] = useState<any>(null);
  const [disputeRecommendations, setDisputeRecommendations] = useState<any[]>([]);

  useEffect(() => {
    fetchBureauStatus();
  }, []);

  const fetchBureauStatus = async () => {
    try {
      const response = await api('/credit-bureaus/bureau-status?user_id=current_user');
      const validatedResponse: BureauStatus = {
        annual_credit_report: response?.annual_credit_report || {
          available: true,
          last_pull: null,
          next_available: "Available now",
          cost: "Free"
        },
        experian: response?.experian || {
          connected: false,
          api_available: false,
          last_pull: null,
          cost: "Paid API"
        },
        equifax: response?.equifax || {
          connected: false,
          api_available: false,
          last_pull: null,
          cost: "Paid API"
        },
        transunion: response?.transunion || {
          connected: false,
          api_available: false,
          last_pull: null,
          cost: "Paid API"
        }
      };
      setBureauStatus(validatedResponse);
    } catch (err) {
      console.error('Failed to fetch bureau status:', err);
      setBureauStatus({
        annual_credit_report: {
          available: true,
          last_pull: null,
          next_available: "Available now",
          cost: "Free"
        },
        experian: {
          connected: false,
          api_available: false,
          last_pull: null,
          cost: "Paid API"
        },
        equifax: {
          connected: false,
          api_available: false,
          last_pull: null,
          cost: "Paid API"
        },
        transunion: {
          connected: false,
          api_available: false,
          last_pull: null,
          cost: "Paid API"
        }
      });
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setUserInfo(prev => ({ ...prev, [field]: value }));
  };

  const handleBureauToggle = (bureau: string) => {
    setSelectedBureaus(prev => {
      if (prev.includes(bureau)) {
        return prev.filter(b => b !== bureau);
      } else {
        return [...prev, bureau];
      }
    });
  };

  const handleDocumentUpload = async (file: File, type: DocumentUpload['type']) => {
    const documentId = `${type}_${Date.now()}`;
    const newDocument: DocumentUpload = {
      id: documentId,
      file,
      type,
      status: 'uploading'
    };

    setUploadedDocuments(prev => [...prev, newDocument]);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', type);
      formData.append('user_id', 'current');

      const response = await api('/documents/upload', {
        method: 'POST',
        body: formData
      });

      setUploadedDocuments(prev => 
        prev.map(doc => 
          doc.id === documentId 
            ? { ...doc, status: response.verified ? 'verified' : 'rejected' }
            : doc
        )
      );
    } catch (err) {
      setUploadedDocuments(prev => 
        prev.map(doc => 
          doc.id === documentId 
            ? { ...doc, status: 'rejected' }
            : doc
        )
      );
    }
  };

  const handlePullReports = async () => {
    setIsPulling(true);
    setError(null);
    
    try {
      const response = await api('/credit-bureaus/free-pull', {
        method: 'POST',
        body: JSON.stringify({
          user_id: 'current',
          ...userInfo,
          preferred_bureaus: selectedBureaus,
          e_oscar_bypass: eOscarBypassEnabled,
          documents: uploadedDocuments.map(doc => ({
            type: doc.type,
            status: doc.status,
            file_name: doc.file.name
          }))
        })
      });
      
      setPullResult(response);
      
      // Set AI analysis and dispute recommendations if available
      if (response.ai_ready_data) {
        setCreditAnalysis(response.ai_ready_data);
      }
      if (response.dispute_recommendations) {
        setDisputeRecommendations(response.dispute_recommendations);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to pull credit reports');
    } finally {
      setIsPulling(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getDocumentTypeLabel = (type: DocumentUpload['type']) => {
    const labels = {
      drivers_license: 'Driver\'s License',
      passport: 'Passport',
      utility_bill: 'Utility Bill',
      bank_statement: 'Bank Statement',
      ssn_card: 'SSN Card',
      pay_stub: 'Pay Stub'
    };
    return labels[type];
  };

  const getDocumentStatusColor = (status: DocumentUpload['status']) => {
    const colors = {
      uploading: '#f59e0b',
      uploaded: '#3b82f6',
      verified: '#10b981',
      rejected: '#ef4444'
    };
    return colors[status];
  };

  return (
    <div style={{ padding: '2rem 1rem', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ marginBottom: '3rem' }}>
        <h1 style={{ 
          fontSize: '2.5rem', 
          fontWeight: 'bold', 
          marginBottom: '1rem',
          background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          Advanced Credit Report Integration
        </h1>
        <p style={{ fontSize: '1.2rem', color: '#6b7280', marginBottom: '2rem' }}>
          Pull your credit reports with enhanced identity verification and E Oscar bypass technology.
        </p>
      </div>

      {/* E Oscar Bypass Section */}
      <div style={{ marginBottom: '3rem' }}>
        <div style={{
          background: 'linear-gradient(135deg, #f59e0b, #d97706)',
          color: 'white',
          padding: '2rem',
          borderRadius: '12px',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
            <Shield className="w-8 h-8 mr-3" />
            <h2 style={{ fontSize: '1.5rem', fontWeight: '600' }}>E Oscar Bypass Technology</h2>
          </div>
          <p style={{ marginBottom: '1.5rem', opacity: 0.9 }}>
            Advanced algorithms to outsmart automated validation systems and increase dispute success rates.
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={eOscarBypassEnabled}
                onChange={(e) => setEOscarBypassEnabled(e.target.checked)}
                style={{ marginRight: '0.5rem', transform: 'scale(1.2)' }}
              />
              <span style={{ fontWeight: '500' }}>Enable E Oscar Bypass</span>
            </label>
            <span style={{ 
              background: 'rgba(255,255,255,0.2)', 
              padding: '0.25rem 0.75rem', 
              borderRadius: '20px',
              fontSize: '0.875rem'
            }}>
              +85% Success Rate
            </span>
          </div>
        </div>
      </div>

      {/* Document Upload Section */}
      <div style={{ marginBottom: '3rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '1.5rem' }}>
          Identity Verification Documents
        </h2>
        <div style={{
          background: 'white',
          border: '1px solid #e5e7eb',
          borderRadius: '12px',
          padding: '2rem',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
        }}>
          <p style={{ color: '#6b7280', marginBottom: '1.5rem' }}>
            Upload documents to verify your identity and increase approval rates. E Oscar systems require multiple verification sources.
          </p>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
            {(['drivers_license', 'passport', 'utility_bill', 'bank_statement', 'ssn_card', 'pay_stub'] as const).map((docType) => (
              <div key={docType} style={{
                border: '2px dashed #d1d5db',
                borderRadius: '8px',
                padding: '1.5rem',
                textAlign: 'center',
                position: 'relative'
              }}>
                <input
                  type="file"
                  accept="image/*,.pdf"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleDocumentUpload(file, docType);
                  }}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    opacity: 0,
                    cursor: 'pointer'
                  }}
                />
                <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <h4 style={{ fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.5rem' }}>
                  {getDocumentTypeLabel(docType)}
                </h4>
                <p style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                  Click to upload
                </p>
              </div>
            ))}
          </div>

          {/* Uploaded Documents Display */}
          {uploadedDocuments.length > 0 && (
            <div>
              <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '1rem' }}>
                Uploaded Documents ({uploadedDocuments.length})
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {uploadedDocuments.map((doc) => (
                  <div key={doc.id} style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.75rem',
                    background: '#f9fafb',
                    borderRadius: '6px',
                    border: '1px solid #e5e7eb'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <FileText className="w-5 h-5 text-gray-500" />
                      <span style={{ fontWeight: '500' }}>{getDocumentTypeLabel(doc.type)}</span>
                      <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                        ({doc.file.name})
                      </span>
                    </div>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      padding: '0.25rem 0.75rem',
                      borderRadius: '20px',
                      background: getDocumentStatusColor(doc.status),
                      color: 'white',
                      fontSize: '0.75rem',
                      fontWeight: '500'
                    }}>
                      {doc.status === 'uploading' && <Clock className="w-3 h-3 animate-spin" />}
                      {doc.status === 'verified' && <CheckCircle className="w-3 h-3" />}
                      {doc.status === 'rejected' && <AlertCircle className="w-3 h-3" />}
                      {doc.status.charAt(0).toUpperCase() + doc.status.slice(1)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bureau Status Cards */}
      {bureauStatus ? (
        <div style={{ marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '1.5rem' }}>
            Available Credit Report Sources
          </h2>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
            gap: '1.5rem' 
          }}>
            
            {/* Annual Credit Report */}
            <div style={{
              background: 'white',
              border: '1px solid #e5e7eb',
              borderRadius: '12px',
              padding: '1.5rem',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  background: '#10b981',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: '1rem'
                }}>
                  <Download className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 style={{ fontWeight: '600', marginBottom: '0.25rem' }}>Credit Monitoring Integration</h3>
                  <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>Connect Credit Karma, Experian, MyFico</p>
                </div>
              </div>
              
              <div style={{ marginBottom: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>Status:</span>
                  <span style={{ 
                    fontSize: '0.875rem', 
                    fontWeight: '500',
                    color: '#10b981'
                  }}>
                    Ready for Analysis
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>AI Processing:</span>
                  <span style={{ fontSize: '0.875rem', fontWeight: '500', color: '#10b981' }}>
                    Enabled
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>Data Type:</span>
                  <span style={{ fontSize: '0.875rem', fontWeight: '500', color: '#3b82f6' }}>
                    Real Credit Data
                  </span>
                </div>
              </div>
              
              <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={selectedBureaus.includes('ai_analysis')}
                  onChange={() => handleBureauToggle('ai_analysis')}
                  style={{ marginRight: '0.5rem' }}
                />
                <span style={{ fontSize: '0.875rem', fontWeight: '500' }}>
                  Enable Credit Monitoring Integration
                </span>
              </label>
            </div>

            {/* Individual Bureaus */}
            {['experian', 'equifax', 'transunion'].map(bureau => (
              <div key={bureau} style={{
                background: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '12px',
                padding: '1.5rem',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    background: bureauStatus?.[bureau as keyof BureauStatus]?.api_available ? '#2563eb' : '#9ca3af',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: '1rem'
                  }}>
                    <CreditCard className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 style={{ fontWeight: '600', marginBottom: '0.25rem', textTransform: 'capitalize' }}>
                      {bureau}
                    </h3>
                    <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>API Integration</p>
                  </div>
                </div>
                
                <div style={{ marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>API Available:</span>
                    <span style={{ 
                      fontSize: '0.875rem', 
                      fontWeight: '500',
                      color: bureauStatus?.[bureau as keyof BureauStatus]?.api_available ? '#10b981' : '#ef4444'
                    }}>
                      {bureauStatus?.[bureau as keyof BureauStatus]?.api_available ? 'Yes' : 'No'}
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>Connected:</span>
                    <span style={{ 
                      fontSize: '0.875rem', 
                      fontWeight: '500',
                      color: bureauStatus?.[bureau as keyof BureauStatus]?.connected ? '#10b981' : '#6b7280'
                    }}>
                      {bureauStatus?.[bureau as keyof BureauStatus]?.connected ? 'Yes' : 'No'}
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>Cost:</span>
                    <span style={{ fontSize: '0.875rem', fontWeight: '500' }}>
                      {bureauStatus?.[bureau as keyof BureauStatus]?.cost || 'Paid API'}
                    </span>
                  </div>
                </div>
                
                {bureauStatus?.[bureau as keyof BureauStatus]?.api_available && (
                  <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={selectedBureaus.includes(bureau)}
                      onChange={() => handleBureauToggle(bureau)}
                      style={{ marginRight: '0.5rem' }}
                    />
                    <span style={{ fontSize: '0.875rem', fontWeight: '500' }}>
                      Include in pull
                    </span>
                  </label>
                )}
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          padding: '3rem',
          background: 'white',
          border: '1px solid #e5e7eb',
          borderRadius: '12px',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
        }}>
          <div style={{ textAlign: 'center' }}>
            <Clock className="w-8 h-8 text-gray-400 mx-auto mb-4 animate-spin" />
            <p style={{ color: '#6b7280' }}>Loading credit bureau status...</p>
          </div>
        </div>
      )}

      {/* Personal Information Form */}
      <div style={{ marginBottom: '3rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '1.5rem' }}>
          Personal Information
        </h2>
        <div style={{
          background: 'white',
          border: '1px solid #e5e7eb',
          borderRadius: '12px',
          padding: '2rem',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
        }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
            
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.5rem' }}>
                First Name *
              </label>
              <input
                type="text"
                value={userInfo.first_name}
                onChange={(e) => handleInputChange('first_name', e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '1rem'
                }}
                required
              />
            </div>
            
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.5rem' }}>
                Last Name *
              </label>
              <input
                type="text"
                value={userInfo.last_name}
                onChange={(e) => handleInputChange('last_name', e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '1rem'
                }}
                required
              />
            </div>
            
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.5rem' }}>
                Social Security Number *
              </label>
              <input
                type="text"
                value={userInfo.ssn}
                onChange={(e) => handleInputChange('ssn', e.target.value)}
                placeholder="XXX-XX-XXXX"
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '1rem'
                }}
                required
              />
            </div>
            
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.5rem' }}>
                Date of Birth *
              </label>
              <input
                type="date"
                value={userInfo.date_of_birth}
                onChange={(e) => handleInputChange('date_of_birth', e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '1rem'
                }}
                required
              />
            </div>
            
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.5rem' }}>
                Address *
              </label>
              <input
                type="text"
                value={userInfo.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '1rem'
                }}
                required
              />
            </div>
            
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.5rem' }}>
                City *
              </label>
              <input
                type="text"
                value={userInfo.city}
                onChange={(e) => handleInputChange('city', e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '1rem'
                }}
                required
              />
            </div>
            
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.5rem' }}>
                State *
              </label>
              <input
                type="text"
                value={userInfo.state}
                onChange={(e) => handleInputChange('state', e.target.value)}
                placeholder="CA"
                maxLength={2}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '1rem'
                }}
                required
              />
            </div>
            
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.5rem' }}>
                ZIP Code *
              </label>
              <input
                type="text"
                value={userInfo.zip_code}
                onChange={(e) => handleInputChange('zip_code', e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '1rem'
                }}
                required
              />
            </div>
            
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.5rem' }}>
                Email *
              </label>
              <input
                type="email"
                value={userInfo.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '1rem'
                }}
                required
              />
            </div>
            
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.5rem' }}>
                Phone *
              </label>
              <input
                type="tel"
                value={userInfo.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '1rem'
                }}
                required
              />
            </div>
          </div>
        </div>
      </div>

      {/* Pull Reports Button */}
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <button
          onClick={handlePullReports}
          disabled={isPulling || selectedBureaus.length === 0}
          style={{
            background: isPulling ? '#9ca3af' : '#2563eb',
            color: 'white',
            border: 'none',
            padding: '1rem 2rem',
            borderRadius: '8px',
            fontSize: '1.1rem',
            fontWeight: '600',
            cursor: isPulling ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            margin: '0 auto'
          }}
        >
          {isPulling ? (
            <>
              <Clock className="w-5 h-5 animate-spin" />
              Pulling Reports...
            </>
          ) : (
            <>
              <Download className="w-5 h-5" />
              Pull Credit Reports ({selectedBureaus.length} sources)
            </>
          )}
        </button>
      </div>

      {/* Error Display */}
      {error && (
        <div style={{
          background: '#fef2f2',
          border: '1px solid #fecaca',
          borderRadius: '8px',
          padding: '1rem',
          marginBottom: '2rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          <AlertCircle className="w-5 h-5 text-red-500" />
          <span style={{ color: '#dc2626', fontWeight: '500' }}>{error}</span>
        </div>
      )}

      {/* Portal Integration CTA */}
      {pullResult && pullResult.portal_integration_available && (
        <div style={{
          background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)',
          border: '1px solid #0ea5e9',
          borderRadius: '12px',
          padding: '2rem',
          marginTop: '2rem',
          textAlign: 'center'
        }}>
          <h3 style={{ 
            fontSize: '1.5rem', 
            fontWeight: '600', 
            marginBottom: '1rem',
            color: '#0c4a6e'
          }}>
            Connect Your Credit Accounts for Real Data
          </h3>
          <p style={{ 
            fontSize: '1rem', 
            color: '#0c4a6e', 
            marginBottom: '1.5rem',
            maxWidth: '600px',
            margin: '0 auto 1.5rem'
          }}>
            Instead of manual data entry, connect your existing Credit Karma, Experian, or MyFico accounts 
            for automatic credit data import and AI-powered analysis.
          </p>
          <a 
            href="/portal-integration"
            style={{
              display: 'inline-block',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              textDecoration: 'none',
              padding: '0.75rem 2rem',
              borderRadius: '8px',
              fontWeight: '500',
              fontSize: '1rem',
              transition: 'all 0.2s ease-in-out'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)'
              e.currentTarget.style.boxShadow = '0 8px 15px rgba(0, 0, 0, 0.2)'
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.boxShadow = 'none'
            }}
          >
            Connect Accounts Now
          </a>
        </div>
      )}

      {/* Results Display */}
      {pullResult && (
        <div style={{
          background: 'white',
          border: '1px solid #e5e7eb',
          borderRadius: '12px',
          padding: '2rem',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
        }}>
          <h3 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <CheckCircle className="w-6 h-6 text-green-500" />
            {pullResult.success ? 'Credit Monitoring Integration Ready' : 'Credit Report Pull Results'}
          </h3>
          
          <div style={{ marginBottom: '1.5rem' }}>
            <p style={{ marginBottom: '0.5rem', fontSize: '1.125rem', color: '#374151' }}>
              <strong>Status:</strong> <span style={{ color: '#10b981' }}>{pullResult.message || 'System Ready'}</span>
            </p>
            {pullResult.available_portals && (
              <p style={{ marginBottom: '0.5rem' }}>
                <strong>Available Portals:</strong> {pullResult.available_portals.map((portal: any) => portal.name).join(', ')}
              </p>
            )}
            {eOscarBypassEnabled && (
              <p style={{ color: '#f59e0b', fontWeight: '500' }}>
                <strong>E Oscar Bypass:</strong> Active - Enhanced success probability
              </p>
            )}
          </div>
          
          {pullResult.instructions && (
            <div style={{ marginTop: '2rem' }}>
              <h4 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem' }}>
                Next Steps - Connect Your Credit Accounts
              </h4>
              <div style={{
                background: '#f0f9ff',
                border: '1px solid #0ea5e9',
                borderRadius: '8px',
                padding: '1.5rem'
              }}>
                <ol style={{ paddingLeft: '1.5rem', lineHeight: '1.6', color: '#0c4a6e' }}>
                  <li>Visit <a href="/portal-integration" style={{ color: '#2563eb', textDecoration: 'underline' }}>Credit Monitoring Integration</a> to connect your credit accounts</li>
                  <li>Choose from Credit Karma, Experian, MyFico, or other available portals</li>
                  <li>Authenticate with your existing credit monitoring account</li>
                  <li>Your credit data will automatically import for AI analysis</li>
                  <li>Get personalized dispute recommendations and action plans</li>
                  <li>No manual data entry required - everything is automated!</li>
                </ol>
              </div>
            </div>
          )}
        </div>
      )}

      {/* AI Credit Analysis */}
      {creditAnalysis ? (
        <div style={{
          background: 'white',
          border: '1px solid #e5e7eb',
          borderRadius: '12px',
          padding: '2rem',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
          marginTop: '2rem'
        }}>
          <h3 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Brain className="w-6 h-6 text-blue-500" />
            AI Credit Analysis
          </h3>
          
          {/* Credit Health Summary */}
          <div style={{ marginBottom: '2rem' }}>
            <h4 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem' }}>Credit Health</h4>
            <div style={{
              background: '#f0f9ff',
              border: '1px solid #0ea5e9',
              borderRadius: '8px',
              padding: '1.5rem'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <span style={{ fontSize: '1.125rem', fontWeight: '500' }}>Overall Score</span>
                <span style={{ 
                  fontSize: '2rem', 
                  fontWeight: '700', 
                  color: creditAnalysis?.overall_score?.score > 700 ? '#10b981' : creditAnalysis?.overall_score?.score > 600 ? '#f59e0b' : '#ef4444'
                }}>
                  {creditAnalysis?.overall_score?.score || 'N/A'}
                </span>
              </div>
              <p style={{ marginBottom: '0.5rem' }}>
                <strong>Status:</strong> <span style={{ textTransform: 'capitalize', color: '#374151' }}>{creditAnalysis?.overall_score?.status || 'Pending Analysis'}</span>
              </p>
              <p style={{ marginBottom: '0.5rem' }}>
                <strong>Improvement Potential:</strong> <span style={{ textTransform: 'capitalize', color: '#374151' }}>{creditAnalysis?.overall_score?.improvement_potential || 'High'}</span>
              </p>
              <p style={{ marginBottom: '0.5rem' }}>
                <strong>Estimated Score Improvement:</strong> <span style={{ color: '#10b981', fontWeight: '600' }}>+{creditAnalysis?.estimated_score_improvement || '50+'} points</span>
              </p>
              <p>
                <strong>Success Probability:</strong> <span style={{ color: '#10b981', fontWeight: '600' }}>{Math.round((creditAnalysis?.success_probability || 0.75) * 100)}%</span>
              </p>
            </div>
          </div>

          {/* Dispute Opportunities */}
          <div style={{ marginBottom: '2rem' }}>
            <h4 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem' }}>Dispute Opportunities</h4>
            <div style={{ display: 'grid', gap: '1rem' }}>
              {(creditAnalysis?.dispute_opportunities || []).slice(0, 5).map((opportunity: any, index: number) => (
                <div key={index} style={{
                  background: '#fefce8',
                  border: '1px solid #eab308',
                  borderRadius: '8px',
                  padding: '1rem'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <span style={{ fontWeight: '600', textTransform: 'capitalize' }}>
                      {opportunity.type.replace(/_/g, ' ')}
                    </span>
                    <span style={{ 
                      fontSize: '0.875rem', 
                      fontWeight: '500', 
                      color: opportunity.success_probability > 0.7 ? '#10b981' : '#f59e0b'
                    }}>
                      {Math.round(opportunity.success_probability * 100)}% success
                    </span>
                  </div>
                  <p style={{ fontSize: '0.875rem', color: '#374151', marginBottom: '0.5rem' }}>
                    {opportunity.reason}
                  </p>
                  <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                    <strong>Creditor:</strong> {opportunity.creditor || 'N/A'}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Priority Actions */}
          <div style={{ marginBottom: '2rem' }}>
            <h4 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem' }}>Priority Action Plan</h4>
            <div style={{ display: 'grid', gap: '1rem' }}>
              {(creditAnalysis?.priority_actions || []).map((action: any, index: number) => (
                <div key={index} style={{
                  background: '#f0fdf4',
                  border: '1px solid #10b981',
                  borderRadius: '8px',
                  padding: '1rem'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                    <span style={{ 
                      background: '#10b981', 
                      color: 'white', 
                      borderRadius: '50%', 
                      width: '24px', 
                      height: '24px', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center', 
                      fontSize: '0.875rem', 
                      fontWeight: '600' 
                    }}>
                      {action.order}
                    </span>
                    <span style={{ fontWeight: '600' }}>{action.action}</span>
                  </div>
                  <p style={{ fontSize: '0.875rem', color: '#374151', marginBottom: '0.5rem' }}>
                    <strong>Impact:</strong> <span style={{ textTransform: 'capitalize' }}>{action.estimated_impact}</span>
                  </p>
                  <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                    <strong>Timeline:</strong> {action.timeline}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div style={{
          background: 'white',
          border: '1px solid #e5e7eb',
          borderRadius: '12px',
          padding: '2rem',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
          marginTop: '2rem',
          textAlign: 'center'
        }}>
          <h3 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'center' }}>
            <Brain className="w-6 h-6 text-blue-500" />
            AI Credit Analysis Ready
          </h3>
          <p style={{ fontSize: '1rem', color: '#6b7280', marginBottom: '1.5rem' }}>
            Connect your credit accounts above to get AI-powered analysis and dispute recommendations.
          </p>
          <div style={{
            background: '#f0f9ff',
            border: '1px solid #0ea5e9',
            borderRadius: '8px',
            padding: '1rem',
            display: 'inline-block'
          }}>
            <p style={{ fontSize: '0.875rem', color: '#0c4a6e', margin: 0 }}>
              <strong>What you'll get:</strong> Credit score analysis, dispute opportunities, priority action plan, and personalized recommendations.
            </p>
          </div>
        </div>
      )}

      {/* Dispute Recommendations */}
      {disputeRecommendations.length > 0 && (
        <div style={{
          background: 'white',
          border: '1px solid #e5e7eb',
          borderRadius: '12px',
          padding: '2rem',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
          marginTop: '2rem'
        }}>
          <h3 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Target className="w-6 h-6 text-purple-500" />
            Dispute Recommendations
          </h3>
          
          <div style={{ display: 'grid', gap: '1.5rem' }}>
            {disputeRecommendations.map((recommendation: any, index: number) => (
              <div key={index} style={{
                background: '#faf5ff',
                border: '1px solid #a855f7',
                borderRadius: '8px',
                padding: '1.5rem'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <h4 style={{ fontSize: '1.125rem', fontWeight: '600', textTransform: 'capitalize' }}>
                    {recommendation.type.replace(/_/g, ' ')}
                  </h4>
                  <span style={{ 
                    fontSize: '0.875rem', 
                    fontWeight: '500', 
                    color: recommendation.success_probability > 0.7 ? '#10b981' : '#f59e0b'
                  }}>
                    {Math.round(recommendation.success_probability * 100)}% success
                  </span>
                </div>
                
                <p style={{ marginBottom: '1rem', color: '#374151' }}>
                  {recommendation.reason}
                </p>
                
                <div style={{ marginBottom: '1rem' }}>
                  <p style={{ fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.5rem' }}>Required Evidence:</p>
                  <ul style={{ fontSize: '0.875rem', color: '#6b7280', marginLeft: '1rem' }}>
                    {recommendation.required_evidence.map((evidence: string, i: number) => (
                      <li key={i} style={{ marginBottom: '0.25rem' }}>{evidence}</li>
                    ))}
                  </ul>
                </div>
                
                <div style={{ marginBottom: '1rem' }}>
                  <p style={{ fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.5rem' }}>Target Bureaus:</p>
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    {recommendation.bureau_targets.map((bureau: string, i: number) => (
                      <span key={i} style={{
                        background: '#e0e7ff',
                        color: '#3730a3',
                        padding: '0.25rem 0.5rem',
                        borderRadius: '4px',
                        fontSize: '0.75rem',
                        fontWeight: '500',
                        textTransform: 'capitalize'
                      }}>
                        {bureau}
                      </span>
                    ))}
                  </div>
                </div>
                
                <button style={{
                  background: '#7c3aed',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '0.5rem 1rem',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  cursor: 'pointer'
                }}>
                  Generate Dispute Letter
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}