'use client';

import { useState, useEffect } from 'react';
import { api } from '../lib/api';

interface Client {
  id: string;
  email: string;
  role: string;
  account_id: string | null;
  created_at: string;
}

export default function Clients() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      setLoading(true);
      const response = await api('/clients');
      setClients(response.clients || []);
    } catch (error: any) {
      console.error('Failed to fetch clients:', error);
      setError('Failed to load clients. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (client: Client) => {
    // Simple status based on creation date - you can make this more sophisticated
    const createdAt = new Date(client.created_at);
    const daysSinceCreated = Math.floor((Date.now() - createdAt.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysSinceCreated < 1) {
      return <span className="badge badge-info">New</span>;
    } else if (daysSinceCreated < 7) {
      return <span className="badge badge-warning">Review</span>;
    } else {
      return <span className="badge badge-success">Active</span>;
    }
  };

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
          <div className="flex items-center justify-between">
            <div>
              <h1>Client Management</h1>
              <p style={{color: 'var(--gray-600)'}}>Manage all your credit repair clients in one place</p>
            </div>
            <a href="/clients/new" className="btn btn-primary">Add New Client</a>
          </div>
        </div>
      </section>

      {/* Clients List */}
      <section style={{padding: 'var(--space-12) 0'}}>
        <div className="container">
          <div className="card">
            <div className="card-header">
              <h3>Active Clients ({clients.length})</h3>
            </div>
            <div className="card-body">
              {loading ? (
                <div style={{textAlign: 'center', padding: 'var(--space-8)'}}>
                  <div style={{fontSize: '1.2rem', color: 'var(--gray-600)'}}>Loading clients...</div>
                </div>
              ) : error ? (
                <div style={{textAlign: 'center', padding: 'var(--space-8)', color: 'var(--red-600)'}}>
                  <div style={{fontSize: '1.2rem'}}>{error}</div>
                  <button 
                    onClick={fetchClients} 
                    className="btn btn-secondary" 
                    style={{marginTop: 'var(--space-4)'}}
                  >
                    Retry
                  </button>
                </div>
              ) : clients.length === 0 ? (
                <div style={{textAlign: 'center', padding: 'var(--space-8)'}}>
                  <div style={{fontSize: '1.2rem', color: 'var(--gray-600)', marginBottom: 'var(--space-4)'}}>
                    No clients found
                  </div>
                  <div style={{fontSize: '0.875rem', color: 'var(--gray-500)', marginBottom: 'var(--space-4)'}}>
                    Create your first client to start managing credit repair cases
                  </div>
                  <a href="/clients/new" className="btn btn-primary">
                    Add Your First Client
                  </a>
                </div>
              ) : (
                <div style={{display: 'flex', flexDirection: 'column', gap: 'var(--space-4)'}}>
                  {clients.map((client) => (
                    <div key={client.id} style={{display: 'grid', gridTemplateColumns: '1fr 150px 120px 120px', gap: 'var(--space-4)', padding: 'var(--space-4)', background: 'var(--gray-50)', borderRadius: 'var(--radius)', alignItems: 'center'}}>
                      <div>
                        <strong>{client.email}</strong>
                        <div style={{color: 'var(--gray-600)', fontSize: '0.875rem'}}>
                          Created: {new Date(client.created_at).toLocaleDateString()}
                        </div>
                      </div>
                      {getStatusBadge(client)}
                      <span style={{color: 'var(--gray-600)', fontSize: '0.875rem'}}>
                        0 disputes {/* TODO: Fetch actual dispute count */}
                      </span>
                      <a href={`/clients/${client.id}`} className="btn btn-secondary" style={{fontSize: '0.75rem', padding: 'var(--space-2) var(--space-3)'}}>
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
