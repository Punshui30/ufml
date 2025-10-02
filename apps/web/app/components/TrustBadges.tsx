'use client';

import { Shield, Award, CheckCircle, Star, Lock, Users, Clock, Globe } from 'lucide-react';

interface BadgeProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  verified?: boolean;
  href?: string;
}

const Badge = ({ icon, title, description, verified = false, href }: BadgeProps) => {
  const content = (
    <div className="flex items-center space-x-3 p-4 bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow duration-200">
      <div className="flex-shrink-0">
        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
          {icon}
        </div>
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center space-x-2">
          <p className="text-sm font-medium text-gray-900">{title}</p>
          {verified && (
            <CheckCircle className="w-4 h-4 text-green-500" />
          )}
        </div>
        <p className="text-xs text-gray-500 mt-1">{description}</p>
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

export default function TrustBadges() {
  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 py-16">
      <div className="container max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Trusted & Certified
          </h2>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto">
            Credit Hardar is committed to the highest standards of security, compliance, and service excellence.
          </p>
        </div>

        {/* Main Badges Grid - 4 columns on large screens */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {/* Security Badges */}
          <div className="bg-white rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow border border-gray-100">
            <div className="text-center">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Shield className="w-5 h-5 text-blue-600" />
              </div>
              <h3 className="text-sm font-semibold text-gray-900 mb-1">SSL Secured</h3>
              <p className="text-xs text-gray-600 mb-2">256-bit encryption protects your data</p>
              <div className="flex items-center justify-center">
                <CheckCircle className="w-3 h-3 text-green-500 mr-1" />
                <span className="text-xs text-green-600 font-medium">Verified</span>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow border border-gray-100">
            <div className="text-center">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Lock className="w-5 h-5 text-green-600" />
              </div>
              <h3 className="text-sm font-semibold text-gray-900 mb-1">PCI DSS Compliant</h3>
              <p className="text-xs text-gray-600 mb-2">Payment security standards met</p>
              <div className="flex items-center justify-center">
                <CheckCircle className="w-3 h-3 text-green-500 mr-1" />
                <span className="text-xs text-green-600 font-medium">Verified</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow border border-gray-100">
            <div className="text-center">
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Award className="w-5 h-5 text-purple-600" />
              </div>
              <h3 className="text-sm font-semibold text-gray-900 mb-1">FCRA Compliant</h3>
              <p className="text-xs text-gray-600 mb-2">Fair Credit Reporting Act compliant</p>
              <div className="flex items-center justify-center">
                <CheckCircle className="w-3 h-3 text-green-500 mr-1" />
                <span className="text-xs text-green-600 font-medium">Verified</span>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow border border-gray-100">
            <div className="text-center">
              <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Users className="w-5 h-5 text-orange-600" />
              </div>
              <h3 className="text-sm font-semibold text-gray-900 mb-1">Industry Certified</h3>
              <p className="text-xs text-gray-600 mb-2">Credit repair industry standards</p>
              <div className="flex items-center justify-center">
                <CheckCircle className="w-3 h-3 text-green-500 mr-1" />
                <span className="text-xs text-green-600 font-medium">Verified</span>
              </div>
            </div>
          </div>
        </div>

        {/* Secondary Badges Row - 4 columns */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow border border-gray-100">
            <div className="text-center">
              <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Star className="w-5 h-5 text-yellow-500" />
              </div>
              <h3 className="text-sm font-semibold text-gray-900 mb-1">5-Star Rated</h3>
              <p className="text-xs text-gray-600 mb-2">Based on customer reviews</p>
              <div className="flex items-center justify-center">
                <CheckCircle className="w-3 h-3 text-green-500 mr-1" />
                <span className="text-xs text-green-600 font-medium">Verified</span>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow border border-gray-100">
            <div className="text-center">
              <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Clock className="w-5 h-5 text-indigo-600" />
              </div>
              <h3 className="text-sm font-semibold text-gray-900 mb-1">24/7 Support</h3>
              <p className="text-xs text-gray-600 mb-2">Round-the-clock customer service</p>
              <div className="flex items-center justify-center">
                <CheckCircle className="w-3 h-3 text-green-500 mr-1" />
                <span className="text-xs text-green-600 font-medium">Verified</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow border border-gray-100">
            <div className="text-center">
              <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Globe className="w-5 h-5 text-teal-600" />
              </div>
              <h3 className="text-sm font-semibold text-gray-900 mb-1">WCAG 2.1 AA</h3>
              <p className="text-xs text-gray-600 mb-2">Accessibility compliant</p>
              <div className="flex items-center justify-center">
                <CheckCircle className="w-3 h-3 text-green-500 mr-1" />
                <span className="text-xs text-green-600 font-medium">Verified</span>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow border border-gray-100">
            <div className="text-center">
              <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <CheckCircle className="w-5 h-5 text-emerald-600" />
              </div>
              <h3 className="text-sm font-semibold text-gray-900 mb-1">GDPR Compliant</h3>
              <p className="text-xs text-gray-600 mb-2">Data privacy protection</p>
              <div className="flex items-center justify-center">
                <CheckCircle className="w-3 h-3 text-green-500 mr-1" />
                <span className="text-xs text-green-600 font-medium">Verified</span>
              </div>
            </div>
          </div>
        </div>

        {/* Trust Indicators Bar */}
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
          <div className="flex flex-wrap items-center justify-center gap-8 text-sm">
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <span className="font-semibold text-gray-900">100% Secure</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
              <span className="font-semibold text-gray-900">Privacy Protected</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-purple-500 rounded-full animate-pulse"></div>
              <span className="font-semibold text-gray-900">Industry Certified</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-orange-500 rounded-full animate-pulse"></div>
              <span className="font-semibold text-gray-900">Compliance Verified</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
