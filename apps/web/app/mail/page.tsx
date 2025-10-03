'use client';

import { useState, useEffect } from 'react';
import { api } from '../lib/api';

interface MailServiceStatus {
  current_service: string;
  services: {
    lob: { configured: boolean; status: string };
    click2mail: { configured: boolean; status: string };
    postgrid: { configured: boolean; status: string };
  };
  webhook_configured: boolean;
}

export default function Mail() {
  const [serviceStatus, setServiceStatus] = useState<MailServiceStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchMailStatus();
  }, []);

  const fetchMailStatus = async () => {
    try {
      setLoading(true);
      const response = await api('/mail/status');
      setServiceStatus(response);
    } catch (error: any) {
      console.error('Failed to fetch mail status:', error);
      setError('Failed to load mail service status');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string, configured: boolean) => {
    if (configured) {
      if (status === 'ready') {
        return <span className="badge badge-success">Ready</span>;
      } else {
        return <span className="badge badge-warning">Configured</span>;
      }
    } else {
      return <span className="badge badge-error">Not Configured</span>;
    }
  };

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
              <li><a href="/mail">Mail</a></li>
            </ul>
          </div>
        </div>
      </nav>

      {/* Page Header */}
      <section style={{background: 'white', borderBottom: '1px solid var(--gray-200)', padding: 'var(--space-8) 0'}}>
        <div className="container">
          <div className="flex items-center justify-between">
            <div>
              <h1>Mail Services</h1>
              <p style={{color: 'var(--gray-600)'}}>Send certified mail and track delivery status</p>
            </div>
            <a href="/mail/send" className="btn btn-primary">Send Mail</a>
          </div>
        </div>
      </section>

      {/* Mail Status */}
      <section style={{padding: 'var(--space-12) 0'}}>
        <div className="container">
          
          {/* Service Status */}
          <div className="card" style={{marginBottom: 'var(--space-8)'}}>
            <div className="card-header">
              <h3>Mail Service Status</h3>
            </div>
            <div className="card-body">
              {loading ? (
                <div style={{textAlign: 'center', padding: 'var(--space-8)'}}>
                  <div style={{fontSize: '1.2rem', color: 'var(--gray-600)'}}>Loading mail service status...</div>
                </div>
              ) : error ? (
                <div style={{textAlign: 'center', padding: 'var(--space-8)', color: 'var(--red-600)'}}>
                  <div style={{fontSize: '1.2rem'}}>{error}</div>
                  <button 
                    onClick={fetchMailStatus} 
                    className="btn btn-secondary" 
                    style={{marginTop: 'var(--space-4)'}}
                  >
                    Retry
                  </button>
                </div>
              ) : serviceStatus ? (
                <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--space-4)'}}>
                  <div style={{textAlign: 'center', padding: 'var(--space-4)', border: '1px solid var(--gray-200)', borderRadius: 'var(--radius)'}}>
                    <h4>Lob.com</h4>
                    {getStatusBadge(serviceStatus.services.lob.status, serviceStatus.services.lob.configured)}
                    <p style={{fontSize: '0.875rem', marginTop: 'var(--space-2)'}}>
                      {serviceStatus.services.lob.configured ? 'API key configured' : 'Configure API key to enable'}
                    </p>
                  </div>
                  <div style={{textAlign: 'center', padding: 'var(--space-4)', border: '1px solid var(--gray-200)', borderRadius: 'var(--radius)'}}>
                    <h4>Click2Mail</h4>
                    {getStatusBadge(serviceStatus.services.click2mail.status, serviceStatus.services.click2mail.configured)}
                    <p style={{fontSize: '0.875rem', marginTop: 'var(--space-2)'}}>
                      {serviceStatus.services.click2mail.configured ? 'Credentials configured' : 'Add credentials to enable'}
                    </p>
                  </div>
                  <div style={{textAlign: 'center', padding: 'var(--space-4)', border: '1px solid var(--gray-200)', borderRadius: 'var(--radius)'}}>
                    <h4>PostGrid</h4>
                    {getStatusBadge(serviceStatus.services.postgrid.status, serviceStatus.services.postgrid.configured)}
                    <p style={{fontSize: '0.875rem', marginTop: 'var(--space-2)'}}>
                      {serviceStatus.services.postgrid.configured ? 'API key configured' : 'Add API key to enable'}
                    </p>
                  </div>
                </div>
              ) : null}
            </div>
          </div>

          {/* Recent Mail */}
          <div className="card">
            <div className="card-header">
              <h3>Recent Mail</h3>
            </div>
            <div className="card-body">
              <div style={{textAlign: 'center', padding: 'var(--space-8)'}}>
                <div style={{fontSize: '1.2rem', color: 'var(--gray-600)', marginBottom: 'var(--space-4)'}}>
                  No mail sent yet
                </div>
                <p style={{color: 'var(--gray-500)', marginBottom: 'var(--space-6)'}}>
                  Send your first dispute letter to see tracking information here.
                </p>
                <a href="/mail/send" className="btn btn-primary">
                  Send Your First Letter
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
