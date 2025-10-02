'use client';

import { useState, useEffect } from 'react';
import { api } from '../lib/api';

interface Dispute {
  id: string;
  user_id: string;
  target: string;
  bureau: string;
  reason_code: string;
  narrative: string;
  status: string;
  tracking_no: string | null;
  sent_at: string | null;
  due_at: string | null;
  created_at: string;
}

export default function Disputes() {
  const [disputes, setDisputes] = useState<Dispute[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDisputes();
  }, []);

  const fetchDisputes = async () => {
    try {
      setLoading(true);
      const response = await api('/disputes');
      setDisputes(response.disputes || []);
    } catch (error: any) {
      console.error('Failed to fetch disputes:', error);
      setError('Failed to load disputes');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (dispute: Dispute) => {
    switch (dispute.status) {
      case 'sent':
        return <span className="badge badge-success">Sent</span>;
      case 'draft':
        return <span className="badge badge-info">Draft</span>;
      case 'pending':
        return <span className="badge badge-warning">Pending</span>;
      default:
        return <span className="badge badge-secondary">{dispute.status}</span>;
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString();
  };

  const getDueDate = (dispute: Dispute) => {
    if (dispute.due_at) {
      return `Due: ${formatDate(dispute.due_at)}`;
    }
    return '-';
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
            </ul>
          </div>
        </div>
      </nav>

      {/* Page Header */}
      <section style={{background: 'white', borderBottom: '1px solid var(--gray-200)', padding: 'var(--space-8) 0'}}>
        <div className="container">
          <div className="flex items-center justify-between">
            <div>
              <h1>Dispute Management</h1>
              <p style={{color: 'var(--gray-600)'}}>Track and manage all credit bureau disputes</p>
            </div>
            <a href="/disputes/create" className="btn btn-primary">Create Dispute</a>
          </div>
        </div>
      </section>

      {/* Disputes List */}
      <section style={{padding: 'var(--space-12) 0'}}>
        <div className="container">
          <div className="card">
            <div className="card-header">
              <h3>Active Disputes ({disputes.length})</h3>
            </div>
            <div className="card-body">
              {loading ? (
                <div style={{textAlign: 'center', padding: 'var(--space-8)'}}>
                  <div style={{fontSize: '1.2rem', color: 'var(--gray-600)'}}>Loading disputes...</div>
                </div>
              ) : error ? (
                <div style={{textAlign: 'center', padding: 'var(--space-8)', color: 'var(--red-600)'}}>
                  <div style={{fontSize: '1.2rem'}}>{error}</div>
                  <button 
                    onClick={fetchDisputes} 
                    className="btn btn-secondary" 
                    style={{marginTop: 'var(--space-4)'}}
                  >
                    Retry
                  </button>
                </div>
              ) : disputes.length === 0 ? (
                <div style={{textAlign: 'center', padding: 'var(--space-8)'}}>
                  <div style={{fontSize: '1.2rem', color: 'var(--gray-600)', marginBottom: 'var(--space-4)'}}>
                    No disputes found
                  </div>
                  <a href="/disputes/create" className="btn btn-primary">
                    Create Your First Dispute
                  </a>
                </div>
              ) : (
                <div style={{display: 'flex', flexDirection: 'column', gap: 'var(--space-4)'}}>
                  {disputes.map((dispute) => (
                    <div key={dispute.id} style={{display: 'grid', gridTemplateColumns: '1fr 120px 120px 120px 100px', gap: 'var(--space-4)', padding: 'var(--space-4)', background: 'var(--gray-50)', borderRadius: 'var(--radius)', alignItems: 'center'}}>
                      <div>
                        <strong>{dispute.bureau} - {dispute.target}</strong>
                        <div style={{color: 'var(--gray-600)', fontSize: '0.875rem'}}>
                          {dispute.reason_code}: {dispute.narrative}
                        </div>
                      </div>
                      {getStatusBadge(dispute)}
                      <span style={{color: 'var(--gray-600)', fontSize: '0.875rem'}}>
                        {formatDate(dispute.sent_at || dispute.created_at)}
                      </span>
                      <span style={{color: 'var(--gray-600)', fontSize: '0.875rem'}}>
                        {getDueDate(dispute)}
                      </span>
                      <a href={`/disputes/${dispute.id}`} className="btn btn-secondary" style={{fontSize: '0.75rem', padding: 'var(--space-2)'}}>
                        View
                      </a>
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
