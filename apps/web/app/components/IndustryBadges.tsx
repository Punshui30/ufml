'use client';

import { Award, Shield, CheckCircle, Star, Users, Lock, Globe, FileText } from 'lucide-react';

interface IndustryBadgeProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  verified?: boolean;
  href?: string;
  color?: string;
}

const IndustryBadge = ({ icon, title, description, verified = false, href, color = 'blue' }: IndustryBadgeProps) => {
  const colorClasses = {
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    purple: 'bg-purple-100 text-purple-600',
    orange: 'bg-orange-100 text-orange-600',
    indigo: 'bg-indigo-100 text-indigo-600',
    teal: 'bg-teal-100 text-teal-600',
    emerald: 'bg-emerald-100 text-emerald-600',
    yellow: 'bg-yellow-100 text-yellow-600'
  };

  const content = (
    <div className="flex items-center space-x-3 p-4 bg-white rounded-lg border border-gray-200 hover:shadow-lg transition-all duration-200 group">
      <div className="flex-shrink-0">
        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${colorClasses[color as keyof typeof colorClasses]}`}>
          {icon}
        </div>
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center space-x-2">
          <p className="text-sm font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
            {title}
          </p>
          {verified && (
            <CheckCircle className="w-4 h-4 text-green-500" />
          )}
        </div>
        <p className="text-xs text-gray-600 mt-1">{description}</p>
      </div>
    </div>
  );

  if (href) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className="block">
        {content}
      </a>
    );
  }

  return content;
};

export default function IndustryBadges() {
  return (
    <div className="bg-white py-16">
      <div className="container max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Industry Recognized & Certified
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Credit Hardar meets the highest standards of the credit repair industry, 
            with certifications and compliance that ensure your data security and our service excellence.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {/* Security & Compliance */}
          <IndustryBadge
            icon={<Shield className="w-6 h-6" />}
            title="FCRA Compliant"
            description="Fair Credit Reporting Act compliant operations"
            verified={true}
            color="blue"
          />
          
          <IndustryBadge
            icon={<Lock className="w-6 h-6" />}
            title="SOC 2 Type II"
            description="Security and availability controls certified"
            verified={true}
            color="green"
          />
          
          <IndustryBadge
            icon={<FileText className="w-6 h-6" />}
            title="GDPR Compliant"
            description="EU data protection standards met"
            verified={true}
            color="purple"
          />

          {/* Industry Certifications */}
          <IndustryBadge
            icon={<Award className="w-6 h-6" />}
            title="NACSO Member"
            description="National Association of Credit Services Organizations"
            verified={true}
            color="orange"
            href="https://www.nacso.org"
          />
          
          <IndustryBadge
            icon={<Users className="w-6 h-6" />}
            title="CCAI Certified"
            description="Credit Consultants Association International"
            verified={true}
            color="indigo"
            href="https://www.ccai.org"
          />
          
          <IndustryBadge
            icon={<Star className="w-6 h-6" />}
            title="BBB A+ Rating"
            description="Better Business Bureau accredited"
            verified={true}
            color="yellow"
            href="https://www.bbb.org"
          />

          {/* Technology Standards */}
          <IndustryBadge
            icon={<Globe className="w-6 h-6" />}
            title="WCAG 2.1 AA"
            description="Web accessibility standards compliant"
            verified={true}
            color="teal"
          />
          
          <IndustryBadge
            icon={<CheckCircle className="w-6 h-6" />}
            title="ISO 27001"
            description="Information security management certified"
            verified={true}
            color="emerald"
          />
        </div>

        {/* Trust Indicators */}
        <div className="mt-12 text-center">
          <div className="inline-flex flex-wrap items-center justify-center gap-8 text-sm text-gray-600">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <span className="font-medium">100% Secure</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
              <span className="font-medium">Privacy Protected</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-purple-500 rounded-full animate-pulse"></div>
              <span className="font-medium">Industry Certified</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-orange-500 rounded-full animate-pulse"></div>
              <span className="font-medium">Compliance Verified</span>
            </div>
          </div>
        </div>

        {/* Legal Disclaimer */}
        <div className="mt-8 text-center">
          <p className="text-xs text-gray-500 max-w-4xl mx-auto">
            * Certifications and memberships are subject to ongoing compliance requirements. 
            Credit Hardar is committed to maintaining the highest standards of service and security. 
            Individual results may vary. Credit repair services are not guaranteed.
          </p>
        </div>
      </div>
    </div>
  );
}



