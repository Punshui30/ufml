'use client';

import { useState } from 'react';

interface PricingHeroProps {
  launchPromoActive: boolean;
  launchDiscountPercent: number;
  selectedTab: 'software' | 'services';
  onTabChange: (tab: 'software' | 'services') => void;
}

export default function PricingHero({ 
  launchPromoActive, 
  launchDiscountPercent, 
  selectedTab, 
  onTabChange 
}: PricingHeroProps) {
  return (
    <section 
      className="pricing-hero"
      style={{
        background: 'linear-gradient(160deg, var(--brand), var(--brand-grad-bot))',
        padding: 'var(--s-16) 0',
        color: 'white',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      <div 
        className="container"
        style={{
          maxWidth: '1280px',
          margin: '0 auto',
          textAlign: 'center',
          position: 'relative',
          zIndex: 2
        }}
      >
        {/* Eyebrow */}
        <div 
          className="hero-eyebrow"
          style={{
            fontSize: '14px',
            fontWeight: '600',
            letterSpacing: '0.5px',
            textTransform: 'uppercase',
            opacity: 0.9,
            marginBottom: 'var(--s-4)'
          }}
        >
          Pricing Plans
        </div>

        {/* Main Title */}
        <h1 
          className="hero-title"
          style={{
            fontSize: '64px',
            fontWeight: '800',
            lineHeight: '1.1',
            letterSpacing: '-0.5%',
            marginBottom: 'var(--s-6)',
            maxWidth: '72ch',
            margin: '0 auto var(--s-6)'
          }}
        >
          Transparent Pricing
        </h1>

        {/* Subtitle */}
        <p 
          className="hero-subtitle"
          style={{
            fontSize: '18px',
            lineHeight: '1.6',
            opacity: 0.9,
            maxWidth: '600px',
            margin: '0 auto var(--s-8)'
          }}
        >
          Choose the plan that fits your needs. Launch pricing with {launchDiscountPercent}% off for a limited time!
        </p>

        {/* Glass Promo Card */}
        {launchPromoActive && (
          <div 
            className="glass-promo-card"
            style={{
              background: 'rgba(255, 255, 255, 0.06)',
              backdropFilter: 'blur(8px)',
              border: '1px solid rgba(255, 255, 255, 0.18)',
              borderRadius: 'var(--r-lg)',
              padding: 'var(--s-4) var(--s-6)',
              display: 'inline-block',
              marginBottom: 'var(--s-8)',
              boxShadow: 'var(--shadow-2)'
            }}
          >
            <div 
              style={{
                fontSize: '24px',
                fontWeight: '700',
                marginBottom: 'var(--s-2)',
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--s-3)'
              }}
            >
              <span 
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: 'linear-gradient(45deg, #ff6b6b, #ffd93d)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '16px'
                }}
              >
                ✨
              </span>
              LAUNCH SPECIAL: {launchDiscountPercent}% OFF
            </div>
            <div 
              style={{
                fontSize: '16px',
                opacity: 0.9
              }}
            >
              Valid until December 31, 2024 • Use code: LAUNCH50
            </div>
          </div>
        )}

        {/* Audience Toggle */}
        <div 
          className="audience-toggle"
          style={{
            display: 'flex',
            justifyContent: 'center',
            marginBottom: 'var(--s-8)'
          }}
        >
          <div 
            className="segmented-control"
            style={{
              display: 'flex',
              background: 'rgba(255, 255, 255, 0.1)',
              borderRadius: 'var(--r-sm)',
              padding: '8px',
              gap: '4px'
            }}
          >
            <button
              onClick={() => onTabChange('software')}
              className={`toggle-option ${selectedTab === 'software' ? 'active' : ''}`}
              style={{
                padding: '12px 24px',
                borderRadius: 'var(--r-xs)',
                border: 'none',
                background: selectedTab === 'software' ? 'white' : 'transparent',
                color: selectedTab === 'software' ? 'var(--brand)' : 'white',
                fontWeight: '600',
                fontSize: '16px',
                cursor: 'pointer',
                transition: 'all 180ms ease',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              For Agencies
            </button>
            <button
              onClick={() => onTabChange('services')}
              className={`toggle-option ${selectedTab === 'services' ? 'active' : ''}`}
              style={{
                padding: '12px 24px',
                borderRadius: 'var(--r-xs)',
                border: 'none',
                background: selectedTab === 'services' ? 'white' : 'transparent',
                color: selectedTab === 'services' ? 'var(--brand)' : 'white',
                fontWeight: '600',
                fontSize: '16px',
                cursor: 'pointer',
                transition: 'all 180ms ease',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              For Consumers
            </button>
          </div>
        </div>

        {/* CTAs */}
        <div 
          className="hero-ctas"
          style={{
            display: 'flex',
            gap: 'var(--s-4)',
            justifyContent: 'center',
            flexWrap: 'wrap'
          }}
        >
          <button 
            className="btn btn-primary hero-cta"
            style={{
              background: 'white',
              color: 'var(--brand)',
              padding: '16px 32px',
              fontSize: '18px',
              fontWeight: '600',
              borderRadius: 'var(--r-md)',
              border: 'none',
              cursor: 'pointer',
              boxShadow: 'var(--shadow-1)',
              transition: 'all 120ms ease'
            }}
          >
            Start Free Trial
          </button>
          <button 
            className="btn btn-secondary hero-demo-link"
            style={{
              background: 'transparent',
              color: 'white',
              padding: '16px 32px',
              fontSize: '18px',
              fontWeight: '600',
              borderRadius: 'var(--r-md)',
              border: '2px solid rgba(255, 255, 255, 0.3)',
              cursor: 'pointer',
              transition: 'all 120ms ease'
            }}
          >
            Watch Demo
          </button>
        </div>
      </div>
    </section>
  );
}
