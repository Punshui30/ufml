export default function Workflow() {
  return (
    <>
      {/* Workflow Header */}
      <section style={{background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', padding: 'var(--space-16) 0'}}>
        <div className="container">
          <h1 style={{fontSize: '3rem', marginBottom: 'var(--space-4)'}}>Credit Hardar Workflow</h1>
          <p style={{fontSize: '1.25rem', opacity: 0.9, maxWidth: '600px'}}>
            Industry's most efficient compliance-based credit enhancement software system
          </p>
          <div style={{marginTop: 'var(--space-8)'}}>
            <a href="/register" className="btn btn-primary btn-lg" style={{marginRight: 'var(--space-4)'}}>
              Get Started Free
            </a>
            <a href="/demo" className="btn btn-outline-light btn-lg">
              View Demo
            </a>
          </div>
        </div>
      </section>

      {/* Workflow Overview */}
      <section style={{padding: 'var(--space-16) 0', background: 'white'}}>
        <div className="container">
          <div style={{textAlign: 'center', marginBottom: 'var(--space-12)'}}>
            <h2 style={{fontSize: '2.5rem', marginBottom: 'var(--space-4)'}}>Complete Credit Repair Workflow</h2>
            <p style={{fontSize: '1.125rem', color: 'var(--gray-600)', maxWidth: '800px', margin: '0 auto'}}>
              From client onboarding to automated dispute campaigns, manage your entire credit repair process in one platform
            </p>
          </div>

          {/* Workflow Steps */}
          <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 'var(--space-8)'}}>
            
            {/* Step 1: Client Management */}
            <div className="card" style={{textAlign: 'center', padding: 'var(--space-8)', border: '2px solid var(--primary)'}}>
              <div style={{
                width: '80px', 
                height: '80px', 
                background: 'var(--primary)', 
                color: 'white', 
                borderRadius: '50%', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                margin: '0 auto var(--space-6)', 
                fontSize: '2rem'
              }}>👥</div>
              <h3 style={{fontSize: '1.5rem', marginBottom: 'var(--space-4)'}}>1. Client Management</h3>
              <ul style={{textAlign: 'left', marginBottom: 'var(--space-6)'}}>
                <li>Profile Management Dashboard</li>
                <li>Bulk Client Import</li>
                <li>Client Onboarding Links</li>
                <li>Document Upload System</li>
              </ul>
              <a href="/clients" className="btn btn-primary">Manage Clients</a>
            </div>

            {/* Step 2: Credit Report Processing */}
            <div className="card" style={{textAlign: 'center', padding: 'var(--space-8)'}}>
              <div style={{
                width: '80px', 
                height: '80px', 
                background: 'var(--secondary)', 
                color: 'white', 
                borderRadius: '50%', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                margin: '0 auto var(--space-6)', 
                fontSize: '2rem'
              }}>📊</div>
              <h3 style={{fontSize: '1.5rem', marginBottom: 'var(--space-4)'}}>2. Report Analysis</h3>
              <ul style={{textAlign: 'left', marginBottom: 'var(--space-6)'}}>
                <li>1-Click Credit Report Import</li>
                <li>Automated Analysis & Scoring</li>
                <li>Dispute Opportunity Detection</li>
                <li>Metro 2 Compliance</li>
              </ul>
              <a href="/reports" className="btn btn-secondary">Upload Reports</a>
            </div>

            {/* Step 3: Dispute Campaigns */}
            <div className="card" style={{textAlign: 'center', padding: 'var(--space-8)'}}>
              <div style={{
                width: '80px', 
                height: '80px', 
                background: 'var(--success)', 
                color: 'white', 
                borderRadius: '50%', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                margin: '0 auto var(--space-6)', 
                fontSize: '2rem'
              }}>⚔️</div>
              <h3 style={{fontSize: '1.5rem', marginBottom: 'var(--space-4)'}}>3. Dispute Campaigns</h3>
              <ul style={{textAlign: 'left', marginBottom: 'var(--space-6)'}}>
                <li>Round of Attacks System</li>
                <li>Automated Letter Generation</li>
                <li>Certified Mail Tracking</li>
                <li>Campaign Analytics</li>
              </ul>
              <a href="/disputes" className="btn btn-success">Launch Campaigns</a>
            </div>

            {/* Step 4: Communication */}
            <div className="card" style={{textAlign: 'center', padding: 'var(--space-8)'}}>
              <div style={{
                width: '80px', 
                height: '80px', 
                background: 'var(--warning)', 
                color: 'white', 
                borderRadius: '50%', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                margin: '0 auto var(--space-6)', 
                fontSize: '2rem'
              }}>📱</div>
              <h3 style={{fontSize: '1.5rem', marginBottom: 'var(--space-4)'}}>4. Communication</h3>
              <ul style={{textAlign: 'left', marginBottom: 'var(--space-6)'}}>
                <li>SMS & Email Integration</li>
                <li>Client Portal</li>
                <li>Automated Updates</li>
                <li>Support Ticketing</li>
              </ul>
              <a href="/mail" className="btn btn-warning">Communication Hub</a>
            </div>

          </div>
        </div>
      </section>

      {/* Metro 2 Compliance Section */}
      <section style={{padding: 'var(--space-16) 0', background: 'var(--gray-50)'}}>
        <div className="container">
          <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-12)', alignItems: 'center'}}>
            <div>
              <h2 style={{fontSize: '2.5rem', marginBottom: 'var(--space-6)'}}>Metro 2 Compliance</h2>
              <p style={{fontSize: '1.125rem', color: 'var(--gray-600)', marginBottom: 'var(--space-6)'}}>
                Built-in Metro 2 format compliance ensures all credit reporting meets industry standards and legal requirements.
              </p>
              <div style={{display: 'flex', flexDirection: 'column', gap: 'var(--space-4)'}}>
                <div style={{display: 'flex', alignItems: 'center', gap: 'var(--space-3)'}}>
                  <span style={{color: 'var(--success)', fontSize: '1.5rem'}}>✅</span>
                  <span>Automatic format validation</span>
                </div>
                <div style={{display: 'flex', alignItems: 'center', gap: 'var(--space-3)'}}>
                  <span style={{color: 'var(--success)', fontSize: '1.5rem'}}>✅</span>
                  <span>Industry-standard compliance</span>
                </div>
                <div style={{display: 'flex', alignItems: 'center', gap: 'var(--space-3)'}}>
                  <span style={{color: 'var(--success)', fontSize: '1.5rem'}}>✅</span>
                  <span>Legal requirement adherence</span>
                </div>
              </div>
            </div>
            <div style={{textAlign: 'center'}}>
              <div style={{
                width: '200px', 
                height: '200px', 
                background: 'linear-gradient(135deg, var(--primary), var(--secondary))', 
                borderRadius: '50%', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                margin: '0 auto',
                fontSize: '4rem',
                color: 'white'
              }}>📋</div>
            </div>
          </div>
        </div>
      </section>

      {/* API Integration Section */}
      <section style={{padding: 'var(--space-16) 0', background: 'white'}}>
        <div className="container">
          <div style={{textAlign: 'center', marginBottom: 'var(--space-12)'}}>
            <h2 style={{fontSize: '2.5rem', marginBottom: 'var(--space-4)'}}>API Integration</h2>
            <p style={{fontSize: '1.125rem', color: 'var(--gray-600)'}}>
              Seamlessly integrate with your existing systems and automate your workflow
            </p>
          </div>

          <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 'var(--space-6)'}}>
            
            <div className="card" style={{textAlign: 'center', padding: 'var(--space-6)'}}>
              <div style={{fontSize: '3rem', marginBottom: 'var(--space-4)'}}>🔗</div>
              <h4>Webhook Integration</h4>
              <p>Real-time notifications for status updates and completions</p>
            </div>

            <div className="card" style={{textAlign: 'center', padding: 'var(--space-6)'}}>
              <div style={{fontSize: '3rem', marginBottom: 'var(--space-4)'}}>📡</div>
              <h4>REST API</h4>
              <p>Full REST API access for custom integrations and automation</p>
            </div>

            <div className="card" style={{textAlign: 'center', padding: 'var(--space-6)'}}>
              <div style={{fontSize: '3rem', marginBottom: 'var(--space-4)'}}>📊</div>
              <h4>Data Export</h4>
              <p>Export client data and reports in multiple formats</p>
            </div>

            <div className="card" style={{textAlign: 'center', padding: 'var(--space-6)'}}>
              <div style={{fontSize: '3rem', marginBottom: 'var(--space-4)'}}>🔐</div>
              <h4>Secure Authentication</h4>
              <p>Enterprise-grade security with API keys and OAuth support</p>
            </div>

          </div>

          <div style={{textAlign: 'center', marginTop: 'var(--space-8)'}}>
            <a href="/api-guide" className="btn btn-primary btn-lg">
              View API Documentation
            </a>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={{padding: 'var(--space-16) 0', background: 'var(--primary)', color: 'white', textAlign: 'center'}}>
        <div className="container">
          <h2 style={{fontSize: '2.5rem', marginBottom: 'var(--space-4)'}}>Ready to Transform Your Credit Repair Business?</h2>
          <p style={{fontSize: '1.25rem', marginBottom: 'var(--space-8)', opacity: 0.9}}>
            Join thousands of credit repair professionals using Credit Hardar to streamline their workflow
          </p>
          <div style={{display: 'flex', gap: 'var(--space-4)', justifyContent: 'center', flexWrap: 'wrap'}}>
            <a href="/register" className="btn btn-light btn-lg">
              Start Free Trial
            </a>
            <a href="/pricing" className="btn btn-outline-light btn-lg">
              View Pricing
            </a>
          </div>
        </div>
      </section>
    </>
  );
}


