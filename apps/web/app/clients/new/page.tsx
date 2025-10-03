'use client';

import { useState } from 'react';
import { api } from '../../api';

interface CreateClientData {
  email: string;
  first_name: string;
  last_name: string;
  phone?: string;
}

export default function NewClient() {
  const [formData, setFormData] = useState<CreateClientData>({
    email: '',
    first_name: '',
    last_name: '',
    phone: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await api('/clients', {
        method: 'POST',
        body: JSON.stringify(formData)
      });

      alert(`Client created successfully! ID: ${response.id}`);
      window.location.href = '/clients';
    } catch (error: any) {
      console.error('Failed to create client:', error);
      alert(`Failed to create client: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
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
            </ul>
          </div>
        </div>
      </nav>

      {/* Page Header */}
      <section style={{background: 'white', borderBottom: '1px solid var(--gray-200)', padding: 'var(--space-8) 0'}}>
        <div className="container">
          <h1>Add New Client</h1>
          <p style={{color: 'var(--gray-600)'}}>Create a new client account for credit repair services</p>
        </div>
      </section>

      {/* New Client Form */}
      <section style={{padding: 'var(--space-12) 0'}}>
        <div className="container">
          <div style={{maxWidth: '600px', margin: '0 auto'}}>
            <div className="card">
              <div className="card-header">
                <h3>Client Information</h3>
              </div>
              <div className="card-body">
                <form onSubmit={handleSubmit} style={{display: 'flex', flexDirection: 'column', gap: 'var(--space-4)'}}>
                  <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)'}}>
                    <div>
                      <label style={{display: 'block', marginBottom: 'var(--space-2)', fontWeight: '500'}}>First Name</label>
                      <input 
                        type="text" 
                        name="first_name"
                        value={formData.first_name}
                        onChange={handleInputChange}
                        placeholder="John" 
                        required
                        style={{width: '100%', padding: 'var(--space-3)', border: '1px solid var(--gray-300)', borderRadius: 'var(--radius)'}} 
                      />
                    </div>
                    <div>
                      <label style={{display: 'block', marginBottom: 'var(--space-2)', fontWeight: '500'}}>Last Name</label>
                      <input 
                        type="text" 
                        name="last_name"
                        value={formData.last_name}
                        onChange={handleInputChange}
                        placeholder="Smith" 
                        required
                        style={{width: '100%', padding: 'var(--space-3)', border: '1px solid var(--gray-300)', borderRadius: 'var(--radius)'}} 
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label style={{display: 'block', marginBottom: 'var(--space-2)', fontWeight: '500'}}>Email Address</label>
                    <input 
                      type="email" 
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="john.smith@email.com" 
                      required
                      style={{width: '100%', padding: 'var(--space-3)', border: '1px solid var(--gray-300)', borderRadius: 'var(--radius)'}} 
                    />
                  </div>
                  
                  <div>
                    <label style={{display: 'block', marginBottom: 'var(--space-2)', fontWeight: '500'}}>Phone Number</label>
                    <input 
                      type="tel" 
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="(555) 123-4567" 
                      style={{width: '100%', padding: 'var(--space-3)', border: '1px solid var(--gray-300)', borderRadius: 'var(--radius)'}} 
                    />
                  </div>
                  
                  <div className="flex gap-4" style={{marginTop: 'var(--space-6)'}}>
                    <button 
                      type="submit" 
                      className="btn btn-primary"
                      disabled={loading}
                    >
                      {loading ? 'Creating...' : 'Create Client'}
                    </button>
                    <a href="/clients" className="btn btn-secondary">Cancel</a>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
