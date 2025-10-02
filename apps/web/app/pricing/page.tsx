'use client';

import { useState } from 'react';

interface PricingPlan {
  id: string;
  name: string;
  price: number;
  people_per_month: string | number;
  features: string[];
  recommended?: boolean;
  category: 'individual' | 'business' | 'enterprise';
}

export default function PricingPage() {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  const pricingPlans: PricingPlan[] = [
    // Individual Plans
    {
      id: 'iron',
      name: 'IRON PACKAGE',
      price: 97,
      people_per_month: 1,
      category: 'individual',
      features: [
        'Generate Unlimited Metro2 Letters Per Attack',
        'Artificial Intelligence Generated Letters',
        'Free Live Weekly Software Training',
        'Free Support Community Access',
        'Printing & Mailing Services Available',
        '1:1 Training Support Available',
        'Add Unlimited Clients',
        'Client Portal Available'
      ]
    },
    {
      id: 'bronze',
      name: 'BRONZE PACKAGE',
      price: 147,
      people_per_month: '1-4',
      category: 'individual',
      features: [
        'Generate Unlimited Metro2 Letters Per Attack',
        'Artificial Intelligence Generated Letters',
        'Free Live Weekly Software Training',
        'Free Support Community Access',
        'Printing & Mailing Services Available',
        '1:1 Training Support Available',
        'Add Unlimited Clients',
        'Client Portal Available'
      ]
    },
    // Business Plans
    {
      id: 'silver',
      name: 'SILVER PACKAGE',
      price: 197,
      people_per_month: 8,
      category: 'business',
      recommended: true,
      features: [
        'Generate Unlimited Metro2 Letters Per Attack',
        'Artificial Intelligence Generated Letters',
        'Free Live Weekly Software Training',
        'Free Support Community Access',
        'Printing & Mailing Services Available',
        '1:1 Training Support Available',
        'Add Unlimited Clients',
        'Client Portal Available'
      ]
    },
    {
      id: 'gold',
      name: 'GOLD PACKAGE',
      price: 297,
      people_per_month: 17,
      category: 'business',
      features: [
        'Generate Unlimited Metro2 Letters Per Attack',
        'Artificial Intelligence Generated Letters',
        'Free Live Weekly Software Training',
        'Free Support Community Access',
        'Printing & Mailing Services Available',
        '1:1 Training Support Available',
        'Add Unlimited Clients',
        'Client Portal Available'
      ]
    },
    // Enterprise Plans
    {
      id: 'platinum',
      name: 'PLATINUM PACKAGE',
      price: 397,
      people_per_month: 30,
      category: 'enterprise',
      features: [
        'Generate Unlimited Metro2 Letters Per Attack',
        'Artificial Intelligence Generated Letters',
        'Free Live Weekly Software Training',
        'Free Support Community Access',
        'Printing & Mailing Services Available',
        '1:1 Training Support Available',
        'Add Unlimited Clients',
        'Client Portal Available'
      ]
    },
    {
      id: 'diamond',
      name: 'DIAMOND PACKAGE',
      price: 997,
      people_per_month: 100,
      category: 'enterprise',
      features: [
        'Generate Unlimited Metro2 Letters Per Attack',
        'Artificial Intelligence Generated Letters',
        'Free Live Weekly Software Training',
        'Free Support Community Access',
        'Printing & Mailing Services Available',
        '1:1 Training Support Available',
        'Add Unlimited Clients',
        'Client Portal Available'
      ]
    }
  ];

  const individualPlans = pricingPlans.filter(plan => plan.category === 'individual');
  const businessPlans = pricingPlans.filter(plan => plan.category === 'business');
  const enterprisePlans = pricingPlans.filter(plan => plan.category === 'enterprise');

  const handleBuyNow = (planId: string) => {
    setSelectedPlan(planId);
    // Here you would typically redirect to checkout or payment processing
    alert(`Redirecting to checkout for ${pricingPlans.find(p => p.id === planId)?.name}...`);
  };

  const renderPlanCard = (plan: PricingPlan) => (
    <div 
      key={plan.id}
      className="pricing-card"
      style={{
        background: plan.recommended ? 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)' : '#f8fafc',
        border: plan.recommended ? '2px solid #ef4444' : '1px solid #e2e8f0',
        borderRadius: '12px',
        padding: '2rem',
        textAlign: 'center',
        position: 'relative',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'all 0.3s ease',
        cursor: 'pointer'
      }}
      onMouseOver={(e) => {
        if (!plan.recommended) {
          e.currentTarget.style.transform = 'translateY(-5px)';
          e.currentTarget.style.boxShadow = '0 10px 25px rgba(0,0,0,0.1)';
        }
      }}
      onMouseOut={(e) => {
        if (!plan.recommended) {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = 'none';
        }
      }}
    >
      {plan.recommended && (
        <div style={{
          position: 'absolute',
          top: '-10px',
          left: '50%',
          transform: 'translateX(-50%)',
          background: '#ef4444',
          color: 'white',
          padding: '0.5rem 1rem',
          borderRadius: '20px',
          fontSize: '0.875rem',
          fontWeight: '600'
        }}>
          MOST RECOMMENDED
        </div>
      )}
      
      {/* Calendar/Tag Visual */}
      <div style={{
        background: plan.recommended ? 'rgba(255,255,255,0.2)' : '#e2e8f0',
        borderRadius: '8px',
        padding: '1rem',
        marginBottom: '1.5rem',
        position: 'relative',
        height: '60px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{
          position: 'absolute',
          left: '10px',
          top: '10px',
          width: '8px',
          height: '8px',
          background: plan.recommended ? 'white' : '#64748b',
          borderRadius: '50%'
        }}></div>
        <div style={{
          position: 'absolute',
          right: '10px',
          top: '10px',
          width: '8px',
          height: '8px',
          background: plan.recommended ? 'white' : '#64748b',
          borderRadius: '50%'
        }}></div>
        <div style={{
          fontSize: '1.5rem',
          fontWeight: 'bold',
          color: plan.recommended ? 'white' : '#1e293b'
        }}>
          {plan.name.split(' ')[0]}
        </div>
      </div>

      <h3 style={{
        fontSize: '1.5rem',
        fontWeight: 'bold',
        marginBottom: '1rem',
        color: plan.recommended ? 'white' : '#1e293b'
      }}>
        {plan.name}
      </h3>

      <div style={{
        fontSize: '2.5rem',
        fontWeight: 'bold',
        color: plan.recommended ? 'white' : '#1e293b',
        marginBottom: '0.5rem'
      }}>
        ${plan.price}
      </div>

      <div style={{
        fontSize: '1rem',
        color: plan.recommended ? 'rgba(255,255,255,0.8)' : '#64748b',
        marginBottom: '2rem'
      }}>
        {typeof plan.people_per_month === 'number' 
          ? `${plan.people_per_month} people / month`
          : `${plan.people_per_month} people / month`
        }
      </div>

      <ul style={{
        listStyle: 'none',
        padding: 0,
        margin: 0,
        flex: 1,
        textAlign: 'left'
      }}>
        {plan.features.map((feature, index) => (
          <li key={index} style={{
            padding: '0.5rem 0',
            fontSize: '0.875rem',
            color: plan.recommended ? 'rgba(255,255,255,0.9)' : '#475569',
            display: 'flex',
            alignItems: 'center'
          }}>
            <span style={{
              marginRight: '0.5rem',
              color: plan.recommended ? 'white' : '#10b981'
            }}>✓</span>
            {feature}
          </li>
        ))}
      </ul>

      <button
        onClick={() => handleBuyNow(plan.id)}
        style={{
          background: plan.recommended ? 'white' : '#ef4444',
          color: plan.recommended ? '#ef4444' : 'white',
          border: 'none',
          padding: '1rem 2rem',
          borderRadius: '8px',
          fontSize: '1rem',
          fontWeight: '600',
          cursor: 'pointer',
          width: '100%',
          marginTop: '2rem',
          transition: 'all 0.3s ease'
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.background = plan.recommended ? '#f3f4f6' : '#dc2626';
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.background = plan.recommended ? 'white' : '#ef4444';
        }}
      >
        BUY
      </button>
    </div>
  );

  return (
    <>
      {/* Hero Section */}
      <section style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        padding: '4rem 0',
        textAlign: 'center'
      }}>
        <div className="container">
          <h1 style={{
            fontSize: '3rem',
            fontWeight: 'bold',
            marginBottom: '1rem'
          }}>
            UFML Pricing Plans
          </h1>
          <p style={{
            fontSize: '1.25rem',
            opacity: 0.9,
            maxWidth: '600px',
            margin: '0 auto'
          }}>
            Choose the perfect plan for your credit repair business. All plans include AI-powered dispute generation and unlimited client management.
          </p>
        </div>
      </section>

      {/* Pricing Plans */}
      <section style={{ padding: '4rem 0', background: '#f8fafc' }}>
        <div className="container">
          {/* Individual Plans */}
          <div style={{ marginBottom: '4rem' }}>
            <h2 style={{
              fontSize: '2rem',
              fontWeight: 'bold',
              textAlign: 'center',
              marginBottom: '2rem',
              color: '#1e293b'
            }}>
              Individual Plans
            </h2>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '2rem',
              maxWidth: '800px',
              margin: '0 auto'
            }}>
              {individualPlans.map(renderPlanCard)}
            </div>
          </div>

          {/* Business Plans */}
          <div style={{ marginBottom: '4rem' }}>
            <h2 style={{
              fontSize: '2rem',
              fontWeight: 'bold',
              textAlign: 'center',
              marginBottom: '2rem',
              color: '#1e293b'
            }}>
              Business Plans
            </h2>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '2rem',
              maxWidth: '800px',
              margin: '0 auto'
            }}>
              {businessPlans.map(renderPlanCard)}
            </div>
          </div>

          {/* Enterprise Plans */}
          <div>
            <h2 style={{
              fontSize: '2rem',
              fontWeight: 'bold',
              textAlign: 'center',
              marginBottom: '2rem',
              color: '#1e293b'
            }}>
              Enterprise Plans
            </h2>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '2rem',
              maxWidth: '800px',
              margin: '0 auto'
            }}>
              {enterprisePlans.map(renderPlanCard)}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={{
        background: '#1e293b',
        color: 'white',
        padding: '3rem 0',
        textAlign: 'center'
      }}>
        <div className="container">
          <h2 style={{
            fontSize: '2rem',
            fontWeight: 'bold',
            marginBottom: '1rem'
          }}>
            Ready to Transform Your Credit Repair Business?
          </h2>
          <p style={{
            fontSize: '1.125rem',
            opacity: 0.9,
            marginBottom: '2rem',
            maxWidth: '600px',
            margin: '0 auto 2rem'
          }}>
            Join thousands of credit repair professionals who trust UFML to grow their business.
          </p>
          <a 
            href="/trial" 
            style={{
              background: '#ef4444',
              color: 'white',
              textDecoration: 'none',
              padding: '1rem 2rem',
              borderRadius: '8px',
              fontSize: '1.125rem',
              fontWeight: '600',
              display: 'inline-block',
              transition: 'all 0.3s ease'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = '#dc2626';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = '#ef4444';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            Start Free Trial
          </a>
        </div>
      </section>
    </>
  );
}