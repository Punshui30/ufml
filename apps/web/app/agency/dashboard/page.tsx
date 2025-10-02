'use client';

import { useState, useEffect } from 'react';
import { BarChart3, Users, FileText, Target, TrendingUp, DollarSign, Clock, CheckCircle } from 'lucide-react';

interface DashboardData {
  totalClients: number;
  activeDisputes: number;
  reportsProcessed: number;
  monthlyRevenue: number;
  recentActivity: Array<{
    id: string;
    type: string;
    description: string;
    timestamp: string;
    status: string;
  }>;
}

export default function AgencyDashboard() {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    const fetchDashboardData = async () => {
      try {
        // Mock data for now
        const mockData: DashboardData = {
          totalClients: 47,
          activeDisputes: 23,
          reportsProcessed: 156,
          monthlyRevenue: 12450,
          recentActivity: [
            {
              id: '1',
              type: 'dispute',
              description: 'New dispute created for John Smith',
              timestamp: '2 hours ago',
              status: 'pending'
            },
            {
              id: '2',
              type: 'report',
              description: 'Credit report processed for Sarah Johnson',
              timestamp: '4 hours ago',
              status: 'completed'
            },
            {
              id: '3',
              type: 'client',
              description: 'New client registered: Mike Wilson',
              timestamp: '6 hours ago',
              status: 'active'
            }
          ]
        };
        
        setDashboardData(mockData);
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ 
            width: '40px', 
            height: '40px', 
            border: '4px solid #e5e7eb', 
            borderTop: '4px solid #3b82f6', 
            borderRadius: '50%', 
            animation: 'spin 1s linear infinite',
            margin: '0 auto 1rem'
          }}></div>
          <p style={{ color: '#6b7280' }}>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
      padding: '2rem 1rem'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        
        {/* Header */}
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ 
            fontSize: '2.5rem', 
            fontWeight: 'bold', 
            color: '#1f2937',
            marginBottom: '0.5rem'
          }}>
            Agency Dashboard
          </h1>
          <p style={{ 
            fontSize: '1.125rem', 
            color: '#6b7280' 
          }}>
            Welcome back! Here's your business overview.
          </p>
        </div>

        {/* Stats Grid */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
          gap: '1.5rem',
          marginBottom: '2rem'
        }}>
          <div style={{
            background: 'white',
            borderRadius: '12px',
            padding: '1.5rem',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
            border: '1px solid #e5e7eb'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <p style={{ color: '#6b7280', fontSize: '0.875rem', marginBottom: '0.5rem' }}>Total Clients</p>
                <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1f2937' }}>
                  {dashboardData?.totalClients}
                </p>
              </div>
              <Users style={{ width: '2rem', height: '2rem', color: '#3b82f6' }} />
            </div>
          </div>

          <div style={{
            background: 'white',
            borderRadius: '12px',
            padding: '1.5rem',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
            border: '1px solid #e5e7eb'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <p style={{ color: '#6b7280', fontSize: '0.875rem', marginBottom: '0.5rem' }}>Active Disputes</p>
                <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1f2937' }}>
                  {dashboardData?.activeDisputes}
                </p>
              </div>
              <FileText style={{ width: '2rem', height: '2rem', color: '#ef4444' }} />
            </div>
          </div>

          <div style={{
            background: 'white',
            borderRadius: '12px',
            padding: '1.5rem',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
            border: '1px solid #e5e7eb'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <p style={{ color: '#6b7280', fontSize: '0.875rem', marginBottom: '0.5rem' }}>Reports Processed</p>
                <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1f2937' }}>
                  {dashboardData?.reportsProcessed}
                </p>
              </div>
              <BarChart3 style={{ width: '2rem', height: '2rem', color: '#10b981' }} />
            </div>
          </div>

          <div style={{
            background: 'white',
            borderRadius: '12px',
            padding: '1.5rem',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
            border: '1px solid #e5e7eb'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <p style={{ color: '#6b7280', fontSize: '0.875rem', marginBottom: '0.5rem' }}>Monthly Revenue</p>
                <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1f2937' }}>
                  ${dashboardData?.monthlyRevenue.toLocaleString()}
                </p>
              </div>
              <DollarSign style={{ width: '2rem', height: '2rem', color: '#f59e0b' }} />
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div style={{ 
          background: 'white',
          borderRadius: '12px',
          padding: '1.5rem',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
          border: '1px solid #e5e7eb',
          marginBottom: '2rem'
        }}>
          <h2 style={{ 
            fontSize: '1.5rem', 
            fontWeight: 'bold', 
            color: '#1f2937',
            marginBottom: '1rem'
          }}>
            Quick Actions
          </h2>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
            gap: '1rem'
          }}>
            <a href="/clients/new/" style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              padding: '1rem',
              background: '#f8fafc',
              borderRadius: '8px',
              textDecoration: 'none',
              color: '#374151',
              border: '1px solid #e5e7eb',
              transition: 'all 0.2s ease'
            }}>
              <Users style={{ width: '1.25rem', height: '1.25rem' }} />
              <span>Add New Client</span>
            </a>
            
            <a href="/reports/upload/" style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              padding: '1rem',
              background: '#f8fafc',
              borderRadius: '8px',
              textDecoration: 'none',
              color: '#374151',
              border: '1px solid #e5e7eb',
              transition: 'all 0.2s ease'
            }}>
              <FileText style={{ width: '1.25rem', height: '1.25rem' }} />
              <span>Upload Report</span>
            </a>
            
            <a href="/disputes/create/" style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              padding: '1rem',
              background: '#f8fafc',
              borderRadius: '8px',
              textDecoration: 'none',
              color: '#374151',
              border: '1px solid #e5e7eb',
              transition: 'all 0.2s ease'
            }}>
              <Target style={{ width: '1.25rem', height: '1.25rem' }} />
              <span>Create Dispute</span>
            </a>
            
            <a href="/relief/" style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              padding: '1rem',
              background: '#f8fafc',
              borderRadius: '8px',
              textDecoration: 'none',
              color: '#374151',
              border: '1px solid #e5e7eb',
              transition: 'all 0.2s ease'
            }}>
              <TrendingUp style={{ width: '1.25rem', height: '1.25rem' }} />
              <span>Relief Finder</span>
            </a>
          </div>
        </div>

        {/* Recent Activity */}
        <div style={{ 
          background: 'white',
          borderRadius: '12px',
          padding: '1.5rem',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
          border: '1px solid #e5e7eb'
        }}>
          <h2 style={{ 
            fontSize: '1.5rem', 
            fontWeight: 'bold', 
            color: '#1f2937',
            marginBottom: '1rem'
          }}>
            Recent Activity
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {dashboardData?.recentActivity.map((activity) => (
              <div key={activity.id} style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                padding: '1rem',
                background: '#f8fafc',
                borderRadius: '8px',
                border: '1px solid #e5e7eb'
              }}>
                <div style={{
                  width: '2rem',
                  height: '2rem',
                  borderRadius: '50%',
                  background: activity.status === 'completed' ? '#10b981' : 
                             activity.status === 'pending' ? '#f59e0b' : '#3b82f6',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {activity.status === 'completed' ? (
                    <CheckCircle style={{ width: '1rem', height: '1rem', color: 'white' }} />
                  ) : (
                    <Clock style={{ width: '1rem', height: '1rem', color: 'white' }} />
                  )}
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ color: '#374151', fontWeight: '500', marginBottom: '0.25rem' }}>
                    {activity.description}
                  </p>
                  <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>
                    {activity.timestamp}
                  </p>
                </div>
                <div style={{
                  padding: '0.25rem 0.75rem',
                  borderRadius: '12px',
                  fontSize: '0.75rem',
                  fontWeight: '500',
                  background: activity.status === 'completed' ? '#dcfce7' : 
                             activity.status === 'pending' ? '#fef3c7' : '#dbeafe',
                  color: activity.status === 'completed' ? '#166534' : 
                         activity.status === 'pending' ? '#92400e' : '#1e40af'
                }}>
                  {activity.status}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}


