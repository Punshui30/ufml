'use client';

import { useState, useEffect } from 'react';
import { Plus, FileText, Clock, CheckCircle, XCircle } from 'lucide-react';
import { api } from '../../lib/api';

interface Dispute {
  id: string;
  bureau: string;
  account_name: string;
  status: string;
  created_at: string;
  sent_at?: string;
  due_at?: string;
}

export default function ConsumerDisputes() {
  const [disputes, setDisputes] = useState<Dispute[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      fetchDisputes();
    }
  }, []);

  const fetchDisputes = async () => {
    try {
      const response = await api('/disputes');
      setDisputes(response.disputes || []);
    } catch (error) {
      console.error('Failed to fetch disputes:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'sent':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case 'rejected':
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <FileText className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'sent':
        return 'badge-success';
      case 'pending':
        return 'badge-warning';
      case 'rejected':
        return 'badge-danger';
      default:
        return 'badge-secondary';
    }
  };

  return (
    <div style={{minHeight: '100vh', backgroundColor: '#f9fafb'}}>
      {/* Header */}
      <section style={{background: 'white', borderBottom: '1px solid #e5e7eb', padding: '2rem 0'}}>
        <div className="container">
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
            <div>
              <h1>My Disputes</h1>
              <p style={{color: '#6b7280'}}>Track your credit dispute progress</p>
            </div>
            <a href="/disputes/create" className="btn btn-primary" style={{display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
              <Plus className="w-4 h-4" />
              Create New Dispute
            </a>
          </div>
        </div>
      </section>

      {/* Content */}
      <section style={{padding: '3rem 0'}}>
        <div className="container">
          {loading ? (
            <div style={{textAlign: 'center', padding: '3rem', color: '#6b7280'}}>
              Loading disputes...
            </div>
          ) : disputes.length > 0 ? (
            <div className="card">
              <div className="card-body">
                <div style={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>
                  {disputes.map((dispute) => (
                    <div key={dispute.id} style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '1rem',
                      background: 'white',
                      border: '1px solid #e5e7eb',
                      borderRadius: '0.5rem'
                    }}>
                      <div style={{display: 'flex', alignItems: 'center', gap: '1rem'}}>
                        {getStatusIcon(dispute.status)}
                        <div>
                          <h3 style={{margin: 0, fontSize: '1.1rem'}}>{dispute.account_name}</h3>
                          <p style={{margin: 0, color: '#6b7280', fontSize: '0.875rem'}}>
                            {dispute.bureau} • Created {new Date(dispute.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div style={{display: 'flex', alignItems: 'center', gap: '1rem'}}>
                        <span className={`badge ${getStatusColor(dispute.status)}`}>
                          {dispute.status.charAt(0).toUpperCase() + dispute.status.slice(1)}
                        </span>
                        <a href={`/disputes/${dispute.id}`} className="btn btn-sm btn-secondary">
                          View Details
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="card">
              <div className="card-body" style={{textAlign: 'center', padding: '3rem'}}>
                <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 style={{color: '#374151', marginBottom: '1rem'}}>No Disputes Yet</h3>
                <p style={{color: '#6b7280', marginBottom: '2rem'}}>
                  Start by creating your first dispute to begin improving your credit.
                </p>
                <a href="/disputes/create" className="btn btn-primary">
                  Create Your First Dispute
                </a>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}


