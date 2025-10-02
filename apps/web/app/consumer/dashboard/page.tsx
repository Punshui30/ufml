'use client';

import { useState, useEffect } from 'react';
import { Target, Clipboard, Link as LinkIcon, CreditCard, TrendingUp, AlertCircle } from 'lucide-react';
import { api } from '../../lib/api';

interface ConsumerStats {
  creditScore: number;
  disputesActive: number;
  reportsUploaded: number;
  reliefPrograms: number;
}

interface RecentActivity {
  id: string;
  type: string;
  description: string;
  status: string;
  timestamp: string;
}

export default function ConsumerDashboard() {
  const [stats, setStats] = useState<ConsumerStats>({
    creditScore: 0,
    disputesActive: 0,
    reportsUploaded: 0,
    reliefPrograms: 0
  });
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Only fetch data on client side
    if (typeof window !== 'undefined') {
      fetchDashboardData();
    }
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch user's credit score and activity
      const reportsResponse = await api('/reports');
      const disputesResponse = await api('/disputes');
      const reliefResponse = await api('/relief/recommend', {
        method: 'POST',
        body: JSON.stringify({ client_id: 'current_user' })
      });

      const reports = reportsResponse.reports || [];
      const disputes = disputesResponse.disputes || [];
      const reliefPrograms = reliefResponse.programs || [];

      setStats({
        creditScore: reports.length > 0 ? 720 : 0, // Mock score
        disputesActive: disputes.filter((d: any) => d.status === 'sent').length,
        reportsUploaded: reports.length,
        reliefPrograms: reliefPrograms.length
      });

      // Create recent activity
      const activity: RecentActivity[] = [];
      
      disputes.slice(0, 3).forEach((dispute: any) => {
        activity.push({
          id: dispute.id,
          type: 'dispute',
          description: `Dispute sent to ${dispute.bureau}`,
          status: dispute.status,
          timestamp: dispute.sent_at || dispute.created_at
        });
      });

      reports.slice(0, 2).forEach((report: any) => {
        activity.push({
          id: report.id,
          type: 'report',
          description: 'Credit report uploaded',
          status: report.has_parsed_data ? 'processed' : 'processing',
          timestamp: report.created_at
        });
      });

      activity.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      setRecentActivity(activity.slice(0, 5));

    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{minHeight: '100vh', backgroundColor: '#f9fafb'}}>
      {/* Dashboard Header */}
      <section style={{background: 'white', borderBottom: '1px solid #e5e7eb', padding: '2rem 0'}}>
        <div className="container">
          <h1>My Credit Dashboard</h1>
          <p style={{color: '#6b7280'}}>Track your credit repair progress and financial relief opportunities</p>
        </div>
      </section>

      {/* Dashboard Content */}
      <section style={{padding: '3rem 0'}}>
        <div className="container">
          
          {/* Stats Cards */}
          <div className="features-grid" style={{marginBottom: '3rem'}}>
            <div className="card">
              <div className="card-body" style={{textAlign: 'center'}}>
                <div style={{fontSize: '2.5rem', fontWeight: 'bold', color: '#3b82f6', marginBottom: '0.5rem'}}>
                  {loading ? '...' : stats.creditScore}
                </div>
                <div style={{color: '#6b7280'}}>Credit Score</div>
              </div>
            </div>
            
            <div className="card">
              <div className="card-body" style={{textAlign: 'center'}}>
                <div style={{fontSize: '2.5rem', fontWeight: 'bold', color: '#10b981', marginBottom: '0.5rem'}}>
                  {loading ? '...' : stats.disputesActive}
                </div>
                <div style={{color: '#6b7280'}}>Active Disputes</div>
              </div>
            </div>
            
            <div className="card">
              <div className="card-body" style={{textAlign: 'center'}}>
                <div style={{fontSize: '2.5rem', fontWeight: 'bold', color: '#f59e0b', marginBottom: '0.5rem'}}>
                  {loading ? '...' : stats.reportsUploaded}
                </div>
                <div style={{color: '#6b7280'}}>Reports Uploaded</div>
              </div>
            </div>

            <div className="card">
              <div className="card-body" style={{textAlign: 'center'}}>
                <div style={{fontSize: '2.5rem', fontWeight: 'bold', color: '#8b5cf6', marginBottom: '0.5rem'}}>
                  {loading ? '...' : stats.reliefPrograms}
                </div>
                <div style={{color: '#6b7280'}}>Relief Programs</div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="card">
            <div className="card-header">
              <h3>Quick Actions</h3>
            </div>
            <div className="card-body">
              <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem'}}>
                <a href="/reports/upload" className="btn btn-primary">Upload Credit Report</a>
                <a href="/disputes/create" className="btn btn-secondary">Create Dispute</a>
                <a href="/consumer/relief" className="btn btn-secondary">Find Relief Programs</a>
                <a href="/reports/free-pull" className="btn btn-secondary">Get Free Report</a>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="card" style={{marginTop: '2rem'}}>
            <div className="card-header">
              <h3>Recent Activity</h3>
            </div>
            <div className="card-body">
              {loading ? (
                <div style={{textAlign: 'center', padding: '2rem', color: '#6b7280'}}>
                  Loading recent activity...
                </div>
              ) : recentActivity.length > 0 ? (
                <div style={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>
                  {recentActivity.map((activity) => (
                    <div key={activity.id} style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem', background: '#f9fafb', borderRadius: '0.375rem'}}>
                      <div>
                        <strong>{activity.description}</strong>
                        <div style={{fontSize: '0.875rem', color: '#9ca3af', marginTop: '2px'}}>
                          {new Date(activity.timestamp).toLocaleDateString()}
                        </div>
                      </div>
                      <span className={`badge ${
                        activity.status === 'delivered' || activity.status === 'processed' ? 'badge-success' :
                        activity.status === 'processing' ? 'badge-info' :
                        activity.status === 'sent' ? 'badge-warning' : 'badge-secondary'
                      }`}>
                        {activity.status === 'delivered' ? 'Delivered' :
                         activity.status === 'processed' ? 'Processed' :
                         activity.status === 'processing' ? 'Processing' :
                         activity.status === 'sent' ? 'Sent' : activity.status}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{textAlign: 'center', padding: '2rem', color: '#6b7280'}}>
                  No recent activity. Start by uploading a credit report or creating a dispute.
                </div>
              )}
            </div>
          </div>

        </div>
      </section>
    </div>
  );
}


