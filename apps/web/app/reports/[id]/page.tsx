'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { BarChart3, Lightbulb, X } from 'lucide-react';
import { api } from '../../api';


interface Report {
  id: string;
  user_id: string;
  bureau: string;
  report_date: string;
  has_parsed_data: boolean;
  parsed_json: any;
  created_at: string;
}

interface Client {
  id: string;
  email: string;
  role: string;
}

export default function ReportDetail() {
  const params = useParams();
  const reportId = params.id as string;
  
  const [report, setReport] = useState<Report | null>(null);
  const [client, setClient] = useState<Client | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (reportId) {
      fetchReportDetails();
    }
  }, [reportId]);

  const fetchReportDetails = async () => {
    try {
      setLoading(true);
      const response = await api(`/reports/${reportId}`);
      setReport(response);
      
      // Fetch client details
      const clientResponse = await api(`/clients`);
      const clients = clientResponse.clients || [];
      const reportClient = clients.find((c: Client) => c.id === response.user_id);
      setClient(reportClient || null);
      
    } catch (error: any) {
      console.error('Failed to fetch report details:', error);
      setError('Failed to load report details. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const renderParsedData = () => {
    if (!report?.parsed_json) {
      return (
        <div style={{textAlign: 'center', padding: 'var(--space-8)', color: 'var(--gray-500)'}}>
          <div style={{marginBottom: 'var(--space-4)'}}><BarChart3 className="w-12 h-12 text-gray-500 mx-auto" /></div>
          <h3>Report Not Yet Parsed</h3>
          <p>This credit report is uploaded but hasn't been analyzed yet.</p>
          <button 
            onClick={() => parseReport()}
            className="btn btn-primary"
            style={{marginTop: 'var(--space-4)'}}
          >
            Parse Report Now
          </button>
        </div>
      );
    }

    const data = report.parsed_json;
    
    return (
      <div>
        {/* Credit Score Summary */}
        {data.credit_score && (
          <div className="card" style={{marginBottom: 'var(--space-6)'}}>
            <div className="card-header">
              <h3>Credit Score Summary</h3>
            </div>
            <div className="card-body">
              <div style={{display: 'flex', alignItems: 'center', gap: 'var(--space-4)'}}>
                <div style={{
                  fontSize: '3rem',
                  fontWeight: 'bold',
                  color: data.credit_score >= 720 ? 'var(--green-600)' : 
                         data.credit_score >= 650 ? 'var(--yellow-600)' : 'var(--red-600)'
                }}>
                  {data.credit_score}
                </div>
                <div>
                  <div style={{fontSize: '1.2rem', fontWeight: '600'}}>
                    {data.credit_score >= 720 ? 'Excellent' : 
                     data.credit_score >= 650 ? 'Good' : 
                     data.credit_score >= 600 ? 'Fair' : 'Poor'}
                  </div>
                  <div style={{color: 'var(--gray-600)'}}>
                    {report.bureau} Credit Score
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

            {/* Error Message */}
            {(data.parsing_failed || (data.error && data.parsed === false)) && (
              <div className="card" style={{marginBottom: 'var(--space-6)', border: '2px solid #ef4444'}}>
                <div className="card-header" style={{background: '#fef2f2'}}>
                  <h3 style={{color: '#dc2626'}}>⚠️ PDF Parsing Failed</h3>
                </div>
                <div className="card-body">
                  <p style={{color: '#dc2626', fontSize: '1rem', marginBottom: '1rem'}}>
                    <strong>Error:</strong> {data.error || 'PDF parsing failed - unable to extract text content'}
                  </p>
                  {data.extraction_method && (
                    <p style={{color: '#6b7280', fontSize: '0.875rem', marginBottom: '1rem'}}>
                      <strong>Extraction Method Attempted:</strong> {data.extraction_method}
                    </p>
                  )}
                  {data.file_size && (
                    <p style={{color: '#6b7280', fontSize: '0.875rem', marginBottom: '1rem'}}>
                      <strong>File Size:</strong> {(data.file_size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  )}
                  <p style={{color: '#6b7280', marginBottom: '1rem'}}>
                    The uploaded PDF could not be parsed. This could be due to:
                  </p>
                  <ul style={{color: '#6b7280', marginLeft: '1.5rem', marginBottom: '1.5rem'}}>
                    <li>Image-based PDF (scanned document) - requires OCR</li>
                    <li>Password-protected PDF</li>
                    <li>Corrupted PDF file</li>
                    <li>Unsupported PDF format</li>
                    <li>Tesseract OCR not installed (for image-based PDFs)</li>
                  </ul>
                  <div style={{background: '#f0f9ff', border: '1px solid #0ea5e9', borderRadius: '8px', padding: '1rem', marginBottom: '1rem'}}>
                    <h4 style={{color: '#0369a1', margin: '0 0 0.5rem 0'}}>📋 To Enable OCR for Image-Based PDFs:</h4>
                    <ol style={{color: '#0369a1', margin: '0', paddingLeft: '1.5rem'}}>
                      <li>Download Tesseract OCR from: <a href="https://github.com/UB-Mannheim/tesseract/releases" target="_blank" style={{color: '#0369a1'}}>UB-Mannheim Releases</a></li>
                      <li>Install the Windows installer (tesseract-ocr-w64-setup.exe)</li>
                      <li>Add <code style={{background: '#e0f2fe', padding: '2px 4px', borderRadius: '3px'}}>C:\Program Files\Tesseract-OCR</code> to your system PATH</li>
                      <li>Restart the backend server</li>
                    </ol>
                  </div>
                  <div style={{display: 'flex', gap: '1rem', flexWrap: 'wrap'}}>
                    <button 
                      onClick={() => window.location.href = '/reports/upload'}
                      className="btn btn-primary"
                    >
                      Upload New Report
                    </button>
                    <button 
                      onClick={() => parseReport()}
                      className="btn btn-secondary"
                    >
                      Try Parsing Again
                    </button>
                    <button 
                      onClick={() => deleteReport()}
                      className="btn btn-danger"
                      style={{background: '#dc2626', color: 'white', border: '1px solid #dc2626'}}
                    >
                      Delete This Report
                    </button>
                  </div>
                </div>
              </div>
            )}

        {/* Accounts Summary */}
        {data.accounts && data.accounts.length > 0 && !data.parsing_failed && (
          <div className="card" style={{marginBottom: 'var(--space-6)'}}>
            <div className="card-header">
              <h3>Credit Accounts ({data.accounts.length})</h3>
            </div>
            <div className="card-body">
              <div style={{display: 'flex', flexDirection: 'column', gap: 'var(--space-3)'}}>
                {data.accounts.map((account: any, index: number) => (
                  <div key={index} style={{
                    padding: 'var(--space-4)',
                    border: '1px solid var(--gray-200)',
                    borderRadius: 'var(--radius)',
                    backgroundColor: 'var(--gray-50)'
                  }}>
                    <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start'}}>
                      <div>
                        <strong>{account.creditor_name || account.creditor || 'Unknown Creditor'}</strong>
                        <div style={{fontSize: '0.875rem', color: 'var(--gray-600)'}}>
                          {account.account_type || 'Unknown Type'}
                        </div>
                        <div style={{fontSize: '0.875rem', color: 'var(--gray-500)'}}>
                          Account: {account.account_name || account.account_number || 'N/A'}
                        </div>
                      </div>
                      <div style={{textAlign: 'right'}}>
                        <div style={{fontSize: '1.1rem', fontWeight: '600'}}>
                          ${account.balance ? account.balance.toLocaleString() : '0'}
                        </div>
                        <div className={`badge ${
                          account.status === 'Current' ? 'badge-success' :
                          account.status === 'Delinquent' ? 'badge-error' :
                          account.status === 'Charged Off' ? 'badge-error' :
                          'badge-warning'
                        }`}>
                          {account.status || 'Unknown'}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Dispute Suggestions */}
        <div className="card">
          <div className="card-header">
            <h3>🤖 AI-Powered Dispute Suggestions</h3>
          </div>
          <div className="card-body">
            <div style={{textAlign: 'center', padding: 'var(--space-6)', color: 'var(--gray-600)'}}>
              <div style={{marginBottom: 'var(--space-2)'}}><Lightbulb className="w-8 h-8 text-blue-600 mx-auto" /></div>
              <p>Based on this credit report analysis, we found several dispute opportunities.</p>
              <a 
                href={`/disputes/create?client_id=${report.user_id}&report_id=${report.id}`}
                className="btn btn-primary"
                style={{marginTop: 'var(--space-4)'}}
              >
                Create Smart Disputes
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const parseReport = async () => {
    try {
      await api(`/reports/analyze?report_id=${reportId}`, {
        method: 'POST'
      });
      // Refresh report data
      fetchReportDetails();
    } catch (error) {
      console.error('Failed to parse report:', error);
      setError('Failed to parse report');
    }
  };

  const deleteReport = async () => {
    if (!confirm('Are you sure you want to delete this report? This action cannot be undone.')) {
      return;
    }

    try {
      await api(`/reports/${reportId}`, {
        method: 'DELETE'
      });
      
      // Redirect to reports list
      window.location.href = '/reports';
    } catch (error: any) {
      console.error('Failed to delete report:', error);
      alert(`Failed to delete report: ${error.message}`);
    }
  };

  if (loading) {
    return (
      <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh'}}>
        <div style={{textAlign: 'center'}}>
          <div style={{fontSize: '2rem', marginBottom: 'var(--space-4)'}}>⏳</div>
          <p>Loading report details...</p>
        </div>
      </div>
    );
  }

  if (error || !report) {
    return (
      <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh'}}>
        <div style={{textAlign: 'center'}}>
          <div style={{marginBottom: 'var(--space-4)'}}><X className="w-12 h-12 text-red-500 mx-auto" /></div>
          <h2>Report Not Found</h2>
          <p style={{color: 'var(--gray-600)'}}>{error || 'The requested report could not be found.'}</p>
          <a href="/reports" className="btn btn-primary" style={{marginTop: 'var(--space-4)'}}>
            Back to Reports
          </a>
        </div>
      </div>
    );
  }

  return (
    <>

      {/* Page Header */}
      <section style={{background: 'white', borderBottom: '1px solid var(--gray-200)', padding: 'var(--space-8) 0'}}>
        <div className="container">
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
            <div>
              <h1>{report.bureau} Credit Report</h1>
              <p style={{color: 'var(--gray-600)'}}>
                {client ? `Client: ${client.email}` : 'Client information not available'} • 
                Uploaded: {formatDate(report.created_at)}
              </p>
            </div>
            <div style={{display: 'flex', gap: 'var(--space-3)'}}>
              <a href="/reports" className="btn btn-secondary">Back to Reports</a>
              <a 
                href={`http://127.0.0.1:8000/reports/${reportId}/download`}
                target="_blank"
                className="btn btn-secondary"
                style={{background: '#059669', color: 'white', border: '1px solid #059669'}}
              >
                📄 Download Analysis
              </a>
              <button onClick={parseReport} className="btn btn-primary">
                Parse Report
              </button>
              <a href={`/disputes/create?client_id=${report.user_id}&report_id=${report.id}`} className="btn btn-secondary">
                Create Disputes
              </a>
              <button 
                onClick={deleteReport} 
                className="btn btn-danger"
                style={{background: '#dc2626', color: 'white', border: '1px solid #dc2626'}}
              >
                Delete Report
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Report Details */}
      <section style={{padding: 'var(--space-12) 0'}}>
        <div className="container">
          <div style={{maxWidth: '1000px', margin: '0 auto'}}>
            
            {/* Report Info */}
            <div className="card" style={{marginBottom: 'var(--space-6)'}}>
              <div className="card-header">
                <h3>Report Information</h3>
              </div>
              <div className="card-body">
                <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--space-4)'}}>
                  <div>
                    <strong>Bureau:</strong> {report.bureau}
                  </div>
                  <div>
                    <strong>Report Date:</strong> {report.report_date ? formatDate(report.report_date) : 'Not specified'}
                  </div>
                  <div>
                    <strong>Uploaded:</strong> {formatDate(report.created_at)}
                  </div>
                  <div>
                    <strong>Status:</strong> 
                    <span className={`badge ${report.has_parsed_data ? 'badge-success' : 'badge-warning'}`}>
                      {report.has_parsed_data ? 'Analyzed' : 'Pending Analysis'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Parsed Data */}
            {renderParsedData()}

          </div>
        </div>
      </section>
    </>
  );
}

