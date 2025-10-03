'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { CONFIG } from '../../config';
import { uploadPdf } from '../../services/upload';

interface Client {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  created_at: string;
}

export default function UploadReport() {
  const router = useRouter();
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    file: null as File | null,
    client_id: '',
    bureau: '',
    eOscarBypassEnabled: false
  });

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${CONFIG.API_URL}/clients`);
      const data = await response.json();
      setClients(data.clients || []);
    } catch (error) {
      console.error('Failed to fetch clients:', error);
      setError('Failed to load clients. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      setFormData(prev => ({ ...prev, file }));
      setError('');
    } else {
      setError('Please select a valid PDF file.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.file || !formData.client_id || !formData.bureau) {
      setError('Please fill in all required fields and select a file.');
      return;
    }

    setUploading(true);
    setError('');

    try {
      const result = await uploadPdf(formData.file, formData.client_id, formData.bureau);
      alert(`Report uploaded successfully! ID: ${result.id || result.report_id || 'Generated'}`);
      router.push('/reports');
      
    } catch (error: any) {
      console.error('Failed to upload report:', error);
      setError(`Upload failed: ${error.message}`);
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <div className="container" style={{ padding: 'var(--space-12) 0' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', marginBottom: 'var(--space-4)' }}>⏳</div>
          <p>Loading clients...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: 'var(--space-12) 0' }}>
      <div className="row">
        <div className="col-md-8 col-lg-6 mx-auto">
          <div className="card">
            <div className="card-header">
              <h2>Upload Credit Report</h2>
            </div>
            <div className="card-body">
              {error && (
                <div className="alert alert-danger" role="alert">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="form-group" style={{ marginBottom: 'var(--space-6)' }}>
                  <label htmlFor="client_id">Select Client *</label>
                  <select
                    id="client_id"
                    className="form-control"
                    value={formData.client_id}
                    onChange={(e) => setFormData(prev => ({ ...prev, client_id: e.target.value }))}
                    required
                  >
                    <option value="">Choose a client...</option>
                    {clients.map((client) => (
                      <option key={client.id} value={client.id}>
                        {client.first_name} {client.last_name} ({client.email})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group" style={{ marginBottom: 'var(--space-6)' }}>
                  <label htmlFor="bureau">Credit Bureau *</label>
                  <select
                    id="bureau"
                    className="form-control"
                    value={formData.bureau}
                    onChange={(e) => setFormData(prev => ({ ...prev, bureau: e.target.value }))}
                    required
                  >
                    <option value="">Select credit bureau...</option>
                    <option value="Experian">Experian</option>
                    <option value="Equifax">Equifax</option>
                    <option value="TransUnion">TransUnion</option>
                  </select>
                </div>

                <div className="form-group" style={{ marginBottom: 'var(--space-6)' }}>
                  <label htmlFor="file">PDF File *</label>
                  <input
                    type="file"
                    id="file"
                    className="form-control"
                    accept=".pdf"
                    onChange={handleFileChange}
                    required
                  />
                  <small className="form-text text-muted">
                    Only PDF files are accepted. Maximum file size: 10MB
                  </small>
                </div>

                <div className="form-group" style={{ marginBottom: 'var(--space-6)' }}>
                  <div className="form-check">
                    <input
                      type="checkbox"
                      id="eOscarBypass"
                      className="form-check-input"
                      checked={formData.eOscarBypassEnabled}
                      onChange={(e) => setFormData(prev => ({ ...prev, eOscarBypassEnabled: e.target.checked }))}
                    />
                    <label htmlFor="eOscarBypass" className="form-check-label">
                      Enable E-Oscar Bypass Strategies
                    </label>
                  </div>
                </div>

                <div className="form-group">
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={uploading}
                    style={{ width: '100%' }}
                  >
                    {uploading ? 'Uploading...' : 'Upload Report'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}