'use client';

import { useState, useEffect } from 'react';
import { Download, Plus, FileText, Trash2 } from 'lucide-react';
import { api } from '../lib/api';

interface Report {
  id: string;
  user_id: string;
  bureau: string;
  report_date: string;
  has_parsed_data: boolean;
  created_at: string;
}

export default function Reports() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const response = await api('/reports');
      // Backend returns array directly, not wrapped in {reports: [...]}
      const reportsData = Array.isArray(response) ? response : (response.reports || []);
      
      // Map backend response to frontend expected format
      const mappedReports = reportsData.map((report: any) => ({
        id: report.id,
        user_id: 'client_1759251660898', // Default client ID
        bureau: report.filename?.includes('Equifax') ? 'Equifax' : 
                report.filename?.includes('Experian') ? 'Experian' : 
                report.filename?.includes('TransUnion') ? 'TransUnion' : 'Unknown',
        report_date: report.created_at || new Date().toISOString(),
        has_parsed_data: report.text_len > 0,
        created_at: report.created_at || new Date().toISOString()
      }));
      
      setReports(mappedReports);
    } catch (error: any) {
      console.error('Failed to fetch reports:', error);
      setError('Failed to load reports. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (report: Report) => {
    if (report.has_parsed_data) {
      return <span className="badge badge-success">Analyzed</span>;
    } else {
      return <span className="badge badge-warning">Processing</span>;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const deleteReport = async (reportId: string) => {
    if (!confirm('Are you sure you want to delete this report? This action cannot be undone.')) {
      return;
    }

    try {
      await api(`/reports/${reportId}`, {
        method: 'DELETE'
      });
      
      // Remove from local state
      setReports(reports.filter(report => report.id !== reportId));
      alert('Report deleted successfully');
    } catch (error: any) {
      console.error('Failed to delete report:', error);
      alert(`Failed to delete report: ${error.message}`);
    }
  };

  return (
    <>

      {/* Page Header */}
      <section style={{background: 'white', borderBottom: '1px solid var(--gray-200)', padding: 'var(--space-8) 0'}}>
        <div className="container">
          <div className="flex items-center justify-between">
            <div>
              <h1>Credit Reports</h1>
              <p style={{color: 'var(--gray-600)'}}>Upload and analyze credit reports from all three bureaus</p>
            </div>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <a href="/reports/free-pull" className="btn btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Download className="w-4 h-4" />
                Pull Free Reports
              </a>
              <a href="/reports/upload" className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Plus className="w-4 h-4" />
                Upload Report
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Reports List */}
      <section style={{padding: 'var(--space-12) 0'}}>
        <div className="container">
          <div className="card">
            <div className="card-header">
              <h3>Recent Reports ({reports.length})</h3>
            </div>
            <div className="card-body">
              {loading ? (
                <div style={{textAlign: 'center', padding: 'var(--space-8)'}}>
                  <div style={{fontSize: '1.2rem', color: 'var(--gray-600)'}}>Loading reports...</div>
                </div>
              ) : error ? (
                <div style={{textAlign: 'center', padding: 'var(--space-8)', color: 'var(--red-600)'}}>
                  <div style={{fontSize: '1.2rem'}}>{error}</div>
                  <button 
                    onClick={fetchReports} 
                    className="btn btn-secondary" 
                    style={{marginTop: 'var(--space-4)'}}
                  >
                    Retry
                  </button>
                </div>
              ) : reports.length === 0 ? (
                <div style={{textAlign: 'center', padding: 'var(--space-8)'}}>
                  <div style={{fontSize: '1.2rem', color: 'var(--gray-600)', marginBottom: 'var(--space-4)'}}>
                    No reports found
                  </div>
                  <a href="/reports/upload" className="btn btn-primary">
                    Upload Your First Report
                  </a>
                </div>
              ) : (
                <div style={{display: 'flex', flexDirection: 'column', gap: 'var(--space-4)'}}>
                  {reports.map((report) => (
                    <div key={report.id} style={{display: 'grid', gridTemplateColumns: '1fr 120px 120px 120px 100px 100px', gap: 'var(--space-4)', padding: 'var(--space-4)', background: 'var(--gray-50)', borderRadius: 'var(--radius)', alignItems: 'center'}}>
                      <div>
                        <strong>{report.bureau} Report</strong>
                        <div style={{color: 'var(--gray-600)', fontSize: '0.875rem'}}>
                          Uploaded: {formatDate(report.created_at)}
                        </div>
                      </div>
                      {getStatusBadge(report)}
                      <span style={{color: 'var(--gray-600)', fontSize: '0.875rem'}}>
                        {report.has_parsed_data ? 'Parsed' : 'Pending'}
                      </span>
                      <span style={{color: 'var(--gray-600)', fontSize: '0.875rem'}}>
                        {report.has_parsed_data ? 'Ready' : '-'}
                      </span>
                      <a href={`/reports/${report.id}`} className="btn btn-secondary" style={{fontSize: '0.75rem', padding: 'var(--space-2)'}}>
                        View
                      </a>
                      <button 
                        onClick={() => deleteReport(report.id)}
                        className="btn btn-danger" 
                        style={{fontSize: '0.75rem', padding: 'var(--space-2)', display: 'flex', alignItems: 'center', gap: '0.25rem'}}
                      >
                        <Trash2 className="w-3 h-3" />
                        Delete
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
