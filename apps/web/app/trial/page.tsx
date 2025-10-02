'use client';

export default function FreeTrial() {
  return (
    <>

      {/* Trial Header */}
      <section className="hero">
        <div className="container">
          <h1>Start Your Free Trial</h1>
          <p>Get full access to Credit Hardar for 14 days. No credit card required.</p>
        </div>
      </section>

      {/* Trial Form */}
      <section style={{padding: 'var(--space-20) 0'}}>
        <div className="container">
          <div style={{maxWidth: '500px', margin: '0 auto'}}>
            <div className="card">
              <div className="card-header">
                <h3>Create Your Account</h3>
                <p style={{margin: 0, color: 'var(--gray-600)'}}>Start your 14-day free trial today</p>
              </div>
              <div className="card-body">
                <form style={{display: 'flex', flexDirection: 'column', gap: 'var(--space-4)'}}>
                  <div>
                    <label style={{display: 'block', marginBottom: 'var(--space-2)', fontWeight: '500'}}>
                      Business Name
                    </label>
                    <input 
                      type="text" 
                      placeholder="Your Credit Repair Agency"
                      style={{
                        width: '100%',
                        padding: 'var(--space-3)',
                        border: '1px solid var(--gray-300)',
                        borderRadius: 'var(--radius)',
                        fontSize: '1rem'
                      }}
                    />
                  </div>
                  
                  <div>
                    <label style={{display: 'block', marginBottom: 'var(--space-2)', fontWeight: '500'}}>
                      Your Name
                    </label>
                    <input 
                      type="text" 
                      placeholder="John Smith"
                      style={{
                        width: '100%',
                        padding: 'var(--space-3)',
                        border: '1px solid var(--gray-300)',
                        borderRadius: 'var(--radius)',
                        fontSize: '1rem'
                      }}
                    />
                  </div>
                  
                  <div>
                    <label style={{display: 'block', marginBottom: 'var(--space-2)', fontWeight: '500'}}>
                      Email Address
                    </label>
                    <input 
                      type="email" 
                      placeholder="john@youragency.com"
                      style={{
                        width: '100%',
                        padding: 'var(--space-3)',
                        border: '1px solid var(--gray-300)',
                        borderRadius: 'var(--radius)',
                        fontSize: '1rem'
                      }}
                    />
                  </div>
                  
                  <div>
                    <label style={{display: 'block', marginBottom: 'var(--space-2)', fontWeight: '500'}}>
                      Password
                    </label>
                    <input 
                      type="password" 
                      placeholder="Create a secure password"
                      style={{
                        width: '100%',
                        padding: 'var(--space-3)',
                        border: '1px solid var(--gray-300)',
                        borderRadius: 'var(--radius)',
                        fontSize: '1rem'
                      }}
                    />
                  </div>
                  
                  <div>
                    <label style={{display: 'block', marginBottom: 'var(--space-2)', fontWeight: '500'}}>
                      Business Type
                    </label>
                    <select 
                      style={{
                        width: '100%',
                        padding: 'var(--space-3)',
                        border: '1px solid var(--gray-300)',
                        borderRadius: 'var(--radius)',
                        fontSize: '1rem',
                        background: 'white'
                      }}
                    >
                      <option>Credit Repair Agency</option>
                      <option>Law Firm</option>
                      <option>Financial Services</option>
                      <option>Individual Consultant</option>
                      <option>Other</option>
                    </select>
                  </div>
                  
                  <button 
                    type="submit"
                    className="btn btn-primary btn-lg"
                    style={{width: '100%', marginTop: 'var(--space-4)'}}
                    onClick={(e) => {
                      e.preventDefault();
                      window.location.href = '/dashboard';
                    }}
                  >
                    Start Free Trial
                  </button>
                </form>
              </div>
            </div>
            
            {/* Trial Benefits */}
            <div className="card" style={{marginTop: 'var(--space-8)'}}>
              <div className="card-header">
                <h3>What's Included in Your Trial</h3>
              </div>
              <div className="card-body">
                <div style={{display: 'flex', flexDirection: 'column', gap: 'var(--space-3)'}}>
                  <div style={{display: 'flex', alignItems: 'center', gap: 'var(--space-3)'}}>
                    <span style={{color: 'var(--success)', fontSize: '1.2rem'}}>✓</span>
                    <span>Up to 5 clients</span>
                  </div>
                  <div style={{display: 'flex', alignItems: 'center', gap: 'var(--space-3)'}}>
                    <span style={{color: 'var(--success)', fontSize: '1.2rem'}}>✓</span>
                    <span>Unlimited dispute letters</span>
                  </div>
                  <div style={{display: 'flex', alignItems: 'center', gap: 'var(--space-3)'}}>
                    <span style={{color: 'var(--success)', fontSize: '1.2rem'}}>✓</span>
                    <span>Credit report analysis</span>
                  </div>
                  <div style={{display: 'flex', alignItems: 'center', gap: 'var(--space-3)'}}>
                    <span style={{color: 'var(--success)', fontSize: '1.2rem'}}>✓</span>
                    <span>Mail service integration</span>
                  </div>
                  <div style={{display: 'flex', alignItems: 'center', gap: 'var(--space-3)'}}>
                    <span style={{color: 'var(--success)', fontSize: '1.2rem'}}>✓</span>
                    <span>Full API access</span>
                  </div>
                  <div style={{display: 'flex', alignItems: 'center', gap: 'var(--space-3)'}}>
                    <span style={{color: 'var(--success)', fontSize: '1.2rem'}}>✓</span>
                    <span>Email support</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
