'use client';
import { 
  CreditReportIcon, 
  DisputeIcon, 
  MailIcon,
  ReliefFinderIcon, 
  SpecialtyBureauIcon, 
  CreditBuildingIcon 
} from './components/FeatureIcons';
import TrustBadges from './components/TrustBadges';

export default function Home() {
  return (
    <>

      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <div className="hero-eyebrow">Un Fuck My Life - Credit Repair Platform</div>
          <h1>UFML - Transform Your Credit</h1>
          <p>
            The comprehensive platform to un-fuck your credit and achieve financial freedom. 
            Whether you're dealing with collections, charge-offs, or low scores, we provide 
            the tools and expertise to fix your credit and reclaim your financial life.
          </p>
          <div className="hero-cta">
            <a href="/trial" className="btn btn-primary btn-lg">
              Start Free Trial
            </a>
            <a href="/demo" className="link hero-demo-link">
              Watch Demo →
            </a>
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="trust-section">
        <div className="container">
          <div className="trust-stats">
            <div className="trust-stat">
              <div className="trust-stat-number">500+</div>
              <div className="trust-stat-label">Agencies</div>
            </div>
            <div className="trust-stat">
              <div className="trust-stat-number">50,000+</div>
              <div className="trust-stat-label">Consumers Helped</div>
            </div>
            <div className="trust-stat">
              <div className="trust-stat-number">2M+</div>
              <div className="trust-stat-label">Disputes Processed</div>
            </div>
            <div className="trust-stat">
              <div className="trust-stat-number">98%</div>
              <div className="trust-stat-label">Success Rate</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="features">
        <div className="container">
          <div className="text-center mb-12">
            <h2>Everything You Need to Scale Your Credit Repair Business</h2>
            <p>Powerful tools designed for credit repair professionals and agencies</p>
          </div>
          
          <div className="features-grid">
            <div className="card">
              <div className="feature-icon">
                <CreditReportIcon animate={true} />
              </div>
              <h3>Credit Report Analysis</h3>
              <p>Upload and automatically analyze credit reports from all three bureaus. Our AI identifies disputable items and suggests optimal strategies.</p>
              <a href="/reports" className="link">Learn more →</a>
            </div>
            
            <div className="card">
              <div className="feature-icon">
                <DisputeIcon animate={true} />
              </div>
              <h3>Automated Disputes</h3>
              <p>Generate professional dispute letters with customizable templates. Track progress and manage follow-ups automatically.</p>
              <a href="/disputes" className="link">Learn more →</a>
            </div>
            
            <div className="card">
              <div className="feature-icon">
                <MailIcon animate={true} />
              </div>
              <h3>Direct Mail Integration</h3>
              <p>Send certified mail directly through our platform. Integration with major mail services for seamless delivery tracking.</p>
              <a href="/mail" className="link">Learn more →</a>
            </div>
            
            <div className="card">
              <div className="feature-icon">
                <ReliefFinderIcon animate={true} />
              </div>
              <h3>Relief Finder</h3>
              <p>Discover government and private relief programs your clients qualify for. Automated matching based on their financial profile.</p>
              <a href="/relief" className="link">Learn more →</a>
            </div>
            
            <div className="card">
              <div className="feature-icon">
                <SpecialtyBureauIcon animate={true} />
              </div>
              <h3>Specialty Bureau Management</h3>
              <p>Handle ChexSystems, LexisNexis, and other specialty bureaus. Freeze accounts and manage disputes beyond the big three.</p>
              <a href="/specialty" className="link">Learn more →</a>
            </div>
            
            <div className="card">
              <div className="feature-icon">
                <CreditBuildingIcon animate={true} />
              </div>
              <h3>Credit Building Tools</h3>
              <p>Score simulators, goodwill letter templates, and strategic advice tools to help clients build positive credit history.</p>
              <a href="/credit-building" className="link">Learn more →</a>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials">
        <div className="container">
          <div className="text-center mb-12">
            <h2>What Our Customers Say</h2>
            <p style={{ color: 'var(--gray-700)', fontSize: '1.1rem', fontWeight: '500' }}>Join thousands of satisfied agencies who have transformed their credit repair business</p>
          </div>
          
          <div className="testimonials-grid">
            <div className="testimonial-card">
              <div className="testimonial-quote">
                "Credit Hardar has revolutionized our agency. We've increased our dispute success rate by 40% and cut processing time in half."
              </div>
              <div className="testimonial-author">Sarah Martinez</div>
              <div className="testimonial-role">CEO, Premier Credit Solutions</div>
            </div>
            
            <div className="testimonial-card">
              <div className="testimonial-quote">
                "The ReliefFinder feature is a game-changer. We've helped clients access over $500K in financial assistance programs."
              </div>
              <div className="testimonial-author">Michael Chen</div>
              <div className="testimonial-role">Founder, Credit Recovery Pro</div>
            </div>
            
            <div className="testimonial-card">
              <div className="testimonial-quote">
                "The AI-powered dispute generation saves us hours every day. Our team can focus on client relationships instead of paperwork."
              </div>
              <div className="testimonial-author">Jennifer Thompson</div>
              <div className="testimonial-role">Operations Director, Elite Credit Services</div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Badges Section */}
      <TrustBadges />

      {/* Final CTA Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2 className="cta-title">
              Ready to Transform Your Credit Repair Business?
            </h2>
            <p className="cta-description">
              Join hundreds of agencies already using Credit Hardar to streamline operations, 
              increase success rates, and grow their business.
            </p>
            <div className="cta-buttons">
              <a href="/trial" className="btn btn-primary btn-lg">
                Start Free Trial
              </a>
              <a href="/demo" className="btn btn-secondary btn-lg cta-secondary-btn">
                Watch Demo
              </a>
            </div>
            <p className="cta-note">
              No credit card required • 14-day free trial • Cancel anytime
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="text-center">
            <div className="footer-brand">
              <img src="/logo.png" alt="Credit Hardar" className="footer-logo" />
              <span className="footer-brand-text">Credit Hardar</span>
            </div>
            <p className="footer-description">
              Professional credit repair platform built for agencies and consumers.
            </p>
          </div>
        </div>
      </footer>

    </>
  );
}
