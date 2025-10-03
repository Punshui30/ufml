'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { X, BarChart3, Zap } from 'lucide-react';
import { api } from '../../api';


interface Client {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  role: string;
  account_id: string | null;
  created_at: string;
  phone?: string | null;
}

interface Report {
  id: string;
  user_id: string;
  bureau: string;
  report_date: string;
  has_parsed_data: boolean;
  created_at: string;
}

interface Dispute {
  id: string;
  user_id: string;
  target: string;
  bureau: string;
  reason_code: string;
  status: string;
  created_at: string;
}

export default function ClientDetail() {
  const params = useParams();
  const clientId = params.id as string;
  
  const [client, setClient] = useState<Client | null>(null);
  const [reports, setReports] = useState<Report[]>([]);
  const [disputes, setDisputes] = useState<Dispute[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (clientId) {
      fetchClientDetails();
    }
  }, [clientId]);

  const fetchClientDetails = async () => {
    try {
      setLoading(true);
      
      // Fetch live client record first
      const clientResponse = await api(`/clients/${clientId}`);
      setClient(clientResponse);

      // Fetch client's reports
      try {
        const reportsResponse = await api('/reports');
        const allReports = Array.isArray(reportsResponse)
          ? reportsResponse
          : reportsResponse.reports || [];
        const clientReports = allReports.filter((r: Report) => r.user_id === clientId);
        setReports(clientReports);
      } catch (error) {
        console.error('Failed to fetch reports:', error);
        setReports([]);
      }

      // Fetch client's disputes
      try {
        const disputesResponse = await api('/disputes');
        const allDisputes = disputesResponse.disputes || [];
        const clientDisputes = allDisputes.filter((d: Dispute) => d.user_id === clientId);
        setDisputes(clientDisputes);
      } catch (error) {
        console.error('Failed to fetch disputes:', error);
        setDisputes([]);
      }
      
    } catch (error: any) {
      console.error('Failed to fetch client details:', error);
      setError('Failed to load client details');
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

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'sent':
        return <span className="badge badge-success">Sent</span>;
      case 'draft':
        return <span className="badge badge-info">Draft</span>;
      case 'pending':
        return <span className="badge badge-warning">Pending</span>;
      default:
        return <span className="badge badge-secondary">{status}</span>;
    }
  };

  if (loading) {
    return (
      <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh'}}>
        <div style={{textAlign: 'center'}}>
          <div style={{fontSize: '2rem', marginBottom: 'var(--space-4)'}}>⏳</div>
          <p>Loading client details...</p>
        </div>
      </div>
    );
  }

  if (error || !client) {
    return (
      <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh'}}>
        <div style={{textAlign: 'center'}}>
          <div style={{marginBottom: 'var(--space-4)'}}><X className="w-12 h-12 text-red-500 mx-auto" /></div>
          <h2>Client Not Found</h2>
          <p style={{color: 'var(--gray-600)'}}>{error || 'The requested client could not be found.'}</p>
          <a href="/clients" className="btn btn-primary" style={{marginTop: 'var(--space-4)'}}>
            Back to Clients
          </a>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Navigation */}
      <nav className="navbar">
        <div className="container">
          <div className="navbar-content">
            <a href="/" className="navbar-brand">
              <img src="/ufml-logo.svg" alt="UFML" style={{ width: '128px', height: '128px', marginRight: '1rem' }} />
              UFML
            </a>
            <ul className="navbar-nav">
              <li><a href="/">Home</a></li>
              <li><a href="/dashboard">Dashboard</a></li>
              <li><a href="/clients">Clients</a></li>
              <li><a href="/disputes">Disputes</a></li>
              <li><a href="/reports">Reports</a></li>
            </ul>
          </div>
        </div>
      </nav>

      {/* Page Header */}
      <section style={{background: 'white', borderBottom: '1px solid var(--gray-200)', padding: 'var(--space-8) 0'}}>
        <div className="container">
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
            <div>
              <h1>Client Profile</h1>
              <p style={{color: 'var(--gray-600)'}}>
                {(client.first_name || client.last_name)
                  ? `${client.first_name || ''} ${client.last_name || ''} • ${client.email}`.trim()
                  : client.email}
                {' • '}Client since {formatDate(client.created_at)}
              </p>
            </div>
            <div style={{display: 'flex', gap: 'var(--space-3)'}}>
              <a href="/clients" className="btn btn-secondary">Back to Clients</a>
              <a href={`/disputes/create?client_id=${client.id}`} className="btn btn-primary">
                Create Dispute
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Client Details */}
      <section style={{padding: 'var(--space-12) 0'}}>
        <div className="container">
          <div style={{maxWidth: '1000px', margin: '0 auto'}}>
            
            {/* Client Info */}
            <div className="card" style={{marginBottom: 'var(--space-6)'}}>
              <div className="card-header">
                <h3>Client Information</h3>
              </div>
              <div className="card-body">
                <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--space-4)'}}>
                  <div>
                    <strong>Email:</strong> {client.email}
                  </div>
                  <div>
                    <strong>Role:</strong> {client.role}
                  </div>
                  <div>
                    <strong>Client Since:</strong> {formatDate(client.created_at)}
                  </div>
                  <div>
                    <strong>Account ID:</strong> {client.account_id || 'Not assigned'}
                  </div>
                </div>
              </div>
            </div>

            {/* Stats Summary */}
            <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--space-4)', marginBottom: 'var(--space-6)'}}>
              <div className="card" style={{textAlign: 'center'}}>
                <div className="card-body">
                  <div style={{fontSize: '2rem', fontWeight: 'bold', color: 'var(--blue-600)'}}>
                    {reports.length}
                  </div>
                  <div style={{color: 'var(--gray-600)'}}>Credit Reports</div>
                </div>
              </div>
              <div className="card" style={{textAlign: 'center'}}>
                <div className="card-body">
                  <div style={{fontSize: '2rem', fontWeight: 'bold', color: 'var(--green-600)'}}>
                    {disputes.length}
                  </div>
                  <div style={{color: 'var(--gray-600)'}}>Disputes</div>
                </div>
              </div>
              <div className="card" style={{textAlign: 'center'}}>
                <div className="card-body">
                  <div style={{fontSize: '2rem', fontWeight: 'bold', color: 'var(--purple-600)'}}>
                    {disputes.filter(d => d.status === 'sent').length}
                  </div>
                  <div style={{color: 'var(--gray-600)'}}>Sent Disputes</div>
                </div>
              </div>
            </div>

            {/* Credit Reports */}
            <div className="card" style={{marginBottom: 'var(--space-6)'}}>
              <div className="card-header">
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                  <h3>Credit Reports ({reports.length})</h3>
                  <a href={`/reports/upload?client_id=${client.id}`} className="btn btn-secondary" style={{fontSize: '0.875rem'}}>
                    Upload Report
                  </a>
                </div>
              </div>
              <div className="card-body">
                {reports.length > 0 ? (
                  <div style={{display: 'flex', flexDirection: 'column', gap: 'var(--space-3)'}}>
                    {reports.map((report) => (
                      <div key={report.id} style={{
                        padding: 'var(--space-4)',
                        border: '1px solid var(--gray-200)',
                        borderRadius: 'var(--radius)',
                        backgroundColor: 'var(--gray-50)',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }}>
                        <div>
                          <strong>{report.bureau} Report</strong>
                          <div style={{fontSize: '0.875rem', color: 'var(--gray-600)'}}>
                            Uploaded: {formatDate(report.created_at)}
                          </div>
                        </div>
                        <div style={{display: 'flex', gap: 'var(--space-2)', alignItems: 'center'}}>
                          <span className={`badge ${report.has_parsed_data ? 'badge-success' : 'badge-warning'}`}>
                            {report.has_parsed_data ? 'Analyzed' : 'Pending'}
                          </span>
                          <a href={`/reports/${report.id}`} className="btn btn-secondary" style={{fontSize: '0.75rem', padding: 'var(--space-2)'}}>
                            View
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={{textAlign: 'center', padding: 'var(--space-8)', color: 'var(--gray-500)'}}>
                    <div style={{marginBottom: 'var(--space-2)'}}><BarChart3 className="w-8 h-8 text-gray-500 mx-auto" /></div>
                    <p>No credit reports uploaded yet.</p>
                    <a href={`/reports/upload?client_id=${client.id}`} className="btn btn-primary" style={{marginTop: 'var(--space-4)'}}>
                      Upload First Report
                    </a>
                  </div>
                )}
              </div>
            </div>

            {/* Disputes */}
            <div className="card">
              <div className="card-header">
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                  <h3>Disputes ({disputes.length})</h3>
                  <a href={`/disputes/create?client_id=${client.id}`} className="btn btn-secondary" style={{fontSize: '0.875rem'}}>
                    Create Dispute
                  </a>
                </div>
              </div>
              <div className="card-body">
                {disputes.length > 0 ? (
                  <div style={{display: 'flex', flexDirection: 'column', gap: 'var(--space-3)'}}>
                    {disputes.map((dispute) => (
                      <div key={dispute.id} style={{
                        padding: 'var(--space-4)',
                        border: '1px solid var(--gray-200)',
                        borderRadius: 'var(--radius)',
                        backgroundColor: 'var(--gray-50)',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }}>
                        <div>
                          <strong>{dispute.bureau} - {dispute.reason_code}</strong>
                          <div style={{fontSize: '0.875rem', color: 'var(--gray-600)'}}>
                            Created: {formatDate(dispute.created_at)}
                          </div>
                        </div>
                        <div style={{display: 'flex', gap: 'var(--space-2)', alignItems: 'center'}}>
                          {getStatusBadge(dispute.status)}
                          <a href={`/disputes/${dispute.id}`} className="btn btn-secondary" style={{fontSize: '0.75rem', padding: 'var(--space-2)'}}>
                            View
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={{textAlign: 'center', padding: 'var(--space-8)', color: 'var(--gray-500)'}}>
                    <div style={{marginBottom: 'var(--space-2)'}}><Zap className="w-8 h-8 text-gray-500 mx-auto" /></div>
                    <p>No disputes created yet.</p>
                    <a href={`/disputes/create?client_id=${client.id}`} className="btn btn-primary" style={{marginTop: 'var(--space-4)'}}>
                      Create First Dispute
                    </a>
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      </section>
    </>
  );
}

