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
          <div className="hero-eyebrow">Un-Fuck My Life — Credit Intelligence</div>
          <h1>Rebuild your credit story with deliberate precision.</h1>
          <p>
            UFML orchestrates every step of the credit repair journey with forensic-level insight,
            AI-enhanced dispute strategy, and relentless follow through. We turn chaos into
            a roadmap so you can reclaim the power that debt stripped away.
          </p>
          <div className="hero-cta">
            <a href="/trial" className="btn btn-primary btn-lg">
              Enter the Command Center
            </a>
            <a href="/demo" className="btn btn-secondary btn-lg">
              Watch the Briefing
            </a>
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="trust-section">
        <div className="container">
          <div className="trust-stats">
            <div className="trust-stat">
              <div className="trust-stat-number">18 yrs</div>
              <div className="trust-stat-label">combined bureau experience</div>
            </div>
            <div className="trust-stat">
              <div className="trust-stat-number">92%</div>
              <div className="trust-stat-label">average dispute resolution</div>
            </div>
            <div className="trust-stat">
              <div className="trust-stat-number">48 hrs</div>
              <div className="trust-stat-label">to first actionable plan</div>
            </div>
            <div className="trust-stat">
              <div className="trust-stat-number">0 fluff</div>
              <div className="trust-stat-label">just ruthless execution</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="features">
        <div className="container">
          <div className="text-center mb-12">
            <h2>Elite tooling for unapologetic credit repair.</h2>
            <p>No gimmicks. Only the infrastructure you need to dismantle inaccurate debt.</p>
          </div>

          <div className="features-grid">
            <div className="card">
              <div className="feature-icon">
                <CreditReportIcon animate={true} />
              </div>
              <h3>Credit Report Recon</h3>
              <p>Upload raw bureau data and receive a forensic breakdown of every line item, duplicate tradeline, and compliance violation.</p>
              <a href="/reports" className="link">Deploy the scanner →</a>
            </div>

            <div className="card">
              <div className="feature-icon">
                <DisputeIcon animate={true} />
              </div>
              <h3>Precision Disputes</h3>
              <p>Generate layered dispute packages, escalate to specialty bureaus, and log responses in a single chain of custody.</p>
              <a href="/disputes" className="link">Draft your angles →</a>
            </div>

            <div className="card">
              <div className="feature-icon">
                <MailIcon animate={true} />
              </div>
              <h3>Verified Mailstream</h3>
              <p>Coordinate certified deliveries, capture proof automatically, and audit every outbound touch with timestamped evidence.</p>
              <a href="/mail" className="link">See the workflow →</a>
            </div>

            <div className="card">
              <div className="feature-icon">
                <ReliefFinderIcon animate={true} />
              </div>
              <h3>Relief Intelligence</h3>
              <p>Match clients with hardship, relief, and goodwill programs aligned to their credit file without leaving the console.</p>
              <a href="/relief" className="link">Surface opportunities →</a>
            </div>

            <div className="card">
              <div className="feature-icon">
                <SpecialtyBureauIcon animate={true} />
              </div>
              <h3>Shadow Bureau Control</h3>
              <p>Lock down LexisNexis, ChexSystems, Innovis, and the bureaus in the shadows. Automate freezes, removals, and escalations.</p>
              <a href="/specialty" className="link">Go off-grid →</a>
            </div>

            <div className="card">
              <div className="feature-icon">
                <CreditBuildingIcon animate={true} />
              </div>
              <h3>Credit Rebuild Arsenal</h3>
              <p>Deploy custom score simulations, goodwill requests, and rebuild sequences tuned to the realities of your client.</p>
              <a href="/credit-building" className="link">Arm your clients →</a>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials">
        <div className="container">
          <div className="text-center mb-12">
            <h2>Operators who refuse to settle.</h2>
            <p className="testimonials-subtitle">Real teams turning messy credit files into comeback stories.</p>
          </div>

          <div className="testimonials-grid">
            <div className="testimonial-card">
              <div className="testimonial-quote">
                "UFML gave us a real command center. We trimmed dispute prep from days to hours and our approvals speak for themselves."
              </div>
              <div className="testimonial-author">Sarah Martinez</div>
              <div className="testimonial-role">CEO, Premier Credit Solutions</div>
            </div>

            <div className="testimonial-card">
              <div className="testimonial-quote">
                "Relief Intelligence surfaced programs my team never knew existed. Clients notice when you move this fast."
              </div>
              <div className="testimonial-author">Michael Chen</div>
              <div className="testimonial-role">Founder, Credit Recovery Pro</div>
            </div>

            <div className="testimonial-card">
              <div className="testimonial-quote">
                "Their AI audit tears reports apart and hands us the violations. All we do now is execute." 
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
              Nothing changes until you demand it.
            </h2>
            <p className="cta-description">
              Step into the UFML war room and rebuild credit with ruthless clarity, bulletproof documentation, and a team that actually fights back.
            </p>
            <div className="cta-buttons">
              <a href="/trial" className="btn btn-primary btn-lg">
                Start the 14-day black ops
              </a>
              <a href="/demo" className="btn btn-secondary btn-lg cta-secondary-btn">
                Request a guided debrief
              </a>
            </div>
            <p className="cta-note">
              No credit card required • No empty promises • Just results
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="text-center">
            <div className="footer-brand">
              <img src="/ufml-logo.svg" alt="UFML" className="footer-logo" />
              <span className="footer-brand-text">UFML — Un-Fuck My Life</span>
            </div>
            <p className="footer-description">
              Credit reconstruction for people who refuse to stay buried.
            </p>
          </div>
        </div>
      </footer>

    </>
  );
}
