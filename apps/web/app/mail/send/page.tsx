'use client';

import { useState } from 'react';
import { CheckCircle } from 'lucide-react';
import { api } from '../../api';

interface MailRecipient {
  name: string;
  address: string;
  city: string;
  state: string;
  zip_code: string;
}

interface SendMailRequest {
  recipient: MailRecipient;
  letter_type: string;
  dispute_id?: string;
  send_certified: boolean;
  return_receipt: boolean;
  template?: string;
}

export default function SendMail() {
  const [formData, setFormData] = useState<SendMailRequest>({
    recipient: {
      name: '',
      address: '',
      city: '',
      state: '',
      zip_code: ''
    },
    letter_type: 'dispute',
    send_certified: true,
    return_receipt: false
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await api('/mail/send-dispute', {
        method: 'POST',
        body: JSON.stringify(formData)
      });

      console.log('Mail sent successfully:', response);
      setSuccess(true);
    } catch (error: any) {
      console.error('Failed to send mail:', error);
      // Handle API key configuration error specifically
      if (error.message && error.message.includes('Mail service not configured')) {
        setError('Mail service not configured. You need to set up a mail service API key (Lob, Click2Mail, or PostGrid) to enable actual letter sending. See API_KEYS_SETUP_GUIDE.md for setup instructions.');
      } else {
        setError('Failed to send mail. Please check your mail service configuration.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    if (name.startsWith('recipient.')) {
      const field = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        recipient: {
          ...prev.recipient,
          [field]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
      }));
    }
  };

  if (success) {
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

        <section style={{padding: 'var(--space-12) 0'}}>
          <div className="container">
            <div className="card" style={{maxWidth: '600px', margin: '0 auto', textAlign: 'center'}}>
              <div className="card-body">
                <div style={{marginBottom: 'var(--space-4)'}}><CheckCircle className="w-12 h-12 text-green-600 mx-auto" /></div>
                <h2 style={{color: 'var(--green-600)', marginBottom: 'var(--space-4)'}}>Mail Sent Successfully!</h2>
                <p style={{color: 'var(--gray-600)', marginBottom: 'var(--space-6)'}}>
                  Your dispute letter has been sent via certified mail. You can track its delivery status from the mail page.
                </p>
                <div style={{display: 'flex', gap: 'var(--space-4)', justifyContent: 'center'}}>
                  <a href="/mail" className="btn btn-primary">View Mail Status</a>
                  <a href="/dashboard" className="btn btn-secondary">Back to Dashboard</a>
                </div>
              </div>
            </div>
          </div>
        </section>
      </>
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
              <li><a href="/mail">Mail</a></li>
            </ul>
          </div>
        </div>
      </nav>

      {/* Page Header */}
      <section style={{background: 'white', borderBottom: '1px solid var(--gray-200)', padding: 'var(--space-8) 0'}}>
        <div className="container">
          <div>
            <h1>Send Mail</h1>
            <p style={{color: 'var(--gray-600)'}}>Send certified dispute letters to credit bureaus</p>
          </div>
        </div>
      </section>

      {/* Send Mail Form */}
      <section style={{padding: 'var(--space-12) 0'}}>
        <div className="container">
          <div className="card" style={{maxWidth: '800px', margin: '0 auto'}}>
            <div className="card-header">
              <h3>Mail Recipient Information</h3>
            </div>
            <div className="card-body">
              {error && (
                <div style={{backgroundColor: 'var(--red-100)', color: 'var(--red-800)', padding: 'var(--space-4)', borderRadius: 'var(--rounded-md)', marginBottom: 'var(--space-6)', textAlign: 'center'}}>
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-6)', marginBottom: 'var(--space-6)'}}>
                  <div>
                    <label htmlFor="recipient.name" style={{display: 'block', color: 'var(--gray-700)', fontSize: 'var(--font-size-sm)', fontWeight: 'medium', marginBottom: 'var(--space-2)'}}>
                      Recipient Name *
                    </label>
                    <input
                      type="text"
                      id="recipient.name"
                      name="recipient.name"
                      value={formData.recipient.name}
                      onChange={handleInputChange}
                      required
                      style={{display: 'block', width: '100%', padding: 'var(--space-3)', border: '1px solid var(--gray-300)', borderRadius: 'var(--rounded-md)', boxShadow: 'var(--shadow-sm)', fontSize: 'var(--font-size-base)'}}
                      placeholder="e.g., Experian Consumer Services"
                    />
                  </div>

                  <div>
                    <label htmlFor="letter_type" style={{display: 'block', color: 'var(--gray-700)', fontSize: 'var(--font-size-sm)', fontWeight: 'medium', marginBottom: 'var(--space-2)'}}>
                      Letter Type *
                    </label>
                    <select
                      id="letter_type"
                      name="letter_type"
                      value={formData.letter_type}
                      onChange={handleInputChange}
                      required
                      style={{display: 'block', width: '100%', padding: 'var(--space-3)', border: '1px solid var(--gray-300)', borderRadius: 'var(--rounded-md)', boxShadow: 'var(--shadow-sm)', fontSize: 'var(--font-size-base)'}}
                    >
                      <option value="dispute">Credit Dispute Letter</option>
                      <option value="goodwill">Goodwill Letter</option>
                      <option value="verification">Verification Request</option>
                    </select>
                  </div>
                </div>

                <div style={{marginBottom: 'var(--space-6)'}}>
                  <label htmlFor="recipient.address" style={{display: 'block', color: 'var(--gray-700)', fontSize: 'var(--font-size-sm)', fontWeight: 'medium', marginBottom: 'var(--space-2)'}}>
                    Street Address *
                  </label>
                  <input
                    type="text"
                    id="recipient.address"
                    name="recipient.address"
                    value={formData.recipient.address}
                    onChange={handleInputChange}
                    required
                    style={{display: 'block', width: '100%', padding: 'var(--space-3)', border: '1px solid var(--gray-300)', borderRadius: 'var(--rounded-md)', boxShadow: 'var(--shadow-sm)', fontSize: 'var(--font-size-base)'}}
                    placeholder="e.g., P.O. Box 4500"
                  />
                </div>

                <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 'var(--space-6)', marginBottom: 'var(--space-6)'}}>
                  <div>
                    <label htmlFor="recipient.city" style={{display: 'block', color: 'var(--gray-700)', fontSize: 'var(--font-size-sm)', fontWeight: 'medium', marginBottom: 'var(--space-2)'}}>
                      City *
                    </label>
                    <input
                      type="text"
                      id="recipient.city"
                      name="recipient.city"
                      value={formData.recipient.city}
                      onChange={handleInputChange}
                      required
                      style={{display: 'block', width: '100%', padding: 'var(--space-3)', border: '1px solid var(--gray-300)', borderRadius: 'var(--rounded-md)', boxShadow: 'var(--shadow-sm)', fontSize: 'var(--font-size-base)'}}
                      placeholder="e.g., Allen"
                    />
                  </div>

                  <div>
                    <label htmlFor="recipient.state" style={{display: 'block', color: 'var(--gray-700)', fontSize: 'var(--font-size-sm)', fontWeight: 'medium', marginBottom: 'var(--space-2)'}}>
                      State *
                    </label>
                    <input
                      type="text"
                      id="recipient.state"
                      name="recipient.state"
                      value={formData.recipient.state}
                      onChange={handleInputChange}
                      required
                      style={{display: 'block', width: '100%', padding: 'var(--space-3)', border: '1px solid var(--gray-300)', borderRadius: 'var(--rounded-md)', boxShadow: 'var(--shadow-sm)', fontSize: 'var(--font-size-base)'}}
                      placeholder="e.g., TX"
                      maxLength={2}
                    />
                  </div>

                  <div>
                    <label htmlFor="recipient.zip_code" style={{display: 'block', color: 'var(--gray-700)', fontSize: 'var(--font-size-sm)', fontWeight: 'medium', marginBottom: 'var(--space-2)'}}>
                      ZIP Code *
                    </label>
                    <input
                      type="text"
                      id="recipient.zip_code"
                      name="recipient.zip_code"
                      value={formData.recipient.zip_code}
                      onChange={handleInputChange}
                      required
                      style={{display: 'block', width: '100%', padding: 'var(--space-3)', border: '1px solid var(--gray-300)', borderRadius: 'var(--rounded-md)', boxShadow: 'var(--shadow-sm)', fontSize: 'var(--font-size-base)'}}
                      placeholder="e.g., 75013"
                    />
                  </div>
                </div>

                <div style={{marginBottom: 'var(--space-8)'}}>
                  <h4 style={{marginBottom: 'var(--space-4)'}}>Mail Options</h4>
                  <div style={{display: 'flex', flexDirection: 'column', gap: 'var(--space-4)'}}>
                    <label style={{display: 'flex', alignItems: 'center', gap: 'var(--space-3)'}}>
                      <input
                        type="checkbox"
                        name="send_certified"
                        checked={formData.send_certified}
                        onChange={handleInputChange}
                        style={{width: '16px', height: '16px'}}
                      />
                      <span>Send as Certified Mail (recommended for disputes)</span>
                    </label>
                    <label style={{display: 'flex', alignItems: 'center', gap: 'var(--space-3)'}}>
                      <input
                        type="checkbox"
                        name="return_receipt"
                        checked={formData.return_receipt}
                        onChange={handleInputChange}
                        style={{width: '16px', height: '16px'}}
                      />
                      <span>Request Return Receipt (additional fee)</span>
                    </label>
                  </div>
                </div>

                <div style={{display: 'flex', gap: 'var(--space-4)', justifyContent: 'flex-end'}}>
                  <a href="/mail" className="btn btn-secondary">Cancel</a>
                  <button
                    type="submit"
                    disabled={loading}
                    style={{padding: 'var(--space-3) var(--space-6)', backgroundColor: 'var(--blue-600)', color: 'white', borderRadius: 'var(--rounded-md)', fontWeight: 'medium', fontSize: 'var(--font-size-base)', cursor: 'pointer', transition: 'background-color 0.2s ease-in-out', opacity: loading ? 0.7 : 1}}
                  >
                    {loading ? 'Sending...' : 'Send Mail'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

