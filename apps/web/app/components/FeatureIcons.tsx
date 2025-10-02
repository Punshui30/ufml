'use client';

import { 
  FileText, 
  Shield, 
  Mail, 
  Search, 
  Building2, 
  TrendingUp,
  Users,
  BarChart3,
  Zap,
  CheckCircle
} from 'lucide-react';

interface IconProps {
  className?: string;
  animate?: boolean;
}

export function CreditReportIcon({ className = "", animate = false }: IconProps) {
  return (
    <FileText 
      className={`${className} ${animate ? 'icon-animate' : ''}`}
      size={64}
      strokeWidth={2.5}
    />
  );
}

export function DisputeIcon({ className = "", animate = false }: IconProps) {
  return (
    <Shield 
      className={`${className} ${animate ? 'icon-animate' : ''}`}
      size={64}
      strokeWidth={2.5}
    />
  );
}

export function MailIcon({ className = "", animate = false }: IconProps) {
  return (
    <Mail 
      className={`${className} ${animate ? 'icon-animate' : ''}`}
      size={64}
      strokeWidth={2.5}
    />
  );
}

export function ReliefFinderIcon({ className = "", animate = false }: IconProps) {
  return (
    <Search 
      className={`${className} ${animate ? 'icon-animate' : ''}`}
      size={64}
      strokeWidth={2.5}
    />
  );
}

export function SpecialtyBureauIcon({ className = "", animate = false }: IconProps) {
  return (
    <Building2 
      className={`${className} ${animate ? 'icon-animate' : ''}`}
      size={64}
      strokeWidth={2.5}
    />
  );
}

export function CreditBuildingIcon({ className = "", animate = false }: IconProps) {
  return (
    <TrendingUp 
      className={`${className} ${animate ? 'icon-animate' : ''}`}
      size={64}
      strokeWidth={2.5}
    />
  );
}

// Additional professional icons for enhanced design
export function UsersIcon({ className = "", animate = false }: IconProps) {
  return (
    <Users 
      className={`${className} ${animate ? 'icon-animate' : ''}`}
      size={64}
      strokeWidth={2.5}
    />
  );
}

export function AnalyticsIcon({ className = "", animate = false }: IconProps) {
  return (
    <BarChart3 
      className={`${className} ${animate ? 'icon-animate' : ''}`}
      size={64}
      strokeWidth={2.5}
    />
  );
}

export function AutomationIcon({ className = "", animate = false }: IconProps) {
  return (
    <Zap 
      className={`${className} ${animate ? 'icon-animate' : ''}`}
      size={64}
      strokeWidth={2.5}
    />
  );
}

export function SuccessIcon({ className = "", animate = false }: IconProps) {
  return (
    <CheckCircle 
      className={`${className} ${animate ? 'icon-animate' : ''}`}
      size={64}
      strokeWidth={2.5}
    />
  );
}