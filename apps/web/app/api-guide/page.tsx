export default function ApiGuide() {
  return (
    <>

      {/* API Guide Header */}
      <section style={{background: 'white', borderBottom: '1px solid var(--gray-200)', padding: 'var(--space-12) 0'}}>
        <div className="container">
          <h1>Credit Hardar API Guide</h1>
          <p style={{color: 'var(--gray-600)', fontSize: '1.125rem'}}>
            Learn how to integrate with Credit Hardar's powerful API to automate your credit repair workflow
          </p>
          <div style={{marginTop: 'var(--space-6)'}}>
            <a
              href="http://localhost:8000/docs"
              target="_blank"
              rel="noopener"
              className="btn btn-primary btn-lg"
            >
              View Interactive API Documentation
            </a>
          </div>
        </div>
      </section>

      {/* API Overview */}
      <section style={{padding: 'var(--space-12) 0'}}>
        <div className="container">
          
          {/* Quick Start */}
          <div className="card" style={{marginBottom: 'var(--space-8)'}}>
            <div className="card-header">
              <h2>Quick Start</h2>
            </div>
            <div className="card-body">
              <p>Get started with the Credit Hardar API in 3 simple steps:</p>
              
              <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 'var(--space-6)', marginTop: 'var(--space-6)'}}>
                <div style={{textAlign: 'center'}}>
                  <div style={{
                    width: '60px', 
                    height: '60px', 
                    background: 'var(--primary)', 
                    color: 'white', 
                    borderRadius: '50%', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    margin: '0 auto var(--space-4)', 
                    fontSize: '1.5rem', 
                    fontWeight: 'bold'
                  }}>1</div>
                  <h3>Get API Key</h3>
                  <p>Sign up for an account and generate your API key from the dashboard</p>
                </div>
                
                <div style={{textAlign: 'center'}}>
                  <div style={{
                    width: '60px', 
                    height: '60px', 
                    background: 'var(--primary)', 
                    color: 'white', 
                    borderRadius: '50%', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    margin: '0 auto var(--space-4)', 
                    fontSize: '1.5rem', 
                    fontWeight: 'bold'
                  }}>2</div>
                  <h3>Make API Call</h3>
                  <p>Use your API key to authenticate and start making requests</p>
                </div>
                
                <div style={{textAlign: 'center'}}>
                  <div style={{
                    width: '60px', 
                    height: '60px', 
                    background: 'var(--primary)', 
                    color: 'white', 
                    borderRadius: '50%', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    margin: '0 auto var(--space-4)', 
                    fontSize: '1.5rem', 
                    fontWeight: 'bold'
                  }}>3</div>
                  <h3>Automate Workflow</h3>
                  <p>Integrate with your existing systems and automate credit repair tasks</p>
                </div>
              </div>
            </div>
          </div>

          {/* API Endpoints */}
          <div className="card" style={{marginBottom: 'var(--space-8)'}}>
            <div className="card-header">
              <h2>Key API Endpoints</h2>
            </div>
            <div className="card-body">
              <div style={{display: 'flex', flexDirection: 'column', gap: 'var(--space-6)'}}>
                
                <div style={{padding: 'var(--space-4)', border: '1px solid var(--gray-200)', borderRadius: 'var(--radius)'}}>
                  <div style={{display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-3)'}}>
                    <span className="badge badge-success">POST</span>
                    <code style={{background: 'var(--gray-100)', padding: 'var(--space-1) var(--space-2)', borderRadius: 'var(--radius-sm)'}}>/auth/signup</code>
                  </div>
                  <h4>Create User Account</h4>
                  <p>Register a new user account with email and password authentication.</p>
                </div>

                <div style={{padding: 'var(--space-4)', border: '1px solid var(--gray-200)', borderRadius: 'var(--radius)'}}>
                  <div style={{display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-3)'}}>
                    <span className="badge badge-info">POST</span>
                    <code style={{background: 'var(--gray-100)', padding: 'var(--space-1) var(--space-2)', borderRadius: 'var(--radius-sm)'}}>/reports/upload</code>
                  </div>
                  <h4>Upload Credit Reports</h4>
                  <p>Upload credit reports in PDF format for automatic analysis and dispute identification.</p>
                </div>

                <div style={{padding: 'var(--space-4)', border: '1px solid var(--gray-200)', borderRadius: 'var(--radius)'}}>
                  <div style={{display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-3)'}}>
                    <span className="badge badge-warning">POST</span>
                    <code style={{background: 'var(--gray-100)', padding: 'var(--space-1) var(--space-2)', borderRadius: 'var(--radius-sm)'}}>/disputes/create</code>
                  </div>
                  <h4>Create Disputes</h4>
                  <p>Generate dispute letters for credit bureau challenges with customizable templates.</p>
                </div>

                <div style={{padding: 'var(--space-4)', border: '1px solid var(--gray-200)', borderRadius: 'var(--radius)'}}>
                  <div style={{display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-3)'}}>
                    <span className="badge badge-error">POST</span>
                    <code style={{background: 'var(--gray-100)', padding: 'var(--space-1) var(--space-2)', borderRadius: 'var(--radius-sm)'}}>/mail/send-dispute</code>
                  </div>
                  <h4>Send Certified Mail</h4>
                  <p>Send dispute letters via certified mail with tracking and delivery confirmation.</p>
                </div>

              </div>
            </div>
          </div>

          {/* Code Examples */}
          <div className="card">
            <div className="card-header">
              <h2>Code Examples</h2>
            </div>
            <div className="card-body">
              
              <h3>Authentication</h3>
              <pre style={{
                background: 'var(--gray-900)', 
                color: 'var(--gray-100)', 
                padding: 'var(--space-4)', 
                borderRadius: 'var(--radius)', 
                overflow: 'auto',
                marginBottom: 'var(--space-6)'
              }}>
{`curl -X POST "http://localhost:8000/auth/signup" \\
  -H "Content-Type: application/json" \\
  -d '{
    "email": "john@agency.com",
    "password": "SecurePassword123!",
    "role": "owner"
  }'`}
              </pre>

              <h3>Upload Credit Report</h3>
              <pre style={{
                background: 'var(--gray-900)', 
                color: 'var(--gray-100)', 
                padding: 'var(--space-4)', 
                borderRadius: 'var(--radius)', 
                overflow: 'auto',
                marginBottom: 'var(--space-6)'
              }}>
{`curl -X POST "http://localhost:8000/reports/upload" \\
  -H "Authorization: Bearer YOUR_TOKEN" \\
  -F "file=@credit_report.pdf"`}
              </pre>

              <h3>Send Dispute Letter</h3>
              <pre style={{
                background: 'var(--gray-900)', 
                color: 'var(--gray-100)', 
                padding: 'var(--space-4)', 
                borderRadius: 'var(--radius)', 
                overflow: 'auto'
              }}>
{`curl -X POST "http://localhost:8000/mail/send-dispute" \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer YOUR_TOKEN" \\
  -d '{
    "recipient": {
      "name": "Experian",
      "address": "P.O. Box 4500",
      "city": "Allen",
      "state": "TX",
      "zip_code": "75013"
    },
    "letter_type": "dispute",
    "send_certified": true,
    "return_receipt": true
  }'`}
              </pre>

            </div>
          </div>

        </div>
      </section>
    </>
  );
}
