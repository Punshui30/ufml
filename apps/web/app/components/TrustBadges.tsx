'use client';

import { Shield, Award, Lock, Target } from 'lucide-react';

const badges = [
  {
    icon: <Shield className="trust-badge-icon" />,
    title: 'Military-grade encryption',
    description: 'Every artifact is encrypted at rest and in transit with full audit trails.',
  },
  {
    icon: <Lock className="trust-badge-icon" />,
    title: 'Compliance obsessed',
    description: 'FCRA, FDCPA, and CFPB-aligned workflows baked directly into the platform.',
  },
  {
    icon: <Award className="trust-badge-icon" />,
    title: 'Operator approved',
    description: 'Built alongside veteran credit repair agencies who live this fight every day.',
  },
  {
    icon: <Target className="trust-badge-icon" />,
    title: 'Laser focused outcomes',
    description: 'We track success metrics relentlessly so every dispute has purpose.',
  },
];

export default function TrustBadges() {
  return (
    <section className="trust-badges">
      <div className="container">
        <div className="trust-badges-header">
          <h2>Proven. Documented. Battle-tested.</h2>
          <p>
            You cannot afford guesswork. UFML stitches compliance, security, and ruthless execution into
            a single operating system you can trust.
          </p>
        </div>
        <div className="trust-badges-grid">
          {badges.map((badge) => (
            <div className="trust-badge" key={badge.title}>
              <div className="trust-badge-icon-wrap">{badge.icon}</div>
              <div>
                <h3>{badge.title}</h3>
                <p>{badge.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
