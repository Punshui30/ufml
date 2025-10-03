"use client";

// import ProtectedRoute from '../components/ProtectedRoute';
import { useState, useEffect } from 'react';
import { Target, Clipboard, Link as LinkIcon } from 'lucide-react';
import { api } from '../api';
// Navigation is included globally in layout.tsx

interface DashboardStats {
  activeClients: number;
  disputesSent: number;
  pendingResponses: number;
}

interface RecentActivity {
  id: string;
  type: string;
  description: string;
  status: string;
  timestamp: string;
  clientName?: string;
}

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    activeClients: 0,
    disputesSent: 0,
    pendingResponses: 0
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
      // Fetch clients count
      const clientsResponse = await api('/clients');
      const activeClients = clientsResponse.clients?.length || 0;

      // Fetch disputes data
      const disputesResponse = await api('/disputes');
      const disputes = disputesResponse.disputes || [];
      const disputesSent = disputes.filter((d: any) => d.status === 'sent').length;
      const pendingResponses = disputes.filter((d: any) => d.status === 'sent' && new Date(d.due_at) > new Date()).length;

      // Fetch reports for recent activity
      const reportsResponse = await api('/reports');
      const reports = reportsResponse.reports || [];

      setStats({
        activeClients,
        disputesSent,
        pendingResponses
      });

      // Create recent activity from real data
      const activity: RecentActivity[] = [];
      
      // Add recent disputes
      disputes.slice(0, 3).forEach((dispute: any) => {
        activity.push({
          id: dispute.id,
          type: 'dispute',
          description: `Dispute sent to ${dispute.bureau}`,
          status: dispute.status === 'sent' ? 'delivered' : dispute.status,
          timestamp: dispute.sent_at || dispute.created_at,
          clientName: 'Client' // We'd need to join with user data for real names
        });
      });

      // Add recent reports
      reports.slice(0, 2).forEach((report: any) => {
        activity.push({
          id: report.id,
          type: 'report',
          description: 'Credit report uploaded',
          status: report.has_parsed_data ? 'processed' : 'processing',
          timestamp: report.created_at,
          clientName: 'Client'
        });
      });

      // Sort by timestamp and take most recent
      activity.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      setRecentActivity(activity.slice(0, 5));

    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
      // Keep default values (0) if API fails
    } finally {
      setLoading(false);
    }
  };

  const handleActivityClick = (activity: RecentActivity) => {
    // Navigate based on activity type
    if (activity.type === 'dispute') {
      window.location.href = `/disputes/${activity.id}`;
    } else if (activity.type === 'report') {
      window.location.href = `/reports/${activity.id}`;
    }
  };

  const handleDeleteActivity = async (activityId: string) => {
    if (!confirm('Are you sure you want to delete this activity?')) {
      return;
    }

    try {
      // Remove from local state immediately for better UX
      setRecentActivity(prev => prev.filter(activity => activity.id !== activityId));
      
      // If it's a report, also delete from backend
      const activity = recentActivity.find(a => a.id === activityId);
      if (activity?.type === 'report') {
        await api(`/reports/${activityId}`, {
          method: 'DELETE'
        });
      }
      
      // Show success message
      alert('Activity deleted successfully');
    } catch (error) {
      console.error('Failed to delete activity:', error);
      alert('Failed to delete activity. Please try again.');
      // Refresh the data to restore the correct state
      fetchDashboardData();
    }
  };

  return (
    <div style={{minHeight: '100vh', backgroundColor: '#f9fafb'}}>

      {/* Dashboard Header */}
      <section style={{background: 'white', borderBottom: '1px solid #e5e7eb', padding: '2rem 0'}}>
        <div className="container">
          <h1>UFML Dashboard</h1>
          <p style={{color: '#6b7280'}}>Un Fuck My Life - Credit Repair & Financial Freedom</p>
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
                  {loading ? '...' : stats.activeClients}
                </div>
                <div style={{color: '#6b7280'}}>Active Clients</div>
              </div>
            </div>
            
            <div className="card">
              <div className="card-body" style={{textAlign: 'center'}}>
                <div style={{fontSize: '2.5rem', fontWeight: 'bold', color: '#10b981', marginBottom: '0.5rem'}}>
                  {loading ? '...' : stats.disputesSent}
                </div>
                <div style={{color: '#6b7280'}}>Disputes Sent</div>
              </div>
            </div>
            
            <div className="card">
              <div className="card-body" style={{textAlign: 'center'}}>
                <div style={{fontSize: '2.5rem', fontWeight: 'bold', color: '#f59e0b', marginBottom: '0.5rem'}}>
                  {loading ? '...' : stats.pendingResponses}
                </div>
                <div style={{color: '#6b7280'}}>Pending Responses</div>
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
                <a href="/clients/new" className="btn btn-primary" style={{fontSize: '1.1rem', padding: '0.75rem 1.5rem'}}>
                  + Create New Client
                </a>
                <a href="/reports/upload" className="btn btn-secondary">Upload Credit Report</a>
                <a href="/disputes/create" className="btn btn-secondary">Create Dispute</a>
                <a href="/mail/send" className="btn btn-secondary">Send Mail</a>
              </div>
            </div>
          </div>

          {/* Client Management Section */}
          <div className="card" style={{marginBottom: '3rem', background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', color: 'white'}}>
            <div className="card-header" style={{background: 'rgba(255,255,255,0.1)', borderBottom: '1px solid rgba(255,255,255,0.2)'}}>
              <h3 style={{color: 'white', margin: 0}}>👥 Manage Your Clients</h3>
            </div>
            <div className="card-body">
              <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem'}}>
                <div style={{flex: 1, minWidth: '300px'}}>
                  <p style={{margin: '0 0 1rem 0', color: 'rgba(255,255,255,0.9)'}}>
                    Create and manage your credit repair clients. Add new clients to start processing their credit reports and disputes.
                  </p>
                  <div style={{display: 'flex', gap: '0.5rem', flexWrap: 'wrap'}}>
                    <span style={{background: 'rgba(255,255,255,0.2)', padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.875rem'}}>
                      Client Management
                    </span>
                    <span style={{background: 'rgba(255,255,255,0.2)', padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.875rem'}}>
                      Credit Reports
                    </span>
                    <span style={{background: 'rgba(255,255,255,0.2)', padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.875rem'}}>
                      Dispute Tracking
                    </span>
                  </div>
                </div>
                <div style={{display: 'flex', gap: '1rem', alignItems: 'center'}}>
                  <a 
                    href="/clients/new"
                    style={{
                      background: 'rgba(255,255,255,0.2)',
                      color: 'white',
                      textDecoration: 'none',
                      padding: '0.75rem 1.5rem',
                      borderRadius: '8px',
                      border: '1px solid rgba(255,255,255,0.3)',
                      fontWeight: '500',
                      transition: 'all 0.2s ease-in-out'
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.background = 'rgba(255,255,255,0.3)';
                      e.currentTarget.style.transform = 'translateY(-1px)';
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.background = 'rgba(255,255,255,0.2)';
                      e.currentTarget.style.transform = 'translateY(0)';
                    }}
                  >
                    Create New Client
                  </a>
                  <a 
                    href="/clients"
                    style={{
                      background: 'rgba(255,255,255,0.9)',
                      color: '#10b981',
                      textDecoration: 'none',
                      padding: '0.75rem 1.5rem',
                      borderRadius: '8px',
                      fontWeight: '500',
                      transition: 'all 0.2s ease-in-out'
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.background = 'white';
                      e.currentTarget.style.transform = 'translateY(-1px)';
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.background = 'rgba(255,255,255,0.9)';
                      e.currentTarget.style.transform = 'translateY(0)';
                    }}
                  >
                    View All Clients
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Connect Accounts Section */}
          <div className="card" style={{marginBottom: '3rem', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white'}}>
            <div className="card-header" style={{background: 'rgba(255,255,255,0.1)', borderBottom: '1px solid rgba(255,255,255,0.2)'}}>
              <h3 style={{color: 'white', margin: 0}}>🔗 Connect Your Credit Accounts</h3>
            </div>
            <div className="card-body">
              <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem'}}>
                <div style={{flex: 1, minWidth: '300px'}}>
                  <p style={{margin: '0 0 1rem 0', color: 'rgba(255,255,255,0.9)'}}>
                    Connect your existing credit monitoring accounts to automatically import and analyze your credit data. 
                    No manual data entry required - we'll pull everything directly from your trusted sources.
                  </p>
                  <div style={{display: 'flex', gap: '0.5rem', flexWrap: 'wrap'}}>
                    <span style={{background: 'rgba(255,255,255,0.2)', padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.875rem'}}>
                      OAuth 2.0 Secure
                    </span>
                    <span style={{background: 'rgba(255,255,255,0.2)', padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.875rem'}}>
                      Real-time Sync
                    </span>
                    <span style={{background: 'rgba(255,255,255,0.2)', padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.875rem'}}>
                      AI Analysis
                    </span>
                  </div>
                </div>
                <div style={{display: 'flex', gap: '1rem', alignItems: 'center'}}>
                  <a 
                    href="/portal-integration"
                    style={{
                      background: 'rgba(255,255,255,0.2)',
                      color: 'white',
                      textDecoration: 'none',
                      padding: '0.75rem 1.5rem',
                      borderRadius: '8px',
                      border: '1px solid rgba(255,255,255,0.3)',
                      fontWeight: '500',
                      transition: 'all 0.2s ease-in-out'
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.background = 'rgba(255,255,255,0.3)';
                      e.currentTarget.style.transform = 'translateY(-1px)';
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.background = 'rgba(255,255,255,0.2)';
                      e.currentTarget.style.transform = 'translateY(0)';
                    }}
                  >
                    Connect Accounts
                  </a>
                  <a 
                    href="/reports/free-pull"
                    style={{
                      background: 'rgba(255,255,255,0.9)',
                      color: '#667eea',
                      textDecoration: 'none',
                      padding: '0.75rem 1.5rem',
                      borderRadius: '8px',
                      fontWeight: '500',
                      transition: 'all 0.2s ease-in-out'
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.background = 'white';
                      e.currentTarget.style.transform = 'translateY(-1px)';
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.background = 'rgba(255,255,255,0.9)';
                      e.currentTarget.style.transform = 'translateY(0)';
                    }}
                  >
                    Upload PDF
                  </a>
                </div>
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
                    <div key={activity.id} style={{
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center', 
                      padding: '0.75rem', 
                      background: '#f9fafb', 
                      borderRadius: '0.375rem',
                      border: '1px solid #e5e7eb',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease-in-out'
                    }}
                    onClick={() => handleActivityClick(activity)}
                    onMouseOver={(e) => {
                      e.currentTarget.style.background = '#f3f4f6';
                      e.currentTarget.style.borderColor = '#d1d5db';
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.background = '#f9fafb';
                      e.currentTarget.style.borderColor = '#e5e7eb';
                    }}>
                      <div style={{flex: 1}}>
                        <strong>{activity.clientName || 'Client'}</strong> - {activity.description}
                        <div style={{fontSize: '0.875rem', color: '#9ca3af', marginTop: '2px'}}>
                          {new Date(activity.timestamp).toLocaleDateString()}
                        </div>
                      </div>
                      <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
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
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteActivity(activity.id);
                          }}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: '#ef4444',
                            cursor: 'pointer',
                            padding: '0.25rem',
                            borderRadius: '0.25rem',
                            fontSize: '0.875rem',
                            transition: 'all 0.2s ease-in-out'
                          }}
                          onMouseOver={(e) => {
                            e.currentTarget.style.background = '#fee2e2';
                          }}
                          onMouseOut={(e) => {
                            e.currentTarget.style.background = 'none';
                          }}
                          title="Delete activity"
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{textAlign: 'center', padding: '2rem', color: '#6b7280'}}>
                  No recent activity. Start by adding a client or creating a dispute.
                </div>
              )}
            </div>
          </div>

          {/* ReliefFinder Widget */}
          <div className="card" style={{marginTop: '2rem'}}>
            <div className="card-header">
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                <h3>🆘 ReliefFinder</h3>
                <a href="/relief" className="btn btn-secondary" style={{fontSize: '0.875rem'}}>
                  View All Programs
                </a>
              </div>
            </div>
            <div className="card-body">
              <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem'}}>
                <div style={{textAlign: 'center', padding: '1rem', background: '#f0fdf4', borderRadius: '0.375rem', border: '1px solid #bbf7d0'}}>
                  <div style={{marginBottom: '0.5rem'}}><Target className="w-8 h-8 text-blue-600" /></div>
                  <h4 style={{color: '#166534', marginBottom: '0.5rem'}}>Smart Matching</h4>
                  <p style={{fontSize: '0.875rem', color: '#16a34a'}}>
                    AI-powered relief program recommendations based on client financial profiles and credit reports.
                  </p>
                </div>
                <div style={{textAlign: 'center', padding: '1rem', background: '#eff6ff', borderRadius: '0.375rem', border: '1px solid #bfdbfe'}}>
                  <div style={{marginBottom: '0.5rem'}}><Clipboard className="w-8 h-8 text-blue-600" /></div>
                  <h4 style={{color: '#1e40af', marginBottom: '0.5rem'}}>Auto-Populated Forms</h4>
                  <p style={{fontSize: '0.875rem', color: '#2563eb'}}>
                    Dispute letters automatically populated with data from uploaded credit reports.
                  </p>
                </div>
                <div style={{textAlign: 'center', padding: '1rem', background: '#faf5ff', borderRadius: '0.375rem', border: '1px solid #d8b4fe'}}>
                  <div style={{marginBottom: '0.5rem'}}><LinkIcon className="w-8 h-8 text-blue-600" /></div>
                  <h4 style={{color: '#7c2d12', marginBottom: '0.5rem'}}>Integrated Workflow</h4>
                  <p style={{fontSize: '0.875rem', color: '#a855f7'}}>
                    Seamlessly integrated into dispute creation and client management workflows.
                  </p>
                </div>
              </div>
              <div style={{textAlign: 'center', marginTop: '1.5rem'}}>
                <a href="/relief" className="btn btn-primary">
                  Try ReliefFinder Integration
                </a>
              </div>
            </div>
          </div>

        </div>
      </section>
    </div>
  );
}
