'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { X } from 'lucide-react';
import { api } from '../../api';


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

interface Client {
  id: string;
  email: string;
  role: string;
}

export default function DisputeDetail() {
  const params = useParams();
  const disputeId = params.id as string;
  
  const [dispute, setDispute] = useState<Dispute | null>(null);
  const [client, setClient] = useState<Client | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (disputeId) {
      fetchDisputeDetails();
    }
  }, [disputeId]);

  const fetchDisputeDetails = async () => {
    try {
      setLoading(true);
      const response = await api(`/disputes/${disputeId}`);
      setDispute(response);
      
      // Fetch client details
      const clientResponse = await api(`/clients`);
      const clients = clientResponse.clients || [];
      const disputeClient = clients.find((c: Client) => c.id === response.user_id);
      setClient(disputeClient || null);
      
    } catch (error: any) {
      console.error('Failed to fetch dispute details:', error);
      setError('Failed to load dispute details');
    } finally {
      setLoading(false);
    }
  };

  const handleSendDispute = async () => {
    if (!dispute) return;
    
    try {
      setSending(true);
      await api(`/disputes/send`, {
        method: 'POST',
        body: JSON.stringify({
          dispute_id: dispute.id
        })
      });
      
      // Refresh dispute data
      fetchDisputeDetails();
      
    } catch (error) {
      console.error('Failed to send dispute:', error);
      setError('Failed to send dispute');
    } finally {
      setSending(false);
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Not set';
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

  const getReasonDescription = (reasonCode: string) => {
    const reasons: { [key: string]: string } = {
      'account_not_mine': 'Account Not Mine',
      'incorrect_payment_history': 'Incorrect Payment History',
      'incorrect_balance': 'Incorrect Balance',
      'account_closed_by_consumer': 'Account Closed by Consumer',
      'duplicate_account': 'Duplicate Account',
      'NOT_MINE': 'Account Not Mine',
      'PAID_BEFORE_CO': 'Paid Before Charge Off',
      'BALANCE_INCORRECT': 'Balance Incorrect',
      'NEVER_LATE': 'Never Late',
      'FRAUD': 'Fraudulent Account',
      'other': 'Other'
    };
    return reasons[reasonCode] || reasonCode;
  };

  if (loading) {
    return (
      <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh'}}>
        <div style={{textAlign: 'center'}}>
          <div style={{fontSize: '2rem', marginBottom: 'var(--space-4)'}}>⏳</div>
          <p>Loading dispute details...</p>
        </div>
      </div>
    );
  }

  if (error || !dispute) {
    return (
      <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh'}}>
        <div style={{textAlign: 'center'}}>
          <div style={{marginBottom: 'var(--space-4)'}}><X className="w-12 h-12 text-red-500 mx-auto" /></div>
          <h2>Dispute Not Found</h2>
          <p style={{color: 'var(--gray-600)'}}>{error || 'The requested dispute could not be found.'}</p>
          <a href="/disputes" className="btn btn-primary" style={{marginTop: 'var(--space-4)'}}>
            Back to Disputes
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
              <img src="/ufml-logo.svg" alt="UFML" />
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
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
            <div>
              <h1>Dispute Details</h1>
              <p style={{color: 'var(--gray-600)'}}>
                {client ? `Client: ${client.email}` : 'Client information not available'} • 
                Created: {formatDate(dispute.created_at)}
              </p>
            </div>
            <div style={{display: 'flex', gap: 'var(--space-3)'}}>
              <a href="/disputes" className="btn btn-secondary">Back to Disputes</a>
              {dispute.status === 'draft' && (
                <button 
                  onClick={handleSendDispute}
                  disabled={sending}
                  className="btn btn-primary"
                >
                  {sending ? 'Sending...' : 'Send Dispute'}
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Dispute Details */}
      <section style={{padding: 'var(--space-12) 0'}}>
        <div className="container">
          <div style={{maxWidth: '800px', margin: '0 auto'}}>
            
            {/* Dispute Info */}
            <div className="card" style={{marginBottom: 'var(--space-6)'}}>
              <div className="card-header">
                <h3>Dispute Information</h3>
              </div>
              <div className="card-body">
                <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--space-4)', marginBottom: 'var(--space-6)'}}>
                  <div>
                    <strong>Status:</strong> {getStatusBadge(dispute.status)}
                  </div>
                  <div>
                    <strong>Bureau:</strong> {dispute.bureau}
                  </div>
                  <div>
                    <strong>Target:</strong> {dispute.target}
                  </div>
                  <div>
                    <strong>Reason:</strong> {getReasonDescription(dispute.reason_code)}
                  </div>
                  <div>
                    <strong>Created:</strong> {formatDate(dispute.created_at)}
                  </div>
                  <div>
                    <strong>Due Date:</strong> {formatDate(dispute.due_at)}
                  </div>
                  {dispute.tracking_no && (
                    <div>
                      <strong>Tracking #:</strong> {dispute.tracking_no}
                    </div>
                  )}
                  {dispute.sent_at && (
                    <div>
                      <strong>Sent Date:</strong> {formatDate(dispute.sent_at)}
                    </div>
                  )}
                </div>
                
                {dispute.narrative && (
                  <div>
                    <strong>Dispute Narrative:</strong>
                    <div style={{
                      marginTop: 'var(--space-2)',
                      padding: 'var(--space-4)',
                      background: 'var(--gray-50)',
                      borderRadius: 'var(--radius)',
                      border: '1px solid var(--gray-200)'
                    }}>
                      {dispute.narrative}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="card">
              <div className="card-header">
                <h3>Actions</h3>
              </div>
              <div className="card-body">
                <div style={{display: 'flex', gap: 'var(--space-4)', flexWrap: 'wrap'}}>
                  <a href={`/disputes/create?client_id=${dispute.user_id}`} className="btn btn-primary">
                    Create New Dispute
                  </a>
                  <a href={`/reports?client_id=${dispute.user_id}`} className="btn btn-secondary">
                    View Client Reports
                  </a>
                  <a href={`/clients/${dispute.user_id}`} className="btn btn-secondary">
                    View Client Profile
                  </a>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>
    </>
  );
}

